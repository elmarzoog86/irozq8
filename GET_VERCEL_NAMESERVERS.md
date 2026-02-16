# 🔗 How to Get Nameservers from Vercel

## Complete Step-by-Step Guide

---

## ⚠️ FIRST: Deploy on Vercel

You MUST deploy your project first before you can get nameservers!

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click: **"New Project"**
4. Select: **`irozq8`** repository
5. Click: **"Deploy"**
6. **Wait 2-5 minutes** until you see: ✅ **"Deployment Complete"**

Once deployment is complete, continue below.

---

## STEP 1: Go to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. You should see all your projects
3. Find: **`irozq8`** project
4. Click on it

---

## STEP 2: Open Project Settings

After clicking the project:

1. Look at the **top menu** (should show: Home, Deployments, Analytics, Settings)
2. Click: **"Settings"** tab

---

## STEP 3: Find the Domains Section

In Settings, look at the **left sidebar**. You should see:

- Overview
- Domains ← **Click this**
- Environment Variables
- Git
- etc.

Click: **"Domains"**

---

## STEP 4: Add Your Domain

In the Domains page:

1. You should see a **text field** that says:
   - "Enter a domain"
   - OR "Add a domain"
   - OR just an empty text box

2. Type: **`irozq8.com`**

3. Click: **"Add"** button (usually blue)

---

## STEP 5: Vercel Shows Your Nameservers!

**This is the important part!**

After clicking "Add", you'll see a message that says:

> "To use your domain with Vercel, add these nameservers to your DNS provider:"

**Below that, you'll see 4 nameservers:**

```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

👉 **THESE ARE YOUR NAMESERVERS!**

---

## 📋 What You See on Screen

It looks like this:

```
┌─────────────────────────────────────────────┐
│ Add Domain                                  │
├─────────────────────────────────────────────┤
│                                             │
│ Domain: irozq8.com                         │
│ Status: Pending nameserver update          │
│                                             │
│ To use your domain with Vercel, add these  │
│ nameservers to your DNS provider:          │
│                                             │
│ ✓ ns1.vercel-dns.com                      │
│ ✓ ns2.vercel-dns.com                      │
│ ✓ ns3.vercel-dns.com                      │
│ ✓ ns4.vercel-dns.com                      │
│                                             │
│ [Copy to clipboard] button (optional)      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Three Ways to Copy Them

### Option 1: Click "Copy" Button (Easiest)
- Vercel usually has a button to copy all 4 at once
- Click it
- Paste into a text file or document

### Option 2: Manual Copy
- Highlight each nameserver
- Right-click → Copy
- Paste somewhere safe
- Do this for all 4

### Option 3: Screenshot
- Take a screenshot of the screen
- Read them from the image

---

## ✅ After You Get Them

**Save these 4 nameservers somewhere!**

Examples of where to save:
- 📝 Copy to Notepad file
- 📝 Write on paper
- 📝 Save in text editor
- 📱 Take a photo with your phone

**Next step:** Go to GoDaddy and paste these 4 nameservers!

---

## 🔄 What Happens During This Time

While the nameservers are displayed:

- Your project is LIVE at: `https://irozq8.vercel.app`
- Vercel is waiting for you to add these nameservers to GoDaddy
- Status shows: "Pending nameserver update"
- You can see this status in Vercel dashboard anytime

---

## 📊 Timeline

```
1. Deploy on Vercel (2-5 min)
        ↓
2. Go to Settings → Domains
        ↓
3. Add irozq8.com
        ↓
4. See 4 Vercel nameservers ← YOU ARE HERE
        ↓
5. Copy the nameservers
        ↓
6. Go to GoDaddy
        ↓
7. Replace GoDaddy nameservers with Vercel's 4
        ↓
8. Wait 24-48 hours
        ↓
9. irozq8.com works! 🎉
```

---

## ❓ Common Questions

### Q: I don't see the nameservers on screen?
**A:** 
1. Make sure you're in: Settings → Domains
2. Make sure deployment is complete (green checkmark)
3. Try clicking "Add Domain" again
4. Try refreshing the page (F5)

### Q: Where do I copy them FROM?
**A:** Right from the Vercel dashboard where it shows them!

### Q: Do I need to do anything else in Vercel?
**A:** No! Just get the nameservers and leave them there. Vercel will auto-verify when you add them to GoDaddy.

### Q: What if I close this page?
**A:** Don't worry! You can come back anytime:
1. Go to: vercel.com/dashboard
2. Click: irozq8 project
3. Click: Settings → Domains
4. The nameservers will still be there

---

## 🚀 Ready for Next Step?

Once you have the 4 nameservers:

1. ✅ Copy all 4 nameservers from Vercel
2. ✅ Open the guide: **GODADDY_DOMAIN_SETUP.md**
3. ✅ Go to GoDaddy
4. ✅ Replace their nameservers with Vercel's 4
5. ✅ Save in GoDaddy
6. ✅ Wait 24-48 hours
7. ✅ Visit irozq8.com 🎉

---

## 📸 Visual Quick Reference

**In Vercel, you'll see:**

```
Dashboard → irozq8 Project → Settings → Domains

Then you see:

irozq8.com [status: Pending]

Nameservers needed:
ns1.vercel-dns.com  ← Copy this
ns2.vercel-dns.com  ← Copy this
ns3.vercel-dns.com  ← Copy this
ns4.vercel-dns.com  ← Copy this
```

---

## 💡 Pro Tips

1. **Copy them immediately** after seeing them
2. **Save them in notepad** or text file
3. **Don't type them manually** - copy/paste to avoid typos
4. **You need ALL 4** - don't skip any
5. **Case doesn't matter** - vercel-dns.com and VERCEL-DNS.COM are the same

---

**Next: Open GODADDY_DOMAIN_SETUP.md and follow it!** 🚀
