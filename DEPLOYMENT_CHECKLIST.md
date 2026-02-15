# ✅ DEPLOYMENT CHECKLIST - CHECK OFF AS YOU GO

## You have 3 main tasks to complete. Just follow this checklist!

---

## 🎯 TASK 1: DEPLOY ON VERCEL

**Time needed:** ~10 minutes (5 min deployment + 5 min setup)

**Your checklist:**

- [ ] **Open browser**
  - Go to: https://vercel.com

- [ ] **Sign In or Create Account**
  - Click: "Continue with GitHub"
  - Authorize Vercel to access GitHub
  - (If you already have account, just Sign In)

- [ ] **Create New Project**
  - Click: "New Project" or "+ Add New"

- [ ] **Select Your Repository**
  - Find: "irozq8" in the list
  - Click: On it (checkbox appears)
  - Click: "Import"

- [ ] **Configure Project**
  - All settings auto-fill (Next.js, build commands, etc)
  - Leave Environment Variables blank
  - **Click the BIG BLUE: "DEPLOY" button**

- [ ] **Wait for Deployment**
  - You'll see "Building..." with progress bar
  - **WAIT 2-5 MINUTES** (don't close browser!)
  - When done, you see: "✅ Deployment Successful"

- [ ] **Copy Your Temporary URL**
  - You'll see: `https://irozq8.vercel.app`
  - **Copy this link!**

- [ ] **Share with Friends RIGHT NOW**
  - Send them: https://irozq8.vercel.app
  - They can play while you wait for DNS!
  - They don't have to wait 24-48 hours!

**✅ Task 1 Complete!**

---

## 🎯 TASK 2: ADD DOMAIN TO VERCEL

**Time needed:** ~2 minutes

**Your checklist:**

- [ ] **Go Back to Vercel Dashboard**
  - You should still be logged in
  - Find your "irozq8" project

- [ ] **Open Settings**
  - Click: "Settings" tab at top

- [ ] **Click Domains**
  - Left menu → "Domains"

- [ ] **Add Your Domain**
  - Click: "+ Add Domain" button
  - Type: `irozq8.com`
  - Click: "ADD"

- [ ] **Copy the 4 Nameservers**
  - You'll see a box with:
    ```
    ns1.vercel-dns.com
    ns2.vercel-dns.com
    ns3.vercel-dns.com
    ns4.vercel-dns.com
    ```
  - **Copy or screenshot these 4 lines!**
  - You need them for the next task

**✅ Task 2 Complete!**

---

## 🎯 TASK 3: UPDATE DNS AT YOUR REGISTRAR

**Time needed:** ~2 minutes

**You'll need:**
- Login info for where you bought irozq8.com
- The 4 nameservers from Task 2

---

### 🔷 IF YOU REGISTERED AT NAMECHEAP:

- [ ] **Go to Namecheap**
  - Website: https://www.namecheap.com
  - Login with your credentials

- [ ] **Find Your Domain**
  - Click: "Dashboard" (left menu)
  - Click: "Domain List"
  - Find: "irozq8.com"
  - Click: "Manage"

- [ ] **Go to Nameservers**
  - Find tabs at top
  - Click: "Nameservers"

- [ ] **Select Custom DNS**
  - You see two options:
    - "Namecheap BasicDNS"
    - "Custom DNS"
  - **Select: "Custom DNS"** (click the radio button)

- [ ] **Paste Vercel's Nameservers**
  - You'll see 4 empty boxes:
    ```
    Nameserver 1: [               ]
    Nameserver 2: [               ]
    Nameserver 3: [               ]
    Nameserver 4: [               ]
    ```
  - **Paste the 4 from Task 2:**
    - ns1.vercel-dns.com
    - ns2.vercel-dns.com
    - ns3.vercel-dns.com
    - ns4.vercel-dns.com

- [ ] **Save Changes**
  - Look for: Green "SAVE" button
  - Click: It

**✅ Done with Namecheap!**

---

### 🔷 IF YOU REGISTERED AT GODADDY:

- [ ] **Go to GoDaddy**
  - Website: https://www.godaddy.com
  - Login with your credentials

- [ ] **Find Your Domain**
  - Click: "My Products"
  - Find: "irozq8.com" in the list
  - Click: "Manage" (or 3-dot menu)

- [ ] **Go to Nameservers**
  - Find: "Nameservers" section (scroll down if needed)
  - Click: "Change Nameservers"

- [ ] **Select Other Nameservers**
  - You see options like:
    - "GoDaddy nameservers"
    - "I'll use other nameservers"
  - **Select: "I'll use other nameservers"**

- [ ] **Paste Vercel's Nameservers**
  - You'll see 4 empty boxes
  - **Paste the 4 from Task 2:**
    - ns1.vercel-dns.com
    - ns2.vercel-dns.com
    - ns3.vercel-dns.com
    - ns4.vercel-dns.com

- [ ] **Save Changes**
  - Look for: "SAVE" button
  - Click: It

**✅ Done with GoDaddy!**

---

### 🔷 IF YOU REGISTERED SOMEWHERE ELSE:

- [ ] **Login to Your Registrar**
  - Remember where you bought the domain?
  - (Bluehost, HostGator, Wix, Squarespace, etc)
  - Log in there

- [ ] **Find Nameservers / DNS Settings**
  - Usually in: Domain Settings or Account Settings
  - Look for: "Nameservers" or "DNS"

- [ ] **Replace the Nameservers**
  - Delete: Old nameservers
  - Add: Vercel's 4 from Task 2:
    - ns1.vercel-dns.com
    - ns2.vercel-dns.com
    - ns3.vercel-dns.com
    - ns4.vercel-dns.com

- [ ] **Save**
  - Click: Save button

**✅ Done!**

---

## ⏳ TASK 4: WAIT (AUTOMATIC - NOTHING TO DO!)

- [ ] **Wait 24-48 Hours**
  - DNS updates automatically
  - You don't need to do anything
  - Meanwhile, your friends play on the temp URL!

- [ ] **Check Progress (Optional)**
  - Go to: https://www.nslookup.io
  - Enter: irozq8.com
  - If you see Vercel nameservers = DNS is propagating ✓

---

## 🎉 TASK 5: GO LIVE!

**After 24-48 hours:**

- [ ] **Visit Your Domain**
  - Open browser
  - Go to: https://irozq8.com

- [ ] **Verify It Works**
  - You should see: Your gaming platform
  - Click any game card
  - Game should load and work!

- [ ] **Test the Games**
  - Questions game: ✓
  - Roulette game: ✓
  - Fruits War game: ✓
  - Chairs game: ✓

- [ ] **Share Final URL with Friends**
  - Tell them: https://irozq8.com
  - They can play on your permanent domain now!

- [ ] **CELEBRATE! 🎉**
  - You did it!
  - Your platform is LIVE!

---

## 📊 PROGRESS TRACKER

**Current Status:**

```
Task 1: Deploy on Vercel         ☐ Not Started
Task 2: Add Domain to Vercel     ☐ Not Started  
Task 3: Update DNS at Registrar  ☐ Not Started
Task 4: Wait 24-48 Hours         ☐ Not Started
Task 5: Go Live & Celebrate      ☐ Not Started
```

**After Task 1:**
```
Task 1: Deploy on Vercel         ✅ DONE
Task 2: Add Domain to Vercel     ☐ Do this next
Task 3: Update DNS at Registrar  ☐ Do this after
Task 4: Wait 24-48 Hours         ⏳ Automatic
Task 5: Go Live & Celebrate      ☐ Final step
```

---

## 💡 TIPS

**If you get stuck:**
1. Go back and re-read that section
2. Look for the option name mentioned
3. Google: "[Registrar name] how to change nameservers"

**Common Mistakes:**
- ❌ Forgetting to click Deploy after selecting repo
- ✅ Remember: Click the BIG BLUE "DEPLOY" button

- ❌ Trying to wait for DNS before sharing
- ✅ Share the temp URL (irozq8.vercel.app) RIGHT AWAY

- ❌ Copying wrong nameservers
- ✅ Use the ones Vercel shows (ns1-4.vercel-dns.com)

---

## 🚀 START NOW!

**Right now:**
1. Open: https://vercel.com
2. Sign in with GitHub
3. Create new project
4. Select irozq8
5. Click Deploy

**That's it for now!** Follow this checklist and you're golden! 💪

---

**You've got this! Your platform will be LIVE soon!** 🎊
