#!/bin/bash

# Alternative solution: Move files to root directory for Render
echo "🔄 Alternative: Moving files to root directory for Render compatibility..."

# Create backup
echo "📦 Creating backup..."
cp -r Assignment_2_Mongoose_Express_EJS_MongoDB Assignment_2_Mongoose_Express_EJS_MongoDB_backup

# Move files to root (except .git, README.md, render.yaml)
echo "📁 Moving application files to root..."
mv Assignment_2_Mongoose_Express_EJS_MongoDB/* ./ 2>/dev/null || true
mv Assignment_2_Mongoose_Express_EJS_MongoDB/.* ./ 2>/dev/null || true

# Remove empty directory
rmdir Assignment_2_Mongoose_Express_EJS_MongoDB 2>/dev/null || true

echo "✅ Files moved to root. Directory structure:"
ls -la

echo ""
echo "📝 You'll need to:"
echo "1. Commit these changes to git"
echo "2. Push to GitHub" 
echo "3. Update Render service Root Directory to: . (dot)"
echo "4. Or just remove the Root Directory setting entirely"

echo ""
echo "⚠️  Note: This changes your project structure. The backup is in Assignment_2_Mongoose_Express_EJS_MongoDB_backup/"