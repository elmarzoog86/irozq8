# GitHub Auto-Upload Script for iRozQ8
# Run this script to automatically upload all code to GitHub

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║         iRozQ8 - GitHub Auto-Upload Script                ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
try {
    git --version | Out-Null
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Navigate to project directory
Write-Host "Step 1: Navigating to project directory..." -ForegroundColor Cyan
Set-Location "c:\Users\elmar\OneDrive\Desktop\Roz"
Write-Host "✓ In directory: $(Get-Location)" -ForegroundColor Green

# Initialize Git
Write-Host ""
Write-Host "Step 2: Initializing Git repository..." -ForegroundColor Cyan
git init
Write-Host "✓ Git repository initialized" -ForegroundColor Green

# Add all files
Write-Host ""
Write-Host "Step 3: Adding all files..." -ForegroundColor Cyan
git add .
Write-Host "✓ All files added" -ForegroundColor Green

# Create commit
Write-Host ""
Write-Host "Step 4: Creating commit..." -ForegroundColor Cyan
git commit -m "Initial commit - iRozQ8 gaming platform with 4 games"
Write-Host "✓ Commit created" -ForegroundColor Green

# Rename to main
Write-Host ""
Write-Host "Step 5: Setting up main branch..." -ForegroundColor Cyan
git branch -M main
Write-Host "✓ Branch set to main" -ForegroundColor Green

# Get GitHub URL
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║                    MANUAL STEPS NEEDED                     ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "You need to create a repository on GitHub first:" -ForegroundColor White
Write-Host ""
Write-Host "  1. Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Repository name: irozq8" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Visibility: Public" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. Click: Create repository" -ForegroundColor Cyan
Write-Host ""
Write-Host "  5. You'll see a URL like:" -ForegroundColor Cyan
Write-Host "     https://github.com/YOUR_USERNAME/irozq8.git" -ForegroundColor Gray
Write-Host ""
Write-Host "  6. Copy that URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host ""

$github_url = Read-Host "Paste your GitHub repository URL here"

if ([string]::IsNullOrWhiteSpace($github_url)) {
    Write-Host ""
    Write-Host "ERROR: No URL provided!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add remote
Write-Host ""
Write-Host "Step 6: Connecting to GitHub..." -ForegroundColor Cyan
git remote add origin $github_url
Write-Host "✓ GitHub repository connected" -ForegroundColor Green

# Push to GitHub
Write-Host ""
Write-Host "Step 7: Uploading files to GitHub..." -ForegroundColor Cyan
Write-Host "(This may ask for your GitHub credentials...)" -ForegroundColor Gray
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Upload failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "This might be because:" -ForegroundColor Yellow
    Write-Host "  • The URL is incorrect" -ForegroundColor Gray
    Write-Host "  • Your GitHub credentials aren't configured" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Try configuring Git first:" -ForegroundColor Cyan
    Write-Host "  git config --global user.name 'Your Name'" -ForegroundColor Gray
    Write-Host "  git config --global user.email 'your.email@example.com'" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ SUCCESS! CODE UPLOADED!                   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository: $github_url" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Go to: https://vercel.com" -ForegroundColor White
Write-Host "  2. Sign in with GitHub" -ForegroundColor White
Write-Host "  3. Create new project" -ForegroundColor White
Write-Host "  4. Select: irozq8" -ForegroundColor White
Write-Host "  5. Click: Deploy" -ForegroundColor White
Write-Host ""
Write-Host "Your platform will be LIVE in 5 minutes!" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter when ready"
