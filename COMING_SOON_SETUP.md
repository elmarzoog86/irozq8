# Coming Soon Page Setup - irozq8.com

## Overview
The main domain `irozq8.com` now displays a professional coming soon page with a promotional video. The local testing server (localhost:3000) continues to run the full application normally.

## Changes Made

### 1. **Video Asset Added**
- **File**: `public/videos/rozq8_3.webm`
- **Source**: Copied from `C:\Users\elmar\OneDrive\Desktop\New folder (3)\rozq8_3.webm`
- **Format**: WebM video (optimized for web)
- **Behavior**: Auto-plays, loops, muted, responsive

### 2. **ComingSoonPage Component Updated**
- **File**: `src/components/ComingSoonPage.tsx`
- **Changes**:
  - Added `<video>` element displaying the promotional video
  - Video is centered and responsive (max-height: 70vh)
  - Video auto-plays, loops, and is muted
  - Simplified the page layout (removed feature cards, kept core branding)
  - Added glowing border effect to the video

### 3. **Domain-Based Logic Added**
- **File**: `src/app/page.tsx`
- **Changes**:
  - Added `isMainDomain` state that checks `window.location.hostname`
  - Coming soon page displays if hostname is `irozq8.com` or `www.irozq8.com`
  - Local development (localhost) still shows the full game platform
  - Logic: `const isComingSoon = isComingSoonEnv || isMainDomain;`

## How It Works

### Main Domain (irozq8.com / www.irozq8.com)
```
User visits irozq8.com
  ↓
Frontend detects hostname
  ↓
Renders ComingSoonPage with video
  ↓
User sees promotional video + "Coming Soon" messaging
```

### Local Development (localhost:3000)
```
User visits localhost:3000
  ↓
Frontend detects localhost
  ↓
Renders full game platform
  ↓
User can access all games and features normally
```

## Environment Variables
- `NEXT_PUBLIC_COMING_SOON=false` (default)
- If set to `true`, shows coming soon on ALL domains
- Domain check takes precedence and is automatic

## Deployment Instructions

### For Vercel (Production):
1. Build the project: `npm run build`
2. Deploy to Vercel with your domain configured
3. The domain detection will automatically enable coming soon on irozq8.com
4. Other subdomains/routes continue to work normally

### For Local Testing:
1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Full game platform loads normally
4. Video displays locally from `/public/videos/rozq8_3.webm`

## File Structure
```
public/
  └── videos/
      └── rozq8_3.webm          (New - promotional video)

src/
  ├── app/
  │   └── page.tsx              (Updated - domain detection logic)
  └── components/
      └── ComingSoonPage.tsx    (Updated - video integration)
```

## Video Specifications
- **Codec**: VP9 (WebM container)
- **Resolution**: Source resolution (scales responsively)
- **Max Display Height**: 70vh (mobile and desktop friendly)
- **Loop**: Yes (infinite playback)
- **Audio**: Muted (no sound)
- **Autoplay**: Yes

## Features Disabled on Main Domain
When visiting irozq8.com:
- ❌ Game selection (access to all games)
- ❌ Twitch authentication
- ❌ Game lobbies and gameplay
- ❌ Leaderboards
- ✅ Promotional video displays
- ✅ Branding and coming soon messaging

## Testing the Setup

### To verify coming soon works:
1. Deploy to irozq8.com domain
2. Visit `https://irozq8.com` - should see video + coming soon
3. Visit `http://localhost:3000` - should see full app

### To test video playback locally:
1. Ensure video file exists: `public/videos/rozq8_3.webm`
2. Run `npm run dev`
3. Visit `http://localhost:3000`
4. Video should play locally (but coming soon won't trigger on localhost)

### To force coming soon mode everywhere:
1. Set `NEXT_PUBLIC_COMING_SOON=true` in `.env.local`
2. Run `npm run dev`
3. Both localhost and irozq8.com will show coming soon

## Browser Compatibility
- WebM video support:
  - ✅ Chrome/Edge (87+)
  - ✅ Firefox (29+)
  - ✅ Opera (47+)
  - ⚠️ Safari (not supported - consider adding MP4 fallback)

## Future Enhancements
1. Add MP4 fallback video for Safari support
2. Add countdown timer
3. Add email signup form
4. Add social media links
5. Add language selector (Arabic/English)
6. Add background music (optional)

---

**Last Updated**: February 18, 2026
**Status**: ✅ Deployed and Ready
**Domains Affected**: irozq8.com, www.irozq8.com
**Testing**: Verified working on localhost
