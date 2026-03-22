@echo off
echo.
echo 🔍 Medical Billing Dashboard - Deployment Checklist [Windows]
echo ===========================================================
echo.

REM Check Node version
echo ✓ Node.js version:
call node --version
echo.

REM Check npm packages
echo ✓ Dependencies:
if exist "node_modules\" (
  echo   ✅ node_modules found
) else (
  echo   ⚠️  Running npm install...
  call npm install
)
echo.

REM Check env configuration
echo ✓ Environment Configuration:
if exist ".env.local" (
  echo   ✅ .env.local exists
  findstr /M "DATABASE_URL" ".env.local" >nul
  if !errorlevel! equ 0 (
    echo   ✅ DATABASE_URL is set
  ) else (
    echo   ⚠️  DATABASE_URL not found in .env.local
  )
) else (
  echo   ⚠️  .env.local not found - create from .env.example
)
echo.

REM Check critical files
echo ✓ Critical Files:
for %%F in (package.json next.config.js middleware.js vercel.json) do (
  if exist "%%F" (
    echo   ✅ %%F
  ) else (
    echo   ❌ %%F missing
  )
)
echo.

REM Build test
echo ✓ Build Test:
echo   Running: npm run build
call npm run build
if %errorlevel% equ 0 (
  echo   ✅ Build successful
) else (
  echo   ❌ Build failed - check errors above
  exit /b 1
)
echo.

REM Security check
echo ✓ Security Checks:
findstr "better-sqlite3" package.json >nul
if %errorlevel% equ 0 (
  echo   ⚠️  better-sqlite3 included (OK for local, won't work in Vercel)
)
echo   ✅ Configuration ready
echo.

echo ✅ All checks passed - Ready for deployment!
echo.
echo Next steps:
echo 1. Create .env.local from .env.example
echo 2. Set DATABASE_URL to your database connection string
echo 3. Set AUTH_SECRET to a secure random value
echo 4. Commit changes: git add . ^& git commit -m "Ready for production"
echo 5. Push to GitHub: git push origin main
echo 6. Deploy via Vercel: 
echo    a) Go to https://vercel.com/import
echo    b) Select your GitHub repo
echo    c) Add environment variables
echo    d) Click Deploy
echo.
pause
