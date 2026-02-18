# 🔍 Step-by-Step Chat Integration Test

## Goal
Identify exactly where chat integration breaks and get it working.

## Prerequisites
- Server running on port 3001
- Browser with DevTools (F12)
- Twitch channel access
- Ready to test

---

## Test Phase 1: OAuth & Session (5 minutes)

### Step 1.1: Login
1. Go to `http://localhost:3001`
2. Click blue **"تسجيل الدخول عبر Twitch"** button
3. Complete Twitch OAuth login
4. ✅ **EXPECTED**: Redirected to home with URL like:
   ```
   http://localhost:3001/?session=ABCDEF1234567890
   ```
5. ✅ You should see: **"مرحبا يا [YOUR_NAME]"** in top-right

**Troubleshooting Step 1:**
- ❌ Getting login error? Check browser console for red ❌
- ❌ No session in URL? OAuth callback may have failed
- ❌ Session disappears on refresh? Session storage issue

### Step 1.2: Verify Session Exists
1. Copy the session ID from URL (the part after `?session=`)
2. Open new tab
3. Go to: `http://localhost:3001/api/debug/chat-status?session=YOUR_SESSION_ID`
   - Replace `YOUR_SESSION_ID` with the session you copied

**Expected response:**
```json
{
  "status": "ok",
  "message": "Session is valid and chat should work",
  "sessionId": "ABCDEF1234567890",
  "sessionExists": true,
  "sessionData": {
    "channel": "your_channel_name",
    "userName": "Your Display Name",
    "userId": "123456789",
    "hasAccessToken": true
  }
}
```

**If you see error instead:**
- ❌ Session not stored properly
- ❌ Something wrong with OAuth callback

---

## Test Phase 2: Navigate to Game (3 minutes)

### Step 2.1: Go Back to Game
1. Go back to home page
2. Scroll down to **"جولة الأسئلة"** (Questions Game)
3. Click it
4. ✅ **EXPECTED**: URL should be:
   ```
   http://localhost:3001/games?id=questions&session=ABCDEF1234567890
   ```

**If session is missing from URL:**
- ❌ Home page not passing session to games page
- Go to `src/app/page.tsx` and check navigation code

### Step 2.2: Check Console Before Starting Game
1. Open DevTools: Press `F12`
2. Click **Console** tab
3. Clear any old logs: `Ctrl+L`
4. Look at the console - should be mostly empty

---

## Test Phase 3: Chat Initialization (2 minutes)

### Step 3.1: Start the Game
1. Click **"ابدأ اللعبة"** (Start Game) button
2. Immediately look at browser console
3. **WATCH FOR LOGS** - You should see logs appearing:
   ```
   🎣 useTwitchChat hook called - enabled: true, sessionId: present, ...
   ```

### Step 3.2: Monitor Console Sequence
After clicking start, watch console for this sequence:

```
1️⃣  🎣 useTwitchChat hook called - enabled: true, sessionId: present, hasInitialized: false, isConnecting: false
2️⃣  🔌 Starting Twitch chat initialization for session: ABCDEF1234567890
3️⃣  📡 Fetching chat token from /api/twitch/chat-token?action=connect&session=ABCDEF1234567890
4️⃣  📥 Chat token response status: 200
5️⃣  📦 Chat token response data: { success: true, channel: '...', hasAccessToken: true, userName: '...' }
6️⃣  ✅ Got chat token successfully
7️⃣  🚀 Calling twitchChatConnector.connect()
8️⃣  🚀 Starting Twitch chat connection for channel: your_channel
9️⃣  👤 Bot username: Your Display Name
🔟  🔑 Access token: present
1️⃣1️⃣  📌 Registered 1 message callbacks
1️⃣2️⃣  📌 Registered 1 answer callbacks
1️⃣3️⃣  ✅ TMI.js loaded successfully from CDN
1️⃣4️⃣  ✅ Logged on to Twitch chat
1️⃣5️⃣  ✅ Successfully connected to Twitch chat: your_channel
1️⃣6️⃣  🎯 Ready to receive messages from: #your_channel
```

**Check these key logs:**
- ✅ See step 5-6? → Token fetched successfully
- ✅ See step 11-12? → Callbacks registered (should be 1 each)
- ✅ See step 13? → tmi.js loaded
- ✅ See step 16? → Connected and ready

**If something is missing:**
- Copy the exact logs you see
- Note what's missing or what shows ❌ error
- This will tell us where it breaks

---

## Test Phase 4: Send Chat Message (1 minute)

### Step 4.1: Send Test Answer
1. Go to your Twitch channel chat
2. Type: `أ` (Arabic letter Alif - option A)
3. Press Enter to send

### Step 4.2: Watch Console for Message Reception
Immediately look at console for:
```
📨 Message received - Username: [YOUR_USERNAME], Self: false, Message: "أ"
  ✓ Processing message from viewer: [YOUR_USERNAME] -> "أ"
  → Calling message callback for: [YOUR_USERNAME]
📍 Processing game answer from [YOUR_USERNAME]: "أ" (playerIndex: 0)
  → Calling answer callback with: [YOUR_USERNAME], أ
```

**What each means:**
- 📨 = tmi.js received the message ✅
- ✓ = Message was processed ✅
- → Calling answer callback = Callback function invoked ✅

**If you see these logs:**
- ✅ Chat is receiving messages
- ✅ Processing is working
- Problem is likely in the display component
- Go to Test Phase 5

