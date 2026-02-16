# 🌐 Connect irozq8.com Domain to Vercel (GoDaddy)

## Complete GoDaddy Step-by-Step Guide

---

## ⚠️ PREREQUISITE: Deploy on Vercel First!

Before connecting your domain, you MUST:

1. ✅ Go to: https://vercel.com
2. ✅ Sign in with GitHub
3. ✅ Click: "New Project"
4. ✅ Select: `irozq8` repository
5. ✅ Click: "Deploy"
6. ✅ **Wait 2-5 minutes** for deployment to complete
7. ✅ You'll get a temporary URL: `https://irozq8.vercel.app`

**⚠️ Don't continue until you see "Deployment Complete"!**

---

## STEP 1: Get Vercel Nameservers

Once Vercel deployment is done:

1. Go to: https://vercel.com/dashboard
2. Click your `irozq8` project
3. Go to: **Settings** tab (top menu)
4. Find: **Domains** (left sidebar)
5. Click: **"Add Domain"**
6. Type: `irozq8.com`
7. Click: **"Add"**

**You'll see 4 nameservers like this:**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

👉 **COPY THESE 4 NAMESERVERS - You'll need them next!**

---

## STEP 2: Log Into GoDaddy

1. Open your browser
2. Go to: https://www.godaddy.com
3. Click: **"Sign In"** (top right)
4. Enter your GoDaddy email and password
5. Click: **"Sign In"**

---

## STEP 3: Find Your Domain in GoDaddy

After signing in:

1. Look for: **"My Products"** (usually top left or in menu)
2. Click: **"My Products"**
3. Find: **"Domains"** section
4. Look for: **"irozq8.com"** in the list
5. Click on it (or click the settings/gear icon next to it)

---

## STEP 4: Go to Domain Settings

You should see a domain control panel. Look for:

- **"Manage"** button (blue button)
- OR **Settings icon** (⚙️)

Click it to open domain settings.

---

## STEP 5: Find Nameserver Settings

In the domain settings page, look for:

- **"Nameservers"** 
- OR **"DNS"**
- OR **"DNS Management"**

Click on it. (Usually on left sidebar or in a tab)

---

## STEP 6: Change Nameservers to Custom

You should see current nameservers. Look for:

- **"Change Nameservers"** button
- OR a dropdown that says **"GoDaddy Nameservers"**

Click it and select: **"Custom Nameservers"**

---

## STEP 7: Delete Old Nameservers

You'll see existing nameservers (usually 2-3 of them).

For each one:
1. Click the **"X"** or **"Delete"** button next to it
2. Delete ALL existing nameservers

**After deletion, the field should be empty.**

---

## STEP 8: Add Vercel's 4 Nameservers

Now you have empty nameserver fields. Add Vercel's 4:

**Click in the first field and enter:**
```
ns1.vercel-dns.com
```

**Click in the second field and enter:**
```
ns2.vercel-dns.com
```

**Click in the third field and enter:**
```
ns3.vercel-dns.com
```

**Click in the fourth field and enter:**
```
ns4.vercel-dns.com
```

---

## STEP 9: Save Changes

Look for:
- **"Save"** button (usually blue/green)
- OR **"Update Nameservers"** button

Click it!

You should see a confirmation message like:
✅ "Nameservers updated successfully"

---

## STEP 10: Wait for DNS Propagation (Automatic)

**Time needed: 24-48 hours**

GoDaddy has updated the nameservers. Now the internet needs to update everywhere.

**During this time:**
- ✅ Your project is LIVE at `irozq8.vercel.app`
- ✅ Share this temporary URL with friends!
- ✅ They can start playing immediately
- ✅ DNS is propagating automatically in background

**After 24-48 hours:**
- ✅ Visit https://irozq8.com
- ✅ It should work!
- ✅ All your games are live on your main domain! 🎉

---

## 📋 Quick Checklist for GoDaddy

- [ ] Vercel deployment is COMPLETE
- [ ] Got 4 Vercel nameservers from Vercel dashboard
- [ ] Logged into GoDaddy
- [ ] Found irozq8.com domain
- [ ] Opened domain settings
- [ ] Found Nameservers section
- [ ] Changed to "Custom Nameservers"
- [ ] Deleted all old nameservers
- [ ] Added ns1.vercel-dns.com
- [ ] Added ns2.vercel-dns.com
- [ ] Added ns3.vercel-dns.com
- [ ] Added ns4.vercel-dns.com
- [ ] Clicked "Save" button
- [ ] Saw confirmation message
- [ ] Waiting 24-48 hours (automatic)
- [ ] Testing irozq8.com after DNS propagates

---

## 🎯 Visual Flow

```
1. Deploy on Vercel ✅
        ↓
2. Get Vercel Nameservers ✅
        ↓
3. Login to GoDaddy ✅
        ↓
4. Find irozq8.com domain ✅
        ↓
5. Go to Nameservers ✅
        ↓
6. Change to Custom ✅
        ↓
7. Delete old nameservers ✅
        ↓
8. Add 4 Vercel nameservers ✅
        ↓
9. Click Save ✅
        ↓
10. Wait 24-48 hours ⏳
        ↓
11. Visit irozq8.com 🎉
        ↓
PLATFORM LIVE! 🚀
```

---

## ⏱️ What Happens During DNS Wait

**Immediately (0 hours):**
- Vercel shows ✅ "Domain Pending"
- Your temporary URL still works: `irozq8.vercel.app`
- Share this with friends!

**After 6-12 hours:**
- DNS starts propagating
- Some people can access irozq8.com
- Others still need time

**After 24-48 hours:**
- DNS fully propagated
- Everyone can access irozq8.com
- All your friends can visit your domain! 🎮

---

## ❓ Troubleshooting GoDaddy

### Q: Can't find "Nameservers" option?
**A:** Try:
1. Go to My Products → Domains
2. Find irozq8.com
3. Click the **"⚙️ Settings"** icon
4. Look for **"DNS"** tab
5. Click on **"DNS Management"**

### Q: I see "GoDaddy nameservers" - where's the option to change?
**A:** 
1. Look for **"Change Nameservers"** text (usually clickable)
2. OR find a **dropdown menu**
3. Select **"Custom"** or **"I'll use my own nameservers"**

### Q: How many nameservers do I need?
**A:** You need **exactly 4**:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
- ns3.vercel-dns.com
- ns4.vercel-dns.com

**Don't add more, don't add fewer!**

### Q: What if domain still doesn't work after 48 hours?
**A:** Check:
1. All 4 nameservers are spelled exactly right (copy from Vercel)
2. Domain shows in Vercel dashboard as "Active"
3. Wait a bit longer (can rarely take 72 hours)
4. Clear browser cache: Press Ctrl+Shift+Delete

### Q: Can I test before 48 hours?
**A:** Yes! Use the temporary URL:
- https://irozq8.vercel.app ← Works immediately!
- Share this with friends while waiting for DNS

---

## ✨ After Everything Works

Once `irozq8.com` is live:

1. ✅ Visit https://irozq8.com
2. ✅ Test all 4 games
3. ✅ Check multiplayer works
4. ✅ Share with friends: "Play at irozq8.com" 🎮
5. ✅ Monitor performance

---

## 🚀 Ready?

**Start with Vercel deployment first!**

Once deployment is complete:
1. Scroll back up to STEP 1
2. Get Vercel nameservers
3. Follow this GoDaddy guide
4. Watch your domain go LIVE! 

**Good luck! Your platform will be amazing!** ✨
