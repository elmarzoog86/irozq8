# iRozQ8 - Deployment & Twitch Integration Guide

## 🚀 Part 1: Deploy to Vercel (Live Website)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" 
3. Choose "Continue with GitHub" or your preferred method
4. Authorize Vercel to access your repositories

### Step 2: Deploy Your Project
1. In Vercel dashboard, click "Add New..." → "Project"
2. Select your GitHub repository (or import this project)
3. Vercel will auto-detect Next.js settings
4. Click "Deploy"
5. Wait for deployment to complete (~2-5 minutes)

**Your live URL will look like:** `https://your-project-name.vercel.app`

### Step 3: Add Environment Variables to Vercel
1. In Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables:
   - `TWITCH_CLIENT_ID` - Your Twitch Client ID
   - `TWITCH_CLIENT_SECRET` - Your Twitch Client Secret
   - `TWITCH_REDIRECT_URI` - `https://your-project-name.vercel.app/api/twitch/callback`

3. Click "Save"
4. **Redeploy:** Go to "Deployments" and click "..." on latest deployment → "Redeploy"

---

## 🎮 Part 2: Twitch OAuth Setup

### Step 1: Register Application on Twitch
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Log in with your Twitch account
3. Click "Create Application"
4. Fill in:
   - **Name:** iRozQ8 Games (or your project name)
   - **OAuth Redirect URLs:** 
     ```
     http://localhost:3000/api/twitch/callback
     https://your-vercel-domain.vercel.app/api/twitch/callback
     ```
   - **Category:** Application Integration
5. Accept terms and create

### Step 2: Get Your Credentials
1. In your application page, click "Manage"
2. You'll see:
   - **Client ID** - Copy this
   - **Client Secret** - Click "New Secret" and copy it
3. Save these values in your `.env.local` file (locally) and Vercel (production)

### Step 3: Generate OAuth Token for Chat
1. Go to [this page](https://twitchtokengenerator.com/) or use Twitch's official tool
2. Log in with your Twitch account
3. Select scopes: `chat:read`, `chat:edit`, `channel:moderate`
4. Click "Generate Token"
5. Copy the OAuth token (starts with `oauth:`)
6. Add to `.env.local` as `TWITCH_OAUTH_TOKEN`

---

## 💬 Part 3: Twitch Chat Integration

The project now includes:

### Features Available:
- ✅ OAuth login with Twitch
- ✅ Twitch chat connection (read-only)
- ✅ Display chat messages in game lobby
- ✅ Streamer dashboard
- ✅ Game management panel

### Current Chat Features:
1. **View live Twitch chat** in the game lobby
2. **Chat commands** support (expandable):
   - `!join` - Player joins the game
   - `!answer [text]` - Submit answer
   - `!help` - Show available commands

### To Enable Chat in Games:
The chat system is already integrated in:
- `/src/components/QuestionsLobby.tsx` - Shows system messages
- `/src/app/games/page.tsx` - Main game page
- `/src/app/twitch/dashboard/page.tsx` - Streamer dashboard

---

## 📱 Part 4: Sharing Your Website

### With Friends (Testing):
1. **Share the Vercel URL:** `https://your-project-name.vercel.app`
2. Friends can:
   - View all games
   - Play games locally
   - Join via Twitch login

### For Streaming:
1. **Log in with Twitch** on the platform
2. Go to **Streamer Dashboard** (`/twitch/dashboard`)
3. Start a game and your chat will appear
4. You can manage players and settings from there

---

## 🔧 Environment Variables Checklist

### Local Development (`.env.local`):
```
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
TWITCH_REDIRECT_URI=http://localhost:3000/api/twitch/callback
TWITCH_BOT_USERNAME=your_username
TWITCH_OAUTH_TOKEN=oauth:your_token
TWITCH_CHANNEL_NAME=your_channel
```

### Vercel (Settings → Environment Variables):
```
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
TWITCH_REDIRECT_URI=https://your-vercel-domain.vercel.app/api/twitch/callback
```

---

## 🎯 Quick Start URLs

Once deployed:

| Page | URL |
|------|-----|
| Home | `https://your-domain.vercel.app` |
| Games | `https://your-domain.vercel.app/games` |
| Twitch Login | `https://your-domain.vercel.app/twitch/login` |
| Streamer Dashboard | `https://your-domain.vercel.app/twitch/dashboard` |

---

## 🆘 Troubleshooting

### "Invalid redirect URI" error:
- Make sure your redirect URI in Twitch console matches your Vercel domain exactly
- Format: `https://domain/api/twitch/callback` (no trailing slash)

### Chat not showing:
- Check that `TWITCH_OAUTH_TOKEN` is set correctly
- Token must include `oauth:` prefix
- Token needs `chat:read` scope

### Environment variables not working on Vercel:
- Go to Vercel dashboard → Settings → Environment Variables
- Make sure all 3 variables are set
- Redeploy the project after adding variables
- It may take 5 minutes for changes to propagate

---

## 📚 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure Twitch OAuth
3. ✅ Set up environment variables
4. ✅ Test login with Twitch
5. ✅ Test chat integration
6. ✅ Share URL with friends
7. ✅ Stream on Twitch with dashboard

Happy gaming! 🎮