**If you DON'T see these logs:**
- ❌ tmi.js not receiving messages
- Possible causes:
  - tmi.js didn't load (check step 13 in Phase 3)
  - Channel name wrong
  - Connected to wrong channel
  - Anonymous connection not working

---

## Test Phase 5: Check Game Display (2 minutes)

### Step 5.1: Look at Game Screen
After sending chat message in Phase 4, check:
1. Does your username appear on the left side?
2. Does your answer appear next to your name?
3. Does a score increment?

**Expected display:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Your Username
  أ ⏳
  Score: 10
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If answer appears:**
- ✅ EVERYTHING IS WORKING! 🎉
- Chat integration is complete
- Test a few more messages to confirm

**If answer does NOT appear:**
- ❌ Component didn't display the answer
- Go to Troubleshooting section below

---

## Troubleshooting Flowchart

```
START
  |
  v
Does console show 📨 message received?
  |
  +-- NO --> Go to "Fix: Message Not Received"
  |
  +-- YES --> Does console show "→ Calling answer callback"?
     |
     +-- NO --> Go to "Fix: Callback Not Invoked"
     |
     +-- YES --> Does answer appear on game screen?
        |
        +-- NO --> Go to "Fix: Display Issue"
        |
        +-- YES --> ✅ WORKING! Test with more messages
```

---

## Fix 1: Message Not Received

**Symptoms:**
- 📨 message received log NOT appearing
- tmi.js connected (🎯 Ready to receive messages appeared)
- Chat message sent but nothing happens

**Debug Steps:**

1. **Check tmi.js Event Listeners**
   - In console, type:
   ```javascript
   window.tmi
   ```
   - If undefined → tmi.js didn't load
   - If you see object → tmi.js loaded

2. **Check Anonymous Connection**
   - Message not received in anonymous mode might mean:
   - Channel name might be wrong
   - Twitch may have restrictions
   - Connection may have dropped

3. **Check Channel Name**
   - Look at console for:
   ```
   🚀 Starting Twitch chat connection for channel: [CHANNEL_NAME]
   ```
   - Is this your actual Twitch channel username?
   - Should be lowercase
   - Should not have `#` symbol

4. **Try Different Message Format**
   - Try: `1` (number)
   - Try: `a` (letter)
   - Try: `first_option_text` (exact text)

**If still not working:**
- Check `/api/twitch/chat-token` response
- Verify session data is correct
- Restart dev server

---

## Fix 2: Callback Not Invoked

**Symptoms:**
- 📨 message received appears in console ✅
- ✓ Processing message appears in console ✅
- BUT "→ Calling answer callback" does NOT appear
- Answer doesn't display

**Debug Steps:**

1. **Check Callback Registration**
   - Look for in console:
   ```
   📌 Registered 1 answer callbacks
   ```
   - Should be `1` (one callback)
   - If `0`: callback not being passed from games page

2. **Check Games Page Passing Callback**
   - File: `src/app/games/page.tsx` lines 28-35
   - Look for:
   ```typescript
   useTwitchChat({
     sessionId: sessionId || '',
     enabled: gameStarted && gameId === 'questions',
     onAnswer: (playerIndex, username, answer) => {
       if (questionsGameRef.current) {
         questionsGameRef.current.handleChatAnswer(playerIndex, username, answer);
       }
     },
   });
   ```
   - Verify this code is present

3. **Check Games Page is Running Questions Game**
   - Verify `gameId === 'questions'` is true
   - In console type:
   ```javascript
   // Check URL params
   new URL(window.location).searchParams.get('id')
   ```
   - Should return `"questions"`

**If still 0 callbacks:**
- Something wrong with prop passing
- Check if hook is being called at all
- Verify `enabled: true` condition is met

---

## Fix 3: Display Issue

**Symptoms:**
- Message received ✅
- Callback invoked ✅
- But answer NOT appearing on screen

**Debug Steps:**

1. **Check Questions Game Component**
   - Component should display received answers
   - Check browser inspector (F12 → Elements)
   - Look for chat message container
   - Should have your username and answer

2. **Check Ref Connection**
   - Games page creates ref: `questionsGameRef`
   - Component should be: `<QuestionsGame ref={questionsGameRef} ... />`
   - Verify this is present in `src/app/games/page.tsx`

3. **Check handleChatAnswer Method**
   - File: `src/components/QuestionsGame.tsx`
   - Look for method implementation
   - Should process answer and add to display

**If ref looks wrong:**
- Verify component has: `forwardRef(function QuestionsGame(...)`
- Verify `useImperativeHandle` exports `handleChatAnswer`

---

## Quick Copy-Paste Commands

### For Console Debugging

**Check if tmi.js loaded:**
```javascript
console.log(window.tmi ? '✅ tmi.js loaded' : '❌ tmi.js NOT loaded')
```

**Check current URL params:**
```javascript
const params = new URL(window.location).searchParams;
console.log('gameId:', params.get('id'), 'sessionId:', params.get('session'));
```

**Check session storage (if using localStorage):**
```javascript
console.log('Session from storage:', localStorage.getItem('session_id'))
```

---

## Next Steps

After running these tests, reply with:

1. ✅ or ❌ for each test phase
2. What console logs you see (paste the first 5-10)
3. What's missing or shows errors
4. Whether answers appear on screen

This will let me identify exactly what needs fixing!

---

## Server Info
- **URL**: http://localhost:3001
- **API Debug**: http://localhost:3001/api/debug/chat-status?session=YOUR_SESSION_ID
- **Status**: Running ✅
