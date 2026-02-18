# 🎬 Twitch OAuth Setup - Visual Guide

## Quick Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  TWITCH OAUTH SETUP                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Go to Twitch Developer Console                    │
│          https://dev.twitch.tv/console/apps                │
│          ↓                                                   │
│  Step 2: Create an Application                             │
│          Name: جوله (Jawlah)                               │
│          ↓                                                   │
│  Step 3: Copy Client ID & Client Secret                    │
│          ↓                                                   │
│  Step 4: Add OAuth Redirect URL                            │
│          http://localhost:3000/api/twitch/callback         │
│          ↓                                                   │
│  Step 5: Update .env.local with your credentials           │
│          TWITCH_CLIENT_ID=xxx                              │
│          TWITCH_CLIENT_SECRET=xxx                          │
│          ↓                                                   │
│  Step 6: Restart dev server (npm run dev)                  │
│          ↓                                                   │                                                
│  Step 7: Test at http://localhost:3000                     │
│          ✅ OAuth is working!                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📺 Screenshot Guide

### Screenshot 1: Twitch Console Home
```
Step: Go to https://dev.twitch.tv/console/apps
Expected to see: List of your applications

[Dashboard] [Develop] [Settings]
                        ↓
              [Applications]
                     ↓
              + Create Application
```

### Screenshot 2: Create Application Form
```
Fill in these fields:

Application Name: جوله (Jawlah)
                  ▼
Application Category: [Streaming Tools ▼]

☑ I agree to Twitch Developer Agreement

[Create] button
```

### Screenshot 3: Application Details Page
```
After clicking "Manage" on your app:

Application Name: جوله (Jawlah)
Status: Created

┌──────────────────────────────────────┐
│ Client ID:                           │
│ xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ◄─── COPY THIS │
│ [Copy]                               │
├──────────────────────────────────────┤
│ Client Secret:                       │
│ xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ◄─── COPY THIS │
│ [Copy]                               │
└──────────────────────────────────────┘

Scroll down ↓

┌──────────────────────────────────────┐
│ OAuth Redirect URLs:                 │
│ [Add URL]                            │
│                                      │
│ http://localhost:3000/api/twitch/c...│ ◄─ PASTE HERE
│ [Save]                               │
└──────────────────────────────────────┘
```

### Screenshot 4: Update .env.local
```
File: .env.local

TWITCH_CLIENT_ID=abcd1234efgh5678ijkl9012 ◄─ Paste Client ID
                                    
TWITCH_CLIENT_SECRET=secret_xyz123abc456def ◄─ Paste Client Secret

NEXT_PUBLIC_TWITCH_CLIENT_ID=abcd1234efgh5678ijkl9012 ◄─ Same as CLIENT_ID

Save the file (Ctrl+S)
```

### Screenshot 5: Restart Server
```
VS Code Terminal:

C:\Users\elmar\OneDrive\Desktop\Roz> npm run dev

> next dev

  ▲ Next.js 14.0.0

  ◇ Local:        http://localhost:3000
  ◇ Listening to: 0.0.0.0
  ◇ Ready in 1.8s

Open: http://localhost:3000
```

### Screenshot 6: Login Page
```
Browser: http://localhost:3000

┌─────────────────────────────────────┐
│        🎮 جوله - Jawlah             │
│   منصة الألعاب التفاعلية            │
├─────────────────────────────────────┤
│                                     │
│  [تسجيل الدخول عبر تويتش] ◄─ Click │
│         (Login with Twitch)         │
│                                     │
│  أو                                 │
│  [تسجيل دخول كضيف] ◄─ Guest Login │
│                                     │
└─────────────────────────────────────┘
```

### Screenshot 7: Twitch Authorization
```
Browser redirects to: https://id.twitch.tv/oauth2/authorize?...

┌─────────────────────────────────────┐
│    Authorize جوله (Jawlah)?         │
├─────────────────────────────────────┤
│                                     │
│ جوله requests access to:           │
│                                     │
│ • Read your user information        │
│ • Read your channel information     │
│ • Manage your chat                  │
│                                     │
│  [Authorize] [Cancel]               │
│                                     │
└─────────────────────────────────────┘
```

### Screenshot 8: Dashboard (Success!)
```
After clicking Authorize:

┌──────────────────────────────────────┐
│        🎮 لوحة التحكم                │
│      (Streamer Dashboard)             │
├──────────────────────────────────────┤
│                                      │
│ مرحبا, [Your Name]! 👋               │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 📝 أسئلة (Questions)             │ │
│ │ [🔴 إنشاء اللعبة] ◄─ Click      │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 🎡 الروليت (Roulette)            │ │
│ │ [🔴 إنشاء اللعبة]                 │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ... more games                       │
│                                      │
└──────────────────────────────────────┘
```

---

## 🎯 What Each Credential Does

