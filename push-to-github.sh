#!/bin/bash

echo "🚀 GitHub Setup Helper for Keto Diet Tracker"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Check if files are staged
echo "📁 Adding all files to git..."
git add .

# Check git status
echo "📊 Current git status:"
git status --short

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Keto Diet Tracker with multi-platform deployment configs

- Added Express.js server with health checks
- Created deployment configs for Railway, Render, Vercel, Netlify
- Included comprehensive deployment documentation
- Ready for production deployment"

echo ""
echo "🔗 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Copy this command and replace YOUR_USERNAME with your GitHub username:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/keto-diet-tracker.git"
echo "   git push -u origin main"
echo ""
echo "3. Or use the GitHub CLI if you have it:"
echo "   gh repo create keto-diet-tracker --public --push"
echo ""
echo "✅ Your code is ready to push to GitHub!"