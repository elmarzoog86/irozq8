#!/bin/bash
# Script to setup Jawlah Games Platform

echo "🎮 جوله - منصة الألعاب التفاعلية"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please download from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - SETUP.md - Installation guide"
echo "   - GAMES_GUIDE.md - Games information"
echo "   - CUSTOMIZATION.md - Customization guide"
echo ""
echo "Happy gaming! 🚀"
