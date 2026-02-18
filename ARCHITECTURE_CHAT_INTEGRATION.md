# 🏗️ TWITCH CHAT INTEGRATION - ARCHITECTURE

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR TWITCH PLATFORM                    │
└─────────────────────────────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐       ┌────────▼─────────┐
        │  Your Browser  │       │  Twitch Servers  │
        │  (Games Page)  │       │   (Chat API)     │
        └────────┬────────┘       └────────▲─────────┘
                 │                          │
         ┌──────────────────────────────────┼──────────────┐
         │                                  │              │
    ┌────▼─────────────────────────────────────────────────▼────┐
    │                   Next.js App (localhost:3000)            │
    │                                                           │
    │  ┌──────────────────────────────────────────────────┐    │
    │  │  Frontend (React)                                │    │
    │  │  - Games Page (src/app/games/page.tsx)          │    │
    │  │  - useTwitchChat Hook (src/hooks/)              │    │
    │  │  - QuestionsGame Component                      │    │
    │  └──────────────────────────────────────────────────┘    │
    │                        │                                  │
    │  ┌──────────────────────────────────────────────────┐    │
    │  │  Backend (Node.js)                               │    │
    │  │  - API Routes (src/app/api/)                     │    │
    │  │  - Chat Token Endpoint                          │    │
    │  │  - Session Management                           │    │
    │  │  - OAuth Handling                               │    │
    │  └──────────────────────────────────────────────────┘    │
    │                        │                                  │
    │  ┌──────────────────────────────────────────────────┐    │
    │  │  Libraries                                       │    │
    │  │  - tmi.js (Twitch chat connection)              │    │
    │  │  - twitch-chat-connector.ts (wrapper)           │    │
    │  └──────────────────────────────────────────────────┘    │
    └─────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Login Flow

```
User clicks "دخول من خلال Twitch"
         ↓
Redirected to Twitch OAuth
         ↓
User authorizes app
         ↓
Backend receives OAuth code
         ↓
Backend exchanges code for access token
         ↓
Token stored in session (in-memory Map)
         ↓
Redirect to home page with session ID in URL
         ↓
User sees all 4 games
```

### 2. Game Start Flow

```
User clicks "جولة أسئلة"
         ↓
Games page renders with sessionId from URL
         ↓
QuestionsLobby component shown
         ↓
User clicks "ابدأ اللعبة" (Start Game)
         ↓
gameStarted state = true
         ↓
useTwitchChat hook activates (enabled: true)
         ↓
Hook calls /api/twitch/chat-token?action=connect&session=ID
         ↓
Backend validates session
         ↓
Backend returns { channel, accessToken, userName }
         ↓
Frontend creates tmi.js client
         ↓
Client authenticates with OAuth token
         ↓
Client joins Twitch channel
         ↓
Browser console: "✅ Connected to Twitch chat: channel"
         ↓
Game ready for viewer answers!
```

### 3. Chat Message Processing Flow

```
Viewer types "أ" in Twitch chat
         ↓
Bot receives message event
         ↓
Message passed to processGameAnswer()
         ↓
Answer parsed (أ = index 0 = Option A)
         ↓
useTwitchChat hook calls onAnswer callback
         ↓
onAnswer calls: questionsGameRef.current.handleChatAnswer()
         ↓
QuestionsGame component receives answer
         ↓
Component checks: Is this the current question?
         ↓
Component checks: Is this option correct?
         ↓
Component awards points (if correct)
         ↓
Component updates:
   - Player score
   - Player list
   - Leaderboard
         ↓
React re-renders with new scores
         ↓
Viewers see "Viewer123: أ ✓ +10" on screen
```

---

## Component Architecture

### File Structure

```
src/
├── app/
│   ├── games/
│   │   └── page.tsx
│   │       ├── Imports useTwitchChat
│   │       ├── Gets sessionId from URL
│   │       ├── Passes ref to QuestionsGame
│   │       └── Receives onAnswer callback
│   │
│   └── api/
│       └── twitch/
│           ├── callback/
│           │   └── route.ts (OAuth handling)
│           ├── session/
│           │   └── route.ts (Session management)
│           └── chat-token/
│               └── route.ts (NEW - Chat token endpoint)
│
├── components/
│   ├── QuestionsGame.tsx
│   │   ├── Exports: QuestionsGameHandle interface
│   │   ├── Method: handleChatAnswer()
│   │   └── Uses: forwardRef for imperative calls
│   │
│   ├── GameLayout.tsx
│   └── QuestionsLobby.tsx
│
├── hooks/
│   └── useTwitchChat.ts (NEW)
│       ├── Manages Twitch connection lifecycle
│       ├── Auto-connects when sessionId provided
│       ├── Auto-disconnects on unmount
│       └── Calls onAnswer callback
│
└── lib/
    └── twitch-chat-connector.ts (NEW)
        ├── Wraps tmi.js
        ├── Handles connection
        ├── Parses answers
        └── Routes to game
```

---

## Key Components Explained

### 1. useTwitchChat Hook

**File**: `src/hooks/useTwitchChat.ts`

**Purpose**: Manages Twitch chat connection lifecycle

**Usage**:
```typescript
useTwitchChat({
  sessionId: string,              // User's session ID
  enabled: boolean,               // Enable/disable connection
  onAnswer?: (pi, un, ans) => {}, // Called when answer received
  onMessage?: (un, msg) => {},    // Called on any message
})
```

**Flow**:
1. Receives `sessionId`
2. Makes API call to `/api/twitch/chat-token`
3. Gets `channel`, `accessToken`, `userName`
4. Creates tmi.js client
5. Joins channel
6. Sets up message listener
7. Calls `onAnswer` when answer detected
8. Auto-disconnects on unmount

