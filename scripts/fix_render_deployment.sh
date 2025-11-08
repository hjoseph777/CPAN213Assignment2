#!/bin/bash

# Fix Render deployment by updating service configuration
echo "🔧 Fixing Render deployment configuration..."

# First, let's check if we have the Render CLI installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    curl -fsSL https://render.com/install-cli | bash
    # Add to PATH for current session
    export PATH="$HOME/.render/bin:$PATH"
fi

echo "📁 Current directory structure:"
pwd
ls -la

echo ""
echo "📁 Assignment directory contents:"
ls -la Assignment_2_Mongoose_Express_EJS_MongoDB/

echo ""
echo "🔍 Checking package.json location:"
if [ -f "Assignment_2_Mongoose_Express_EJS_MongoDB/package.json" ]; then
    echo "✅ package.json found in Assignment_2_Mongoose_Express_EJS_MongoDB/"
    cat Assignment_2_Mongoose_Express_EJS_MongoDB/package.json | head -10
else
    echo "❌ package.json not found in expected location"
fi

echo ""
echo "🚀 To fix the deployment, you have two options:"
echo ""
echo "Option 1: Update via Render Dashboard (Recommended)"
echo "1. Go to https://dashboard.render.com"
echo "2. Find your service (cpan213-assignment2 or similar)"
echo "3. Go to Settings"
echo "4. Set Root Directory to: Assignment_2_Mongoose_Express_EJS_MongoDB"
echo "5. Set Build Command to: npm install"
echo "6. Set Start Command to: npm start"
echo "7. Add environment variables:"
echo "   - MONGODB_URI: mongodb+srv://hjoseph:H6p24m!@cluster0.nizoxiv.mongodb.net/lab04?retryWrites=true&w=majority&appName=Cluster0"
echo "   - SESSION_SECRET: your-secret-key"
echo "   - NODE_ENV: production"
echo "8. Click 'Save Changes'"
echo ""
echo "Option 2: Delete and recreate service with correct settings"
echo ""
echo "The key fix is setting Root Directory to: Assignment_2_Mongoose_Express_EJS_MongoDB"
echo "This tells Render where to find your package.json file."