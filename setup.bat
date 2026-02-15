@echo off
REM Jawlah Games Platform Setup Script for Windows

echo.
echo 🎮 جوله - منصة الألعاب التفاعلية
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo 📥 Please download from: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

echo ✅ npm version:
npm --version

echo.
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🎉 Setup complete!
echo.
echo 📝 Next steps:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:3000
echo.
echo 📚 Documentation:
echo    - README.md - Project overview
echo    - SETUP.md - Installation guide
echo    - GAMES_GUIDE.md - Games information
echo    - CUSTOMIZATION.md - Customization guide
echo.
echo Happy gaming! 🚀
echo.
pause
