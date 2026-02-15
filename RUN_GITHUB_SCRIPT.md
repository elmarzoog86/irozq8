# 🚀 HOW TO USE THE AUTO-UPLOAD SCRIPT

## What is this?

I've created TWO scripts that will automatically upload all your code to GitHub in one click!

You don't have to manually upload files anymore - the script does it all for you!

---

## 📋 REQUIREMENTS

**You need Git installed first!**

### Check if you have Git:

1. Open PowerShell
2. Type: `git --version`
3. If you see a version number → You have Git! ✅
4. If you see "not recognized" → Install Git first

### Install Git (if needed):

1. Go to: https://git-scm.com/download/win
2. Download and install
3. Use default settings (click "Next" through everything)
4. **Important: Restart PowerShell after installing**

---

## 🎯 HOW TO RUN THE SCRIPT

### Option 1: PowerShell Script (Recommended)

**This is the EASIEST - recommended for you!**

1. **Open PowerShell**
   - Right-click on desktop
   - Click: "Open PowerShell here"
   - **OR** Press: `Win + X` then click "Windows PowerShell"

2. **Navigate to your project:**
   ```powershell
   cd c:\Users\elmar\OneDrive\Desktop\Roz
   ```

3. **Run the script:**
   ```powershell
   .\upload-to-github.ps1
   ```

4. **If you get an error about execution policy:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   Then run the script again

---

### Option 2: Batch Script

**Alternative - simpler GUI**

1. Open File Explorer
2. Navigate to: `c:\Users\elmar\OneDrive\Desktop\Roz`
3. Find: `upload-to-github.bat`
4. Double-click it
5. A command window will open
6. Follow the prompts

---

## ✅ STEP-BY-STEP WHAT THE SCRIPT DOES

### When you run the script:

1. **Script checks if Git is installed** ✓
2. **Script creates Git repository** ✓
3. **Script adds all your files** ✓
4. **Script creates a commit** ✓

5. **Script asks you to do ONE thing manually:**
   - Go to GitHub.com
   - Create a repo named "irozq8"
   - Copy the URL
   - Paste it into the script

6. **Script pushes everything to GitHub** ✓

---

## 📊 WHAT HAPPENS STEP-BY-STEP

```
You run the script
    ↓
Script checks for Git ✓
    ↓
Script initializes repository ✓
    ↓
Script adds all files ✓
    ↓
Script creates commit ✓
    ↓
Script asks for GitHub URL
(You provide it)
    ↓
Script connects to GitHub ✓
    ↓
Script pushes all files ✓
    ↓
SUCCESS! 🎉
    ↓
All your code is on GitHub!
    ↓
Now deploy on Vercel
```

---

## 🎯 BEFORE YOU RUN THE SCRIPT

### Create your GitHub repository first:

1. **Go to:** https://github.com/new

2. **Fill in:**
   - Repository name: `irozq8`
   - Description: (optional) "Gaming platform with 4 games"
   - Visibility: `Public` ← IMPORTANT!

3. **Click:** "Create repository"

4. **You'll see a green box with your URL**
   - It looks like: `https://github.com/YOUR_USERNAME/irozq8.git`
   - **Copy this URL**

5. **Keep this page open** - you'll paste the URL into the script

---

## 🚀 RUN THE SCRIPT NOW

### In PowerShell:

```powershell
cd c:\Users\elmar\OneDrive\Desktop\Roz
.\upload-to-github.ps1
```

The script will:
1. Ask you to create a repo on GitHub ✓
2. Ask you to paste the GitHub URL ✓
3. Upload everything automatically ✓

---

## ❓ WHAT IF SOMETHING GOES WRONG?

### "Script execution disabled"

Run this in PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then run the script again.

### "Git not installed"

Download from: https://git-scm.com/download/win
Install it, restart PowerShell, then run the script again.

### "Push failed"

1. Check the GitHub URL is correct
2. Make sure your repo is PUBLIC (not Private)
3. Check your GitHub login credentials

---

## ✅ AFTER THE SCRIPT SUCCEEDS

Your code is now on GitHub! 🎉

**Next step:**
1. Go to: https://vercel.com
2. Deploy your `irozq8` repo
3. Your platform goes LIVE in 5 minutes!

---

## 💡 WHY USE THE SCRIPT?

✅ **Automatic** - No manual steps except creating the repo
✅ **Fast** - Uploads everything at once
✅ **Easy** - Just copy-paste the GitHub URL
✅ **Error handling** - Tells you if something goes wrong

---

**Ready? Run the script now!** 🚀

```powershell
.\upload-to-github.ps1
```
