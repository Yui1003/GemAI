#!/bin/bash
# This script will be used by Render for building the application

# Install dependencies
npm install

# Build the client application
echo "Building client..."
npm run build

# Verify the build output structure
echo "Verifying build structure..."
if [ ! -d "dist/public" ]; then
  echo "Error: dist/public directory not found!"
  exit 1
fi

# Check for CSS files
CSS_COUNT=$(find dist/public -name "*.css" | wc -l)
echo "Found $CSS_COUNT CSS files"

# Check for JS files
JS_COUNT=$(find dist/public -name "*.js" | wc -l)  
echo "Found $JS_COUNT JavaScript files"

# Copy index.html to the root of dist/public if it's not there
if [ ! -f "dist/public/index.html" ]; then
  echo "Warning: index.html not found in dist/public"
fi

# Create a .env file if not present
if [ ! -f ".env" ]; then
  echo "Creating .env file..."
  echo "NODE_ENV=production" > .env
fi

echo "Build completed successfully!"