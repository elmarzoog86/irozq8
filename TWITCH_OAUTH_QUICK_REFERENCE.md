# 🎯 Twitch OAuth - Quick Reference Card

**Print this out or keep it open while configuring!**

---

## 🔗 Key URLs

```
Twitch Console:
https://dev.twitch.tv/console/apps

Redirect URL (must match exactly):
http://localhost:3000/api/twitch/callback

Local Dev Server:
http://localhost:3000

Test Login Page:
http://localhost:3000
```

---

## 📋 .env.local Template

Copy your credentials into these lines:

```
TWITCH_CLIENT_ID=YOUR_CLIENT_ID_HERE
TWITCH_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NEXT_PUBLIC_TWITCH_CLIENT_ID=YOUR_CLIENT_ID_HERE
TWITCH_REDIRECT_URI=http://localhost:3000/api/twitch/callback
```

---

## ⚡ Quick Steps

1. Go to https://dev.twitch.tv/console/apps
2. Click "+ Create Application"
3. Name: جوله | Category: Streaming Tools
4. Click "Manage"
5. Copy Client ID
6. Copy Client Secret
7. Add Redirect URL: http://localhost:3000/api/twitch/callback
8. Click "Save"
9. Edit .env.local with your credentials
10. Save file
11. Terminal: Ctrl+C to stop server
12. Terminal: npm run dev
13. Browser: http://localhost:3000
14. Click login button
15. Authorize on Twitch
16. ✅ Dashboard should load!

---

## 🔐 Where to Find Your Credentials

**In Twitch Console:**
```
Application Name: جوله
         ↓
    Click "Manage"
         ↓
  You'll see:
  Client ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚨 Critical Requirements

| Item | Must Be | Cannot Be |
|------|---------|-----------|
| Redirect URL Format | Exact match | Different from Twitch |
| Client Secret | Private | Shared anywhere |
| .env.local | Saved after edit | Forgotten |
| Server | Restarted | Running with old config |
| Port | 3000 | Wrong port |

---

## ✅ Testing the OAuth

```
Step 1: Is server running?
  npm run dev
  Wait for: ✓ Ready in XXXms

Step 2: Open browser
  http://localhost:3000

Step 3: Click login button
  Should redirect to Twitch

Step 4: Authorize
  Should return to your site

Step 5: Dashboard loads?
  ✅ OAuth works!
  ❌ Check console for errors (F12)
```

---

## 🎯 What Each Variable Does

```
TWITCH_CLIENT_ID
  • What: Your app's public ID on Twitch
  • Where: Used in backend
  • Length: ~30 characters
  • Security: Safe (but keep private anyway)

TWITCH_CLIENT_SECRET  
  • What: Your app's private password
  • Where: Used in backend for token exchange
  • Length: 30+ characters
  • Security: ⚠️ KEEP VERY PRIVATE

NEXT_PUBLIC_TWITCH_CLIENT_ID
  • What: Same as TWITCH_CLIENT_ID (for frontend)
  • Where: Next.js uses this prefix for public vars
  • Security: Safe to expose (Client ID is public)

TWITCH_REDIRECT_URI
  • What: Where Twitch sends users after authorization
  • Must: Match exactly between .env.local and Twitch
  • Value: http://localhost:3000/api/twitch/callback
```

---

## 📞 Command Reference

```bash
# Start dev server
npm run dev

# Stop dev server
Ctrl+C

# Check if port 3000 is in use
netstat -ano | findstr :3000

# View .env.local (don't share output!)
type .env.local

# Clear Next.js cache
rm -r .next

# Full rebuild
npm install
npm run dev
```

---

## 🐛 Quick Fixes

| Error | Fix |
|-------|-----|
| "Cannot find module .env.local" | File exists, server needs restart |
| "Invalid Client ID" | Check for extra spaces or typos |
| "Redirect URI mismatch" | URL must be exactly the same everywhere |
| "Cannot read property 'access_token'" | Client Secret is wrong |
| Page won't load after auth | Hard refresh browser (Ctrl+Shift+R) |
| Server won't start | Kill process on port 3000, try again |

---

## 🎬 OAuth Flow (Simple Version)

```
1. User clicks login
   ↓
2. Browser goes to Twitch
   ↓
3. User logs in to Twitch
   ↓
4. User clicks "Authorize"
   ↓
5. Twitch sends code back to your server
   ↓
6. Your server uses code to get access token
   ↓
7. Your server stores token in secure cookie
   ↓
8. User is logged in! 🎉
```

---

## 📝 Quick Checklist

- [ ] Created app in Twitch console
- [ ] Copied Client ID
- [ ] Copied Client Secret
- [ ] Added redirect URL
- [ ] Updated .env.local
- [ ] Saved .env.local
- [ ] Restarted server (npm run dev)
- [ ] Tested login at http://localhost:3000
- [ ] Dashboard loads after auth
- [ ] No errors in console (F12)

---

## 🆘 If Something Goes Wrong

**Check in this order:**

1. **Browser Console** (F12):
   - Open Console tab
   - Look for red errors
   - Search for "TWITCH" or "undefined"

2. **Terminal/Server Logs**:
   - Check for error messages when starting
   - Check for error messages when logging in

3. **File Verification**:
   - Is .env.local saved?
   - Are values exactly correct?
   - Are there extra spaces?

4. **Twitch Console Verification**:
   - Is redirect URL exactly: `http://localhost:3000/api/twitch/callback`?
   - Are Client ID and Secret visible?
   - Are they copied correctly?

5. **Try Fresh Start**:
   - Save .env.local
   - Ctrl+C to stop server
   - npm run dev
   - Hard refresh browser (Ctrl+Shift+R)
   - Try login again

---

## 🎯 Success Indicators

✅ **OAuth is working when you see:**

1. Login button on home page
2. Can click it without errors
3. Twitch page appears
4. Can authorize successfully
5. Return to your site after auth
6. Dashboard loads with your username
7. Game selection boxes visible
8. No red error messages anywhere

---

## 📚 More Help

- Full setup guide: `TWITCH_OAUTH_SETUP.md`
- Visual guide: `TWITCH_OAUTH_VISUAL_GUIDE.md`
- Detailed checklist: `TWITCH_OAUTH_CHECKLIST.md`
- Implementation docs: `IMPLEMENTATION_COMPLETE.md`

---

**Questions?** Check the guides listed above or look at your browser console error message!

**Ready to configure OAuth?** Start with the TWITCH_OAUTH_CHECKLIST.md file - it walks you through every step! 🚀
