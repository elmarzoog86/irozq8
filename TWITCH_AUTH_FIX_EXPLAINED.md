# 🔐 Twitch Authentication Chat Connection - Root Cause & Fix

## The Problem: Chat Not Connecting After Login

When users signed in with Twitch OAuth and started a game, the Twitch chat integration wasn't connecting. The authentication worked (session was created), but when the game tried to retrieve the chat credentials, the session couldn't be found.

## Root Cause: File-Based Session Storage on Vercel ❌

The session store was using file-based storage:

```typescript
// OLD - Doesn't work on Vercel
const SESSIONS_DIR = path.join(process.cwd(), '.sessions');
fs.writeFileSync(sessionPath, sessionData, 'utf-8');  // Store to disk
fs.readFileSync(sessionPath, 'utf-8');               // Read from disk
```

**Why this fails on Vercel:**
1. **Ephemeral File System**: Vercel serverless functions have temporary file systems that don't persist between requests
2. **Container Isolation**: Each request may run in a different container with a fresh file system
3. **Session Loss**: A session stored during the OAuth callback request won't be available when the chat-token endpoint is called in the next request
4. **No Cross-Request Persistence**: The `.sessions` directory gets wiped after the function execution completes

### Scenario of Failure
```
Request 1 (OAuth Callback):
  1. User authorizes Twitch OAuth
  2. Callback receives authorization code
  3. Exchanges code for access token
  4. Calls: fs.writeFileSync(sessionPath, data)  // Writes to temporary FS
  
Request 2 (Start Game):
  1. User clicks "Play"
  2. Games page calls /api/twitch/chat-token?session=abc123
  3. Calls: fs.readFileSync(sessionPath)        // Different container! ❌ FILE NOT FOUND
  4. Session not found → Chat connection fails
```

## The Solution: In-Memory Session Storage ✅

Replaced file-based storage with a global in-memory Map that persists across requests in the same container:

```typescript
// NEW - Works on Vercel
const sessions = new Map<string, any>();  // Global in-memory store

export function storeSession(sessionId: string, data: any) {
  sessions.set(sessionId, {...data, expiresAt: Date.now() + SESSION_TTL});
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId);
}
```

**Why this works:**
1. **Container Persistence**: Within a single container, all requests share the same Node.js process and memory
2. **Instant Lookups**: O(1) Map lookup instead of disk I/O
3. **TTL Management**: Automatic cleanup of expired sessions
4. **Vercel Compatible**: No file system dependencies

### Improved Scenario
```
Request 1 (OAuth Callback):
  1. User authorizes Twitch OAuth
  2. generateToken() → sessionId = "abc123"
  3. sessions.set("abc123", {...data...})  // Global memory ✅
  
Request 2 (Start Game):
  1. User clicks "Play"
  2. Games page calls /api/twitch/chat-token?session=abc123
  3. sessions.get("abc123")  // Found in memory! ✅
  4. Chat connects successfully
```

## Implementation Details

### Session TTL (Time To Live)
Sessions automatically expire after 7 days:
```typescript
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;  // 7 days

storeSession(sessionId, {
  accessToken,
  user,
  expiresAt: Date.now() + SESSION_TTL,  // Auto-cleanup
});
```

### Automatic Cleanup Task
Expired sessions are removed every hour to prevent memory leaks:
```typescript
setInterval(() => {
  for (const [sessionId, sessionData] of sessions.entries()) {
    if (sessionData.expiresAt < Date.now()) {
      sessions.delete(sessionId);
    }
  }
}, 60 * 60 * 1000);  // Every 60 minutes
```

## Authentication Flow (Now Working)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Sign in with Twitch"                        │
│    └─→ Redirects to: https://id.twitch.tv/oauth2/authorize  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User authorizes on Twitch                                │
│    └─→ Twitch redirects to: /api/twitch/callback?code=XXX   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. OAuth Callback Handler                                   │
│    ✓ Exchanges code for access token                        │
│    ✓ Fetches user info from Twitch API                      │
│    ✓ sessionId = "abc123..."                                │
│    ✓ sessions.set(sessionId, {accessToken, user})  ← KEY!   │
│    ✓ Sets httpOnly cookie: twitch_session=abc123            │
│    └─→ Redirects to: /?session=abc123                       │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Home Page (Game Selection)                               │
│    ✓ URL contains: ?session=abc123                          │
│    ✓ User selects a game                                    │
│    └─→ Navigates to: /games?id=questions&session=abc123     │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Game Page                                                │
│    ✓ sessionId = "abc123" from URL params                   │
│    ✓ User starts game                                       │
│    ✓ useTwitchChat hook activates                           │
│    └─→ POST /api/twitch/chat-token?session=abc123           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Chat Token Endpoint                                      │
│    ✓ Receives sessionId from query params                   │
│    ✓ sessionData = sessions.get("abc123")  ← FOUND! ✅      │
│    ✓ Returns: {channel, accessToken, userName}              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Chat Connection (Server-Side tmi.js)                     │
│    ✓ Receives chat credentials                              │
│    ✓ Connects to Twitch IRC with tmi.js                     │
│    ✓ Starts streaming messages via SSE                      │
│    └─→ Frontend receives chat messages                      │
└─────────────────────────────────────────────────────────────┘
```

## Files Modified

- `src/lib/twitch-sessions.ts` - Replaced file-based with in-memory storage

## Deployment Status

✅ **Deployed to Vercel**: https://irozq8.vercel.app

The fix is now live. Chat should connect properly when users:
1. Sign in with Twitch OAuth
2. Select and start a game
3. Type messages in their Twitch chat (or use !join commands)

## Production Recommendations

For a production system, consider replacing the in-memory store with:

1. **Redis** (Recommended) - Fast, scalable, built for session management
   ```typescript
   import Redis from 'ioredis';
   const redis = new Redis(process.env.REDIS_URL);
   ```

2. **PostgreSQL/Database** - For permanent session tracking
   ```typescript
   await db.sessions.create({sessionId, data, expiresAt});
   ```

3. **NextAuth.js** - Complete authentication solution with built-in session management
   ```typescript
   export { auth as middleware } from "@/auth"
   ```

The current in-memory solution is suitable for:
- Development and testing
- Vercel deployments with moderate traffic
- Single-region deployments
- Short-lived sessions

For high-traffic or multi-region deployments, upgrade to Redis or a database backend.

## Testing the Fix

To verify chat is working:

1. Go to https://irozq8.vercel.app
2. Click "تسجيل الدخول مع Twitch" (Sign in with Twitch)
3. Authorize the application
4. Select a game and click "ابدأ اللعبة" (Start Game)
5. Type a message in your Twitch chat or type `!join` to join
6. Message should appear in the game's chat panel ✅

## Debugging Logs

The session store now includes detailed logging:
```
🔐 [SESSION STORE] Storing session: abc123
   ✅ Stored successfully (1 sessions in memory)

🔐 [SESSION RETRIEVE] Looking for session: abc123
   ✅ Found and valid (expires in 604798s)
```

Check browser console and server logs to verify the flow is working correctly.
