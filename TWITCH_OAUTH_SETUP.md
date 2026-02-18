# 🔐 Twitch OAuth Setup - Step by Step

**Status**: Ready to configure  
**Time Required**: 5-10 minutes  
**Difficulty**: Easy  

---

## ✅ Step 1: Go to Twitch Developer Console

1. Open this link in your browser:
   ```
   https://dev.twitch.tv/console/apps
   ```

2. **If not logged in**: Click "Log In with Twitch" and use your Twitch account
3. **If you don't have a Twitch account**: Create one at https://www.twitch.tv/signup

---

## ✅ Step 2: Create an Application

1. Click the blue **"Create Application"** button
2. Fill in the form:
   ```
   Application Name: جوله (Jawlah)
   Application Category: Streaming Tools
   ```
3. Check the box: **"I agree to Twitch Developer Agreement"**
4. Click **"Create"**

---

## ✅ Step 3: Get Your Credentials

1. After creating, you'll see your app in the list
2. Click **"Manage"** next to your app
3. You'll see two important values:

   **COPY THESE TWO VALUES:**
   ```
   Client ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   ⚠️ **IMPORTANT**: Keep Client Secret private! Never share it.

---

## ✅ Step 4: Set OAuth Redirect URL

1. Scroll down on the same page to find **"OAuth Redirect URLs"**
2. Click **"Add URL"**
3. Paste this exact URL:
   ```
   http://localhost:3000/api/twitch/callback
   ```
4. Click **"Add"**
5. Click **"Save"** at the bottom

---

## ✅ Step 5: Update Your .env.local File

1. Open this file in VS Code:
   ```
   .env.local
   ```

2. Find these lines and update them with YOUR credentials:
   ```
   TWITCH_CLIENT_ID=your_client_id_here
   TWITCH_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_TWITCH_CLIENT_ID=your_client_id_here
   ```

3. Replace `your_client_id_here` with the **Client ID** you copied
4. Replace `your_client_secret_here` with the **Client Secret** you copied

5. **Example** (YOUR VALUES WILL BE DIFFERENT):
   ```
   TWITCH_CLIENT_ID=abcd1234efgh5678ijkl9012
   TWITCH_CLIENT_SECRET=secret_xyz123abc456def789ghi012
   NEXT_PUBLIC_TWITCH_CLIENT_ID=abcd1234efgh5678ijkl9012
   ```

---

## ✅ Step 6: Restart Development Server

1. In VS Code terminal, press **Ctrl+C** to stop the current server
2. Run this command:
   ```bash
   npm run dev
   ```
3. Wait for: `✓ Ready in XXXms`

---

## ✅ Step 7: Test the OAuth Flow

### Test Streamer Login:

1. Open your browser: `http://localhost:3000`
2. Click **"تسجيل الدخول عبر تويتش"** (Login with Twitch)
3. You'll be redirected to Twitch to authorize
4. After authorizing, you'll see the **Dashboard**
5. ✅ If you see the dashboard = OAuth is working!

### Test Game Creation:

1. On the dashboard, you should see game options
2. Select a game (e.g., "أسئلة" - Questions)
3. Click to create a game
4. You should see game controls appear
5. ✅ If controls appear = System is working!

---

## ⚠️ Common Issues & Fixes

### ❌ "Invalid Client ID"
**Problem**: Client ID is wrong or formatted incorrectly  
**Fix**: Copy the Client ID again from Twitch console, make sure there are no extra spaces

### ❌ "Redirect URI mismatch"
**Problem**: Redirect URL in `.env.local` doesn't match Twitch settings  
**Fix**: Make sure both are exactly:
```
http://localhost:3000/api/twitch/callback
```
No trailing slashes, exact case match.

### ❌ Server won't start after editing .env.local
**Problem**: Environment variables not reloaded  
**Fix**: 
1. Stop the server (Ctrl+C)
2. Run: `npm run dev`

### ❌ "Cannot read property 'access_token' of undefined"
**Problem**: OAuth callback failed to process  
**Fix**:
1. Check Client Secret is correct
2. Check Redirect URI matches exactly
3. Try logging in again

### ❌ Server returns "TypeError: fetch is not defined"
**Problem**: Node.js version too old or fetch not available  
**Fix**: Update Node.js to version 18+

---

## 🔍 Verify Your Setup

After restarting the server, check:

1. **Open browser console** (F12):
   - No errors about "TWITCH_CLIENT_ID"
   - No errors about "undefined"

2. **Try the login flow**:
   - Click login button
   - Get redirected to Twitch
   - Authorize the app
   - Come back to dashboard

3. **Check the API**:
   - Open DevTools Network tab
   - Click login
   - Look for request to `/api/twitch/callback`
   - Should have status 200 or 302 (redirect)

---

## 📋 Checklist

Before moving to next step, verify:

- [ ] Twitch Developer Account created
- [ ] Application created in Twitch Console
- [ ] Client ID copied
- [ ] Client Secret copied  
- [ ] OAuth Redirect URL added (http://localhost:3000/api/twitch/callback)
- [ ] .env.local updated with credentials
- [ ] Development server restarted
- [ ] Streamer login flow tested
- [ ] Dashboard loads successfully
- [ ] Game can be created
- [ ] No errors in browser console

---

## 🎯 What's Next?

Once OAuth is working:

1. **Test the full game flow**:
   - Create a game as streamer
   - Visit `/play?gameId=questions&channel=YourChannelName`
   - Join as a viewer
   - Send chat commands

2. **Test all 4 games**:
   - Questions
   - Roulette
   - Fruits War
   - Chairs

3. **Deploy to production** (optional):
   - Push to GitHub
   - Vercel auto-deploys
   - Update Twitch OAuth URLs

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| Twitch Console | https://dev.twitch.tv/console/apps |
| Local Redirect URI | http://localhost:3000/api/twitch/callback |
| Env File | .env.local |
| Server Command | npm run dev |
| Test URL | http://localhost:3000 |

---

**Questions?** Check the error message, look for it in this guide, or check browser console.

**Ready?** Follow the steps above and come back when OAuth is configured! 🚀
