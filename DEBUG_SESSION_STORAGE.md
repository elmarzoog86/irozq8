# 🔍 DEBUGGING GUIDE - Session Storage Issue

I've added enhanced logging to help diagnose why the session ID isn't being passed to the games page.

## Quick Test - Check Session Storage

Open your browser console and run:

```javascript
// Check if any sessions are stored in the backend
fetch('/api/twitch/session?action=debug')
  .then(r => r.json())
  .then(data => {
    console.log('Sessions in memory:');
    console.log(JSON.stringify(data, null, 2));
  });
```

This will show you:
- How many sessions are currently stored
- What user they belong to
- When they expire

## Complete Testing Flow

### 1. Clear Everything First
```
Press F12 (Developer Tools)
Application tab → Storage → Clear site data
Close and reopen browser
Go to: https://irozq8.vercel.app
```

### 2. Sign in with Twitch
```
Click: "تسجيل الدخول مع Twitch"
Watch console for logs like:
  🔐 [CALLBACK] Generated sessionId: abc123xyz
  🔐 [CALLBACK] About to store session...
  ✅ [CALLBACK] Session stored successfully
  🔍 [SESSION] VERIFICATION: Session retrieval test...
```

### 3. Check URL After Login
```
After authorizing Twitch:
Expected URL: https://irozq8.vercel.app/?session=abc123xyz
                                                      ^^^^^^^^^^^^^^
If you see this, session was passed ✅
If you DON'T see this, session wasn't created ❌
```

### 4. Run Debug Endpoint
```javascript
// In console, after login
fetch('/api/twitch/session?action=debug')
  .then(r => r.json())
  .then(console.log);

// Should show:
// {
//   success: true,
//   totalSessions: 1,
//   sessions: [{
//     sessionId: "abc123xyz",
//     user: "your_twitch_username",
//     expiresAt: "2026-03-01T..."
//   }]
// }
```

### 5. Select a Game and Check URL
```
Click on a game (e.g., "أسئلة")
Expected URL: /games?id=questions&session=abc123xyz
                                           ^^^^^^^^^^^^^^

If session is missing here, it's being lost during navigation ❌
```

### 6. Check Console Logs When Game Loads
```
Watch for:
  🎣 [HOOK] useTwitchChat called - enabled: false, sessionId: missing
  (or)
  🎣 [HOOK] useTwitchChat called - enabled: true, sessionId: present
```

## What Each Log Means

### During OAuth Callback
```
✅ 🔐 [CALLBACK] Generated sessionId: abc123xyz
   → Good: Session ID was generated

✅ ✅ [CALLBACK] Session stored successfully
   → Good: Session was saved to memory

🔍 [CALLBACK] VERIFICATION: Session retrieval test - SUCCESS ✅
   → Good: We could immediately read it back from memory
```

### When Accessing Home Page
```
✅ Fetching user info for session: abc123xyz
   → Good: Session ID is in URL

✅ User info response: {success: true, user: {...}}
   → Good: Session was found and user data retrieved
```

### When Selecting a Game
```
✅ router.push(`/games?id=questions&session=abc123xyz`)
   → Good: Session ID should be passed in URL
```

### When Game Page Loads
```
✅ 🎣 [HOOK] useTwitchChat called - enabled: true, sessionId: present
   → Good: Session ID reached the games page

🔐 [SESSION RETRIEVE] Looking for session: abc123xyz
   → Retrieving session

✅ ✅ Session found and valid
   → Good: Session exists in memory

❌ ❌ Session not found!
   → BAD: Session disappeared from memory
```

## Possible Issues & Solutions

### Issue 1: Session ID Not in URL After Login
```
URL shows: https://irozq8.vercel.app/
Expected:  https://irozq8.vercel.app/?session=abc123

Possible causes:
1. OAuth callback didn't redirect properly
2. Environment variables not set correctly
3. Twitch redirect URI mismatch

Check:
- Console logs during OAuth callback
- Vercel environment variables:
  - TWITCH_CLIENT_ID
  - TWITCH_CLIENT_SECRET
  - TWITCH_REDIRECT_URI (must be https://irozq8.vercel.app/api/twitch/callback)
```

### Issue 2: Session ID Lost When Clicking Game
```
Home page URL: https://irozq8.vercel.app/?session=abc123
Game page URL: /games?id=questions
               (session ID missing!)

This means handleSelectGame isn't passing the sessionId.
Check the code in src/app/page.tsx line 92-95
```

### Issue 3: Session Not Found in Memory
```
Console shows:
❌ 🔐 [SESSION RETRIEVE] Looking for session: abc123
   ❌ Session not found!

This means:
1. Session wasn't stored (callback failed)
2. Session expired (expired after 7 days)
3. Process restarted (lost in-memory data)

Check the OAuth callback logs to see if storeSession() was called
```

### Issue 4: useTwitchChat Says "sessionId: missing"
```
Console shows:
⚠️ [HOOK] useTwitchChat called - enabled: true, sessionId: missing

This means:
1. sessionId not in URL params
2. searchParams.get('session') returned null

Verify the games page URL has ?session=abc123
```

## Advanced Debug: Check Memory State

Add this to your console to manually verify:

```javascript
// Check session retrieval endpoint
fetch('/api/twitch/session?action=user&session=ABC123XYZ')
  .then(r => r.json())
  .then(data => {
    console.log('User data:');
    console.log(data);
  });
```

## Vercel Logs

Check Vercel project logs for these server-side messages:

```
🔐 [CALLBACK] Generated sessionId: abc123xyz
🔐 [CALLBACK] About to store session...
✅ [CALLBACK] Session stored successfully
🔍 Session retrieved successfully
📡 [HOOK] Fetching chat token...
✅ [HOOK] Got chat token
```

To view:
1. Go to https://vercel.com
2. Click your irozq8 project
3. Go to "Deployments" tab
4. Click the latest deployment
5. Click "View Build Logs"

## What to Share If It's Still Broken

If it's still not working, share:

1. **Browser console output** (screenshot or copy-paste of logs)
2. **URL after login** (does it have ?session=...)
3. **URL when selecting game** (does it have &session=...)
4. **Debug endpoint result** (run the fetch command above)
5. **Vercel build logs** (from the deployment)

With this info, I can pinpoint exactly where the issue is!

## Testing Checklist

- [ ] Cleared browser cache and cookies
- [ ] Hard refreshed page (Ctrl+Shift+R)
- [ ] Checked URL for ?session= parameter after login
- [ ] Ran debug endpoint to check sessions in memory
- [ ] Checked console for error messages
- [ ] Verified TWITCH_REDIRECT_URI in Vercel settings
- [ ] Checked that session ID appears in games page URL
- [ ] Looked at Vercel build logs for server-side errors

---

**Updated**: Deployed with enhanced debug logging
**Live**: https://irozq8.vercel.app
