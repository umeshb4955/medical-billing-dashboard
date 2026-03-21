@echo off
REM Azure Deployment Preparation Script

echo ========================================
echo Medical Billing Dashboard - Azure Deploy
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found.
    exit /b 1
)

echo ✓ Node.js and npm detected
echo.

REM Clean build artifacts
echo Cleaning build artifacts...
if exist ".\.next" rmdir /s /q ".\.next"
if exist ".\node_modules\.cache" rmdir /s /q ".\node_modules\.cache"
echo ✓ Clean complete
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Build
echo Building application...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    echo Try:
    echo 1. Restart this terminal
    echo 2. Disable antivirus temporarily
    echo 3. Use Azure Portal for deployment instead
    exit /b 1
)
echo ✓ Build successful
echo.

echo ========================================
echo Ready for deployment!
echo ========================================
echo.
echo Next steps:
echo 1. Open AZURE_DEPLOYMENT_GUIDE.md
echo 2. Follow the deployment instructions
echo 3. Your app will be live at: https://your-app-name.azurewebsites.net
echo.
pause