### 2. twitch-chat-connector.ts

**File**: `src/lib/twitch-chat-connector.ts`

**Purpose**: Wrapper around tmi.js for Twitch chat

**Key Methods**:

```typescript
connect(options) {
  // Initialize TMI.js client
  // Set up event listeners
  // Connect to chat
  // Returns promise
}

processGameAnswer(username, message) {
  // Parse message as answer
  // Convert to standard format
  // Return { playerIndex, playerName, answer }
}

sendMessage(message) {
  // Send message to chat
  // Returns promise
}

disconnect() {
  // Clean up connection
  // Remove listeners
}
```

### 3. Chat Token Endpoint

**File**: `src/app/api/twitch/chat-token/route.ts`

**Purpose**: Provide chat credentials securely

**Request**: 
```
GET /api/twitch/chat-token?action=connect&session=SESSION_ID
```

**Response**:
```json
{
  "channel": "user_channel_name",
  "accessToken": "oauth:xxxxx",
  "userName": "user_name"
}
```

**Security**:
- Validates session before returning token
- Token never exposed in frontend code
- Only returned when requested via API

---

## Answer Parsing Logic

The system accepts multiple answer formats:

### For Option 1 (Index 0):
- Arabic letter: `أ`
- English letter: `A` or `a`
- Number: `1`
- Full text: `الرياض` (if that's the answer)

### For Option 2 (Index 1):
- Arabic letter: `ب`
- English letter: `B` or `b`
- Number: `2`
- Full text: `القاهرة`

### For Option 3 (Index 2):
- Arabic letter: `ج`
- English letter: `C` or `c`
- Number: `3`
- Full text: `أبو ظبي`

### For Option 4 (Index 3):
- Arabic letter: `د`
- English letter: `D` or `d`
- Number: `4`
- Full text: `الدوحة`

**Parser Code** (from twitch-chat-connector.ts):
```typescript
processGameAnswer(username, message) {
  const msg = message.trim().toLowerCase();
  
  // Map answers to indices
  const answerMap = {
    'أ': 0, 'a': 0, '1': 0,
    'ب': 1, 'b': 1, '2': 1,
    'ج': 2, 'c': 2, '3': 2,
    'د': 3, 'd': 3, '4': 3,
  };
  
  // Check if message matches a simple answer
  if (answerMap[msg] !== undefined) {
    return {
      playerIndex: answerMap[msg],
      playerName: username,
      answer: message,
    };
  }
  
  // If not a simple answer, check full text
  // ...
}
```

---

## Session Management

### Session Storage

```typescript
// sessions.ts (or similar)
const sessionStore = new Map<string, SessionData>();

interface SessionData {
  userId: string;
  userName: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}
```

### Session Lifecycle

```
1. User logs in
   └─ Session created with tokens

2. Session token returned in URL
   └─ Frontend stores in searchParams

3. Frontend sends sessionId with API calls
   └─ Backend validates and uses token

4. Session expires after TTL
   └─ User must login again

5. Session cleared on logout
   └─ Tokens removed from store
```

---

## Error Handling

### Connection Errors

If chat fails to connect:
```typescript
try {
  await twitchChatConnector.connect(options);
} catch (error) {
  console.error('Failed to connect to chat:', error);
  // Gracefully degrade
  // Game can still run without chat
}
```

### Answer Processing Errors

If answer can't be parsed:
```typescript
const parsed = processGameAnswer(username, message);
if (!parsed) {
  console.warn(`Couldn't parse answer: ${message}`);
  // Silently ignore invalid answers
}
```

### Session Errors

If session is invalid:
```typescript
const session = sessionStore.get(sessionId);
if (!session) {
  return new Response('Session not found', { status: 401 });
}
```

---

## Scalability Considerations

### Current Limitations
- In-memory session storage (resets on server restart)
- Connects one bot per streamer
- Single server (not load-balanced)

### For Production
- Use persistent session storage (Redis, database)
- Consider multiple bot instances
- Add monitoring and logging
- Implement rate limiting
- Add chat message validation
- Cache commonly used data

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Next.js 14 |
| Backend | Next.js API Routes, Node.js |
| Chat | tmi.js 1.8.5 |
| Auth | Twitch OAuth 2.0 |
| Styling | Tailwind CSS |
| State | React Hooks (useState, useRef) |

---

## Timeline of Requests

When you click "Start Game":

```
t=0ms   User clicks "ابدأ اللعبة"
        └─ setGameStarted(true)

t=10ms  GamePageContent re-renders
        └─ useTwitchChat hook runs

t=20ms  Hook calls /api/twitch/chat-token
        └─ Sends GET request with sessionId

t=50ms  Backend validates session
        └─ Retrieves access token

t=60ms  Backend returns credentials
        └─ Response: { channel, accessToken, userName }

t=70ms  Frontend creates tmi.js client
        └─ Initializes with returned credentials

t=100ms TMI.js authenticates with Twitch
        └─ Sends OAuth token to Twitch servers

t=150ms Bot connects to channel
        └─ Joins chat

t=160ms 'connected' event fires
        └─ Console: "✅ Connected to Twitch chat: channel"

t=170ms Bot ready to receive messages
        └─ Game playable via chat
```

---

## Summary

Your Twitch chat integration:
✅ Connects securely using OAuth  
✅ Joins your Twitch channel when game starts  
✅ Receives viewer messages in real-time  
✅ Parses answers in multiple formats  
✅ Routes answers to game components  
✅ Updates scores instantly  
✅ Auto-disconnects when game ends  
✅ Handles errors gracefully  

**Result**: Full interactive Twitch chat integration! 🎉
