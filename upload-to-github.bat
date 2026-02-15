@echo off
REM GitHub Upload Script for iRozQ8
REM This script automatically uploads all your code to GitHub

REM IMPORTANT: You must have Git installed first!
REM Download from: https://git-scm.com/download/win

echo.
echo ====================================================================
echo                  iRozQ8 - GitHub Auto-Upload
echo ====================================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Step 1: Initializing Git Repository...
cd /d "c:\Users\elmar\OneDrive\Desktop\Roz"
git init

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit - iRozQ8 gaming platform with 4 games"

echo.
echo Step 4: Renaming branch to main...
git branch -M main

echo.
echo ====================================================================
echo IMPORTANT: You must complete these steps manually:
echo ====================================================================
echo.
echo 1. Go to: https://github.com/new
echo.
echo 2. Create a repository named: irozq8
echo.
echo 3. Copy the URL from GitHub (should look like:
echo    https://github.com/YOUR_USERNAME/irozq8.git)
echo.
echo 4. Come back here and enter that URL when prompted
echo.
echo ====================================================================
echo.

setlocal enabledelayedexpansion
set /p github_url="Enter your GitHub repository URL: "

if "!github_url!"=="" (
    echo ERROR: No URL provided!
    pause
    exit /b 1
)

echo.
echo Step 5: Adding remote repository...
git remote add origin !github_url!

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo This might be because:
    echo - The URL is incorrect
    echo - Your credentials aren't configured
    echo.
    echo Try running: git config --global user.name "Your Name"
    echo And: git config --global user.email "your.email@example.com"
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================================================
echo SUCCESS! Your code has been uploaded to GitHub!
echo ====================================================================
echo.
echo Your repository is now at: !github_url!
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Sign in with GitHub
echo 3. Create new project
echo 4. Select: irozq8
echo 5. Click: Deploy
echo.
pause
