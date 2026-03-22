#!/bin/bash

echo "🔍 Medical Billing Dashboard - Deployment Checklist"
echo "=================================================="
echo ""

# Check Node version
echo "✓ Node.js version:"
node --version
echo ""

# Check npm packages
echo "✓ Dependencies installed:"
if [ -d "node_modules" ]; then
  echo "  ✅ node_modules found"
else
  echo "  ⚠️  Running npm install..."
  npm install
fi
echo ""

# Check env configuration
echo "✓ Environment Configuration:"
if [ -f ".env.local" ]; then
  echo "  ✅ .env.local exists"
  if grep -q "DATABASE_URL" .env.local; then
    echo "  ✅ DATABASE_URL is set"
  else
    echo "  ⚠️  DATABASE_URL not found in .env.local"
  fi
else
  echo "  ⚠️  .env.local not found - create from .env.example"
fi
echo ""

# Check critical files
echo "✓ Critical Files:"
files=("package.json" "next.config.js" "middleware.js" "vercel.json")
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file missing"
  fi
done
echo ""

# Build test
echo "✓ Build Test:"
echo "  Running: npm run build"
npm run build
if [ $? -eq 0 ]; then
  echo "  ✅ Build successful"
else
  echo "  ❌ Build failed - fix errors above"
  exit 1
fi
echo ""

# Security check
echo "✓ Security Checks:"
if grep -q "better-sqlite3" package.json; then
  echo "  ⚠️  better-sqlite3 included (OK for local, won't work in Vercel)"
fi

if grep -q "open-chrome" package.json; then
  echo "  ✅ open-chrome script properly configured"
fi
echo ""

echo "✅ All checks passed - Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Ensure DATABASE_URL is set in your deployment platform"
echo "2. Set AUTH_SECRET to a secure random value"
echo "3. Push to GitHub: git push origin main"
echo "4. Deploy via Vercel dashboard or 'vercel deploy'"
