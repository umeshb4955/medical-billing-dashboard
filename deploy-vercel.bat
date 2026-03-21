@echo off
REM Vercel Quick Deploy Script

echo ========================================
echo VERCEL DEPLOYMENT WIZARD
echo ========================================
echo.
echo This script will deploy your Medical Billing Dashboard to Vercel.
echo.
echo REQUIREMENTS:
echo - Vercel account (https://vercel.com/signup)
echo - GitHub account (recommended) or email
echo.
echo DEPLOYMENT OPTIONS:
echo.
echo 1. Automatic GitHub Integration (RECOMMENDED)
echo    - Push code to GitHub
echo    - Vercel auto-deploys on every push
echo.
echo 2. Vercel CLI Direct Deploy
echo    - Deploy directly from your computer
echo    - One-time setup
echo.
echo.
choice /C 12 /M "Select deployment method (1 or 2): "

if errorlevel 2 goto method_cli
if errorlevel 1 goto method_github

:method_github
echo.
echo ========================================
echo METHOD 1: GitHub Integration (Recommended)
echo ========================================
echo.
echo Steps:
echo 1. Go to https://github.com/new to create a new repository
echo 2. Name it: medical-billing-dashboard
echo 3. Make it PUBLIC (Vercel works best with public repos)
echo 4. Run these commands:
echo.
echo    git init
echo    git add .
echo    git commit -m "Initial commit"
echo    git branch -M main
echo    git remote add origin https://github.com/YOUR-USERNAME/medical-billing-dashboard.git
echo    git push -u origin main
echo.
echo 5. Go to https://vercel.com/new
echo 6. Click "Import Git Repository"
echo 7. Select your GitHub repository
echo 8. Click Deploy!
echo.
echo Done!
echo.
pause
exit /b 0

:method_cli
echo.
echo ========================================
echo METHOD 2: Vercel CLI Deploy
echo ========================================
echo.
echo Step 1: Creating .vercelignore...
(
echo node_modules
echo .next
echo .git
echo .gitignore
echo README.md
echo VERCEL_DEPLOYMENT.md
echo AZURE_DEPLOYMENT_GUIDE.md
echo *.local
) > .vercelignore
echo ✓ .vercelignore created
echo.

echo Step 2: Starting Vercel deployment...
echo (You will be prompted to login to Vercel in your browser)
echo.
call vercel --prod

if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed
    echo.
    echo Troubleshooting:
    echo - Make sure you are logged into Vercel (https://vercel.com/login)
    echo - Try again with: vercel --prod
    pause
    exit /b 1
)

echo.
echo ========================================
echo DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your app is now LIVE and PUBLIC!
echo.
echo Check your deployment at:
echo https://vercel.com/dashboard
echo.
pause
exit /b 0
