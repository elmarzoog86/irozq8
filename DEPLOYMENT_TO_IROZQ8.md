# Deployment Guide - Push to irozq8.com (Latest)

## ✅ Code Pushed Successfully!

**Commit**: `a53ea46`  
**Branch**: `main`  
**Repository**: https://github.com/elmarzoog86/irozq8

### What Was Deployed:

1. ✅ Coming soon page with promotional video
2. ✅ Domain-based logic (irozq8.com shows coming soon)
3. ✅ Session persistence fixes
4. ✅ TypeScript type definitions
5. ✅ Suspense boundary fixes for Next.js 14
6. ✅ Updated game components with player name display

---

## 🚀 Deploying to Vercel (irozq8.com)

### Step 1: Connect to Vercel (if not already connected)
1. Go to https://vercel.com
2. Click "New Project"
3. Connect your GitHub repository: `elmarzoog86/irozq8`
4. Select the `main` branch

### Step 2: Configure Environment Variables
In Vercel project settings, add these environment variables:

```env
TWITCH_CLIENT_ID=sle6i9b97snxye1cvcng3fkny86yjd
TWITCH_CLIENT_SECRET=rzcdm3w4u6gqpup2pgojt2wo315txc
TWITCH_REDIRECT_URI=https://irozq8.com/api/twitch/callback
NEXT_PUBLIC_TWITCH_CLIENT_ID=sle6i9b97snxye1cvcng3fkny86yjd
NEXT_PUBLIC_COMING_SOON=false
NODE_ENV=production
```

### Step 3: Deploy
**Option A: Automatic Deployment (Recommended)**
- Push to `main` branch → Vercel auto-deploys
- Your latest commit will be deployed automatically

**Option B: Manual Deployment**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deploy"
4. Select `main` branch

### Step 4: Verify Deployment
After deployment completes:

1. **Check Production URL**: https://irozq8.com
   - Should show: Promotional video + "Coming Soon" page
   - All other routes disabled

2. **Check Subdomain** (if applicable): https://app.irozq8.com
   - Should show: Full game platform
   - All features accessible

3. **Test Local**: http://localhost:3000
   - Shows: Full game platform (unchanged)

---

## 🎯 What Each Domain Should Show

### irozq8.com (Main Domain)
```
✅ Promotional Video (rozq8_3.webm)
✅ "Coming Soon" Messaging
✅ Branding
❌ Games (hidden)
❌ Twitch Login (disabled)
❌ Game Features (disabled)
```

### localhost:3000 (Local Testing)
```
✅ Full Game Platform
✅ All Games Available
✅ Twitch Authentication
✅ Player Features
✅ Leaderboards
```

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub (`git push origin main`)
- [ ] Vercel connected to repository
- [ ] Environment variables configured in Vercel
- [ ] Build succeeds in Vercel
- [ ] https://irozq8.com shows coming soon page
- [ ] Video plays on main domain
- [ ] Local testing still works normally

---

## 🔍 Monitoring After Deployment

### Check Vercel Build Logs:
1. Go to https://vercel.com/dashboard
2. Select `irozq8` project
3. Check latest deployment logs
4. Ensure build status: ✅ `Ready`

### Common Issues & Fixes:

**Issue**: Build fails  
**Fix**: Check environment variables are set correctly

**Issue**: Video not displaying  
**Fix**: Verify `public/videos/rozq8_3.webm` file exists in deployment

**Issue**: Session lost on production  
**Fix**: Ensure `TWITCH_REDIRECT_URI` matches exactly

**Issue**: Coming soon shows on all domains  
**Fix**: Check domain detection logic in `src/app/page.tsx`

---

## 📞 Rollback (if needed)

If something goes wrong:

```bash
# Revert to previous commit
git revert a53ea46
git push origin main

# Vercel will auto-deploy the revert
```

---

## 🎬 Next Steps

1. **Monitor** the deployment at https://irozq8.com
2. **Test** video playback and responsiveness
3. **Verify** local development still works
4. **Check** logs in Vercel dashboard
5. **Share** the coming soon page with stakeholders

---

## 📝 Deployment Info

- **Deployment Date**: February 18, 2026
- **Commit Hash**: `a53ea46`
- **Video File**: `public/videos/rozq8_3.webm` (15.03 MB total push)
- **Repository**: https://github.com/elmarzoog86/irozq8
- **Main Domain**: https://irozq8.com

---

**Need Help?**
- Check Vercel logs: https://vercel.com/dashboard
- Review commits: https://github.com/elmarzoog86/irozq8/commits/main
- Check environment setup: See `.env.local` structure
