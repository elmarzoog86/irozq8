# 🌐 EXACT STEPS: Update GoDaddy Nameservers for irozq8.com

## ⏱️ TIME NEEDED: 5 minutes

---

## 🔑 Vercel Nameservers (Copy These)

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

---

## 📋 EXACT GODADDY STEPS

### Step 1: Login to GoDaddy
1. Open https://godaddy.com
2. Click **"Sign In"** (top right)
3. Enter your email and password
4. Click **"Sign In"**

---

### Step 2: Access Your Domain
1. After login, look for **"My Products"** (top left or after login)
2. Click **"Domains"**
3. Find **"irozq8.com"** in your list
4. Click on it to open domain settings

---

### Step 3: Find DNS Settings
1. In domain details, look for **"DNS"** or **"Nameservers"** section
2. You should see option that says:
   - **"Manage DNS"** OR
   - **"Nameservers"** OR
   - **"Change Nameservers"**
3. Click on it

---

### Step 4: Replace Nameservers

**CURRENT STATE** (You might see):
```
ns01.godaddy.com
ns02.godaddy.com
```

**DELETE THESE** and **REPLACE WITH**:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

---

### Step 5: Save Changes

1. Look for **"Save"** button (usually bottom right)
2. Click **"Save"**
3. You should see confirmation:
   - ✅ "Nameservers updated successfully"
   - OR "Changes saved"

---

## ⏳ AFTER YOU SAVE

### Wait 24-48 Hours

During this time:
- DNS changes propagate globally
- Different regions will point to Vercel at different times
- After propagation: `irozq8.com` will be LIVE

### Verify It's Working

1. Open browser
2. Go to: `https://irozq8.com`
3. You should see your iRozQ8 platform

---

## ❌ TROUBLESHOOTING

### Domain still doesn't work after 48 hours?

**1. Clear browser cache:**
- Press: `Ctrl + Shift + Delete`
- Clear "All time"
- Try again

**2. Try incognito mode:**
- `Ctrl + Shift + N` (Windows)
- Go to `https://irozq8.com`

**3. Verify nameservers were saved:**
- Go back to GoDaddy
- Check DNS settings
- Confirm it shows:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`

**4. Check propagation:**
- Visit: https://whatsmydns.net
- Enter: `irozq8.com`
- See which nameservers are active globally

**5. Still not working?**
- Contact GoDaddy support
- Contact Vercel support
- Wait additional 24 hours

---

## ✅ YOU'RE DONE!

Once nameservers are updated, your platform will be LIVE at `irozq8.com` within 24-48 hours! 🎉

