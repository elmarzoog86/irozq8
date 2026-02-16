# 🌐 How to Connect irozq8.com Domain to Vercel

## Step-by-Step Guide

### STEP 1: Deploy on Vercel First ⚠️

**Important:** You MUST deploy on Vercel FIRST before adding domain!

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click: "New Project"
4. Select: `irozq8` repository
5. Click: "Deploy"
6. **Wait 2-5 minutes** for deployment to complete
7. Copy the temporary URL (looks like: `https://irozq8.vercel.app`)

---

### STEP 2: Add Domain in Vercel Dashboard

Once deployment is COMPLETE:

1. **Go to:** https://vercel.com/dashboard
2. **Find your project:** `irozq8`
3. **Click on it** to open project settings
4. **Look for:** "Settings" tab (usually at top)
5. **Find:** "Domains" section (left sidebar)
6. **Click:** "Add Domain"
7. **Type:** `irozq8.com`
8. **Click:** "Add"

---

### STEP 3: Copy Nameservers from Vercel

After clicking "Add", Vercel will show you **4 nameservers**.

They look like:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

**👉 IMPORTANT: Copy ALL 4 nameservers and save them somewhere safe!**

---

### STEP 4: Go to Your Registrar (Namecheap or GoDaddy)

This is where you bought the domain `irozq8.com`

#### If you use **Namecheap**:

1. Log in to: https://www.namecheap.com
2. Go to: "Dashboard" → "Manage" (next to irozq8.com)
3. Look for: "Nameservers" section
4. Change from "Namecheap BasicDNS" to "Custom DNS"
5. Delete existing nameservers
6. Paste the 4 Vercel nameservers
7. Click: "Save Changes"

#### If you use **GoDaddy**:

1. Log in to: https://www.godaddy.com
2. Go to: "My Products" → "Domains"
3. Find: `irozq8.com` → Click settings icon
4. Look for: "Nameservers"
5. Change to "Custom"
6. Delete existing nameservers
7. Paste the 4 Vercel nameservers
8. Click: "Save"

---

### STEP 5: Wait for DNS Propagation (Automatic)

**Time needed:** 24-48 hours

During this time:
- ✅ Your Vercel project is live at `irozq8.vercel.app`
- ✅ Share this URL with friends immediately!
- ✅ Let DNS propagate in background (you don't do anything)

After 24-48 hours:
- ✅ `irozq8.com` will work
- ✅ All traffic goes to Vercel
- ✅ Platform is LIVE! 🎉

---

## 🎯 Visual Summary

```
Your Computer
    ↓
GitHub Repository
    ↓
Vercel Deploy (temporary: irozq8.vercel.app)
    ↓
Add Domain in Vercel (irozq8.com)
    ↓
Update Registrar Nameservers (24-48 hours)
    ↓
LIVE at irozq8.com 🚀
```

---

## ✅ Quick Checklist

- [ ] Deploy on Vercel (wait for green checkmark)
- [ ] Get deployment URL (irozq8.vercel.app)
- [ ] Add domain in Vercel settings (irozq8.com)
- [ ] Copy 4 Vercel nameservers
- [ ] Log into Namecheap/GoDaddy
- [ ] Replace nameservers with Vercel's 4
- [ ] Save changes at registrar
- [ ] Wait 24-48 hours
- [ ] Visit https://irozq8.com (should work!)
- [ ] Test all 4 games
- [ ] Share with friends! 🎮

---

## ❓ Common Questions

### Q: Can I skip the irozq8.vercel.app step?
**A:** No - you must have Vercel deployment first. The domain just points to it.

### Q: How long does DNS take?
**A:** Usually 24-48 hours, sometimes faster. It's automatic - you don't do anything.

### Q: Can I use irozq8.com immediately?
**A:** Yes! While waiting for DNS:
- Share `irozq8.vercel.app` with friends
- They can play right away
- After DNS (24-48h), they can use `irozq8.com`

### Q: What if domain doesn't work after 48 hours?
**A:** Check:
1. Nameservers are correct (copy from Vercel again)
2. Spelling of domain is correct
3. Wait a bit more (can take up to 72 hours rarely)

### Q: Where is my domain registered?
**A:** Check your email for "Domain Purchase Confirmation"
- If from Namecheap.com → Use Namecheap steps
- If from GoDaddy.com → Use GoDaddy steps
- Not sure? Try both - whichever lets you log in!

---

## 📞 Support

If something goes wrong:
1. Check nameserver spellings (they're case-insensitive but must be exact)
2. Make sure domain is showing in Vercel dashboard
3. Wait longer (DNS can be slow)
4. Contact Vercel support at https://vercel.com/support

---

## ✨ After Everything Works

Once `irozq8.com` is live:

1. ✅ Test all 4 games on your domain
2. ✅ Share with friends: "Play my games at irozq8.com"
3. ✅ Monitor performance
4. ✅ Add more games if you want!

---

**Ready? Start with Vercel deployment first!** 🚀
