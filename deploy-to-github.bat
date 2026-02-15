@echo off
REM iRozQ8 GitHub Deployment Script
REM This script helps you push your code to GitHub

echo.
echo ========================================
echo   iRozQ8 GitHub Deployment Setup
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Download from: https://git-scm.com/download/win
    echo Then restart this script.
    pause
    exit /b 1
)

echo [1/5] Initializing Git repository...
git init
if errorlevel 1 goto error

echo [2/5] Adding all files...
git add .
if errorlevel 1 goto error

echo [3/5] Creating initial commit...
git commit -m "Initial commit: iRozQ8 gaming platform"
if errorlevel 1 goto error

echo [4/5] Setting main branch...
git branch -M main
if errorlevel 1 goto error

echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo.
echo 1. Go to GitHub: https://github.com/new
echo 2. Create a new repository named: irozq8
echo 3. Copy the repository URL (looks like https://github.com/USERNAME/irozq8.git)
echo 4. Paste it when prompted below:
echo.

set /p GITHUB_URL="Enter your GitHub repository URL: "

echo.
echo [5/5] Adding remote and pushing code...
git remote add origin %GITHUB_URL%
if errorlevel 1 goto error

git push -u origin main
if errorlevel 1 goto error

echo.
echo ========================================
echo   SUCCESS! ✓
echo ========================================
echo.
echo Your code is now on GitHub!
echo.
echo Next: Deploy to Vercel
echo 1. Go to https://vercel.com
echo 2. Click "Import Project"
echo 3. Select your GitHub repository
echo 4. Click "Deploy"
echo.
pause
exit /b 0

:error
echo.
echo ERROR occurred. Check the message above.
pause
exit /b 1