### TWITCH_CLIENT_ID
```
What it is: Your app's public identifier on Twitch
Where it's used: 
  - Backend OAuth flow
  - Getting Twitch user info
  - Chat integration

Example: abc123def456ghi789jkl012mno345
Length: 30 characters
Keep it: Somewhat private (used in backend only)
```

### TWITCH_CLIENT_SECRET
```
What it is: Your app's private password
Where it's used: 
  - Backend OAuth token exchange
  - Authenticating requests to Twitch API

Example: secret_abc123def456ghi789jkl012mn
Length: 30+ characters
Keep it: ⚠️ VERY PRIVATE - Never share or commit to GitHub!
```

### NEXT_PUBLIC_TWITCH_CLIENT_ID
```
What it is: Same as TWITCH_CLIENT_ID (duplicated)
Where it's used: 
  - Frontend can access this value
  - It's safe because Client ID is public anyway

Security: Safe to expose (it's public)
Rule: Always use NEXT_PUBLIC_ prefix for public vars
```

### TWITCH_REDIRECT_URI
```
What it is: Where Twitch sends users after they authorize
Value: http://localhost:3000/api/twitch/callback
Must: Match exactly in both .env.local AND Twitch settings

For production: https://yourdomain.com/api/twitch/callback
```

---

## 🔄 How OAuth Works (Behind the Scenes)

```
1. User clicks "Login with Twitch"
         ↓
2. Browser redirects to Twitch authorization page
         ↓
3. User logs in to Twitch (if not already logged in)
         ↓
4. Twitch shows "authorize this app?" dialog
         ↓
5. User clicks "Authorize"
         ↓
6. Twitch redirects to: http://localhost:3000/api/twitch/callback
   with code: ?code=abc123def456ghi789
         ↓
7. Backend receives code at /api/twitch/callback
         ↓
8. Backend exchanges code for access token using:
   - Client ID
   - Client Secret
   - Redirect URI (to verify it matches)
         ↓
9. Backend stores access token in httpOnly cookie
         ↓
10. User is logged in! 🎉
```

---

## ✅ Validation Checklist

Before you start, make sure you have:

- [ ] Twitch account (free)
- [ ] VS Code or text editor open
- [ ] File `.env.local` ready to edit
- [ ] 5-10 minutes of time
- [ ] Browser open to https://dev.twitch.tv/console/apps

---

## 🚨 Critical Points

1. **EXACT REDIRECT URL MATCH**
   ```
   Twitch Console setting:
   http://localhost:3000/api/twitch/callback
   
   .env.local:
   TWITCH_REDIRECT_URI=http://localhost:3000/api/twitch/callback
   
   ⚠️ Must be identical (no extra spaces, exact case)
   ```

2. **RESTART AFTER .env.local CHANGES**
   ```
   Edit .env.local → Save → Stop server (Ctrl+C) → npm run dev
   ```

3. **CLIENT SECRET IS PRIVATE**
   ```
   ❌ Never commit to GitHub
   ❌ Never share online
   ❌ Never show in screenshots
   ✅ Only in .env.local (which is in .gitignore)
   ```

4. **TEST IMMEDIATELY**
   ```
   After restarting server:
   1. Open http://localhost:3000
   2. Click login
   3. Authorize on Twitch
   4. Check if dashboard loads
   5. If yes → OAuth works! ✅
   6. If no → Check console for errors
   ```

---

## 🆘 Troubleshooting Flowchart

```
Does OAuth work?
├─ YES → ✅ Great! Skip to testing games
└─ NO → Check these:
    ├─ Is server running?
    │  ├─ NO → npm run dev
    │  └─ YES → Continue
    ├─ Is .env.local saved?
    │  ├─ NO → Save it (Ctrl+S)
    │  └─ YES → Continue
    ├─ Is redirect URL exactly correct?
    │  ├─ NO → Fix it in .env.local and Twitch
    │  └─ YES → Continue
    ├─ Is Client Secret correct?
    │  ├─ NO → Copy it again from Twitch
    │  └─ YES → Continue
    └─ Check browser console (F12) for errors
       └─ Look for "TWITCH", "redirect", "undefined"
```

---

## 📚 Related Files

These files are used during OAuth:

1. **`src/app/api/twitch/callback/route.ts`**
   - Receives the authorization code from Twitch
   - Exchanges it for access token
   - Stores token in cookie

2. **`src/app/twitch/login/page.tsx`**
   - Shows the login button
   - Redirects to Twitch

3. **`.env.local`**
   - Stores your credentials
   - Keep safe and never commit

---

## ✨ Quick Commands Reference

```bash
# Start development server
npm run dev

# Stop server
Ctrl+C

# Edit .env.local
code .env.local

# Check Node version
node --version

# Check npm packages
npm list
```

---

**Ready to start? Follow the steps in TWITCH_OAUTH_SETUP.md above! 🚀**
