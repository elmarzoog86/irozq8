# 📱 Step-by-Step: Update Twitch App Settings

## The Problem
Your Twitch app is configured for port 3000, but your server runs on port 3001.

## The Fix (5 minutes)

### Step 1: Go to Twitch Developer Console
```
https://dev.twitch.tv/console/apps
```

### Step 2: Find Your App
- Look for app named something like "irozq8" or "جوله"
- Click on it

### Step 3: Click Settings
- In the app details, find the **Settings** tab or button
- Click it

### Step 4: Find OAuth Redirect URIs
- You should see a section called "OAuth Redirect URIs"
- There's likely one entry there with port 3000

### Step 5: Update the URI
**Current (Wrong)**:
```
http://localhost:3000/api/twitch/callback
```

**New (Correct)**:
```
http://localhost:3001/api/twitch/callback
```

- Delete the old one (usually there's an X button)
- Add the new one
- Or just change the 3000 to 3001

### Step 6: Save/Update
- Click "Update" or "Save" button
- Wait for confirmation

### Step 7: Done! ✅
Your Twitch app is now configured for port 3001.

---

## Troubleshooting

### Can't Find Settings?
- Make sure you're at https://dev.twitch.tv/console/apps (not the creator dashboard)
- Click the specific app, not just hovering

### Multiple Apps Listed?
- Look for the one you created for this project
- Check your notes to see which client ID matches

### Not Sure Which App?
- Compare the **Client ID** in the app settings with:
  - Your `.env.local` file
  - Should see: `NEXT_PUBLIC_TWITCH_CLIENT_ID=sle6i9b97snxye1cvcng3fkny86yjd`

---

## What's Happening Behind the Scenes

1. You click "تسجيل الدخول عبر Twitch"
2. App sends you to Twitch with:
   - Client ID
   - Redirect URI
   - Requested permissions
3. Twitch checks: "Is this redirect URI registered for this app?"
4. If **YES** ✅: User logs in
5. If **NO** ❌: Twitch shows "redirect_mismatch" error

**Our fix**: Make sure the redirect URI in step 2 matches what Twitch expects.

---

## Key Points

- ✅ Server port: 3001
- ✅ .env.local: Already updated to 3001
- ⚠️ Twitch app: **You need to update this to 3001**
- The three must match perfectly!

---

## After You Update

1. Close Twitch and go back to: http://localhost:3001
2. Try logging in again
3. Should work now! ✅

If it still doesn't work:
- Double-check the port in Twitch settings is 3001 (not 3000)
- Make sure you clicked "Update" or "Save"
- Clear browser cache and try again

---

**Let me know once you update the Twitch app and we can test the full flow!**
