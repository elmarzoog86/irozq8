# 🌐 Deploy iRozQ8 to irozq8.com

Your gaming platform is ready to go live! Here's how to deploy to your domain.

## ⚡ Quick Start (Recommended: Vercel)

Vercel is **free**, **automatic**, and works perfectly with Next.js.

### Step 1: Create GitHub Repository

1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name**: `irozq8`
   - **Description**: iRozQ8 Interactive Games Platform
   - **Public** or **Private** (your choice)
3. Click **Create Repository**

### Step 2: Push Your Code to GitHub

Open PowerShell in your project folder and run:

```powershell
git init
git add .
git commit -m "Initial commit: iRozQ8 gaming platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/irozq8.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

### Step 3: Deploy on Vercel

1. Go to **https://vercel.com**
2. Click **Sign Up** (or login if you have an account)
3. Select **Continue with GitHub**
4. Authorize Vercel to access your GitHub
5. Click **Import Project**
6. Select **irozq8** repository
7. Click **Import**
8. Vercel will auto-detect Next.js settings
9. Click **Deploy**
10. Wait 2-5 minutes for deployment

### Step 4: Connect Your Domain (irozq8.com)

After deployment:

1. Go to **Project Settings** (in Vercel dashboard)
2. Click **Domains**
3. Enter: `irozq8.com`
4. Click **Add**
5. Vercel will show you **nameservers** to add

#### Option A: If irozq8.com is registered elsewhere:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **Nameserver settings**
3. Replace with Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
   - `ns3.vercel-dns.com`
   - `ns4.vercel-dns.com`
4. Save and wait 24-48 hours for DNS to propagate

#### Option B: If irozq8.com is with Vercel:

Follow the on-screen instructions in Vercel dashboard (usually just clicking "Verify")

### Step 5: Test Your Domain

After DNS propagates (24-48 hours):
- Visit **https://irozq8.com** ✅
- Share with friends globally! 🎉

---

## Alternative: Deploy to Netlify

If you prefer Netlify:

1. Go to **https://netlify.com**
2. Click **Sign up with GitHub**
3. Authorize Netlify
4. Click **New site from Git**
5. Select your `irozq8` repo
6. Netlify auto-detects Next.js
7. Click **Deploy**
8. Add your domain in **Site settings → Domain management**

---

## Alternative: Deploy on Your Own Server

If you want full control:

1. **Rent a VPS** (DigitalOcean, Linode, AWS - ~$5-10/month)
2. **SSH into server**
3. **Install Node.js & npm**
4. **Clone your repo**: `git clone https://github.com/YOUR_USERNAME/irozq8.git`
5. **Install dependencies**: `npm install`
6. **Build**: `npm run build`
7. **Start**: `npm start`
8. **Point domain** to server IP address
9. **Use PM2** to keep server running: `npm install -g pm2` then `pm2 start "npm start"`

---

## 🎯 Which Option to Choose?

| Option | Best For | Cost | Ease |
|--------|----------|------|------|
| **Vercel** | Hosting Next.js apps | FREE | ⭐⭐⭐⭐⭐ |
| **Netlify** | Hosting Next.js apps | FREE | ⭐⭐⭐⭐ |
| **Own Server** | Full control | $5-50/mo | ⭐⭐ |

**RECOMMENDATION**: Use **Vercel** - it's free, automatic, and perfect for Next.js.

---

## 📋 Troubleshooting

### "irozq8.com is not resolving"
- Check DNS propagation at https://www.nslookup.io
- DNS can take 24-48 hours to update worldwide

### "GitHub not recognized"
- Install Git from https://git-scm.com/download/win
- Restart PowerShell
- Run: `git --version` to verify

### "Permission denied on git push"
- Create Personal Access Token: https://github.com/settings/tokens
- Use token as password when pushing

### "npm install fails"
- Delete `node_modules` folder
- Run: `npm install --legacy-peer-deps`

---

## ✅ Deployment Checklist

- [ ] Create GitHub account (https://github.com)
- [ ] Create new repository named `irozq8`
- [ ] Push code to GitHub with git commands
- [ ] Create Vercel account (https://vercel.com)
- [ ] Import GitHub repo into Vercel
- [ ] Click Deploy
- [ ] Add irozq8.com domain in Vercel
- [ ] Update DNS nameservers at domain registrar
- [ ] Wait 24-48 hours for DNS
- [ ] Test https://irozq8.com
- [ ] Share with friends!

---

## 🚀 After Deployment

Once live at irozq8.com:

1. **Share the link** with friends: `https://irozq8.com`
2. **Monitor traffic** in Vercel/Netlify dashboard
3. **Add more games** by editing `src/data/games.ts`
4. **Update content** by pushing new commits to GitHub
5. **Enable Twitch integration** (optional) by adding OAuth credentials

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Git Help**: https://git-scm.com/doc

---

**Ready?** Start with Step 1 above! 🎮
