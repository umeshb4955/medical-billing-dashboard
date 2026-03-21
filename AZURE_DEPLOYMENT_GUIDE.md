# Azure App Service Deployment Guide

## Prerequisites
- Azure Account (create at https://azure.microsoft.com/free)
- Azure CLI installed (already done ✓)
- Your code ready to deploy

## Option 1: Deploy via Azure Portal (Recommended - Simplest)

### Step 1: Create Resource Group
1. Go to https://portal.azure.com
2. Click "Resource groups" → "+ Create"
3. Set details:
   - **Subscription**: Select your subscription
   - **Resource group name**: `medical-billing-rg`
   - **Region**: Select closest to your location (e.g., East US)
4. Click "Review + create" → "Create"

### Step 2: Create App Service Plan
1. In Portal, search for "App Service plans"
2. Click "+ Create"
3. Fill in:
   - **Subscription**: Your subscription
   - **Resource Group**: `medical-billing-rg` (select the one you created)
   - **Name**: `medical-billing-plan`
   - **Operating System**: Windows
   - **Region**: Same as resource group
   - **Pricing Tier**: Click "Change size" → Select **B1** (Free tier won't work for Node.js)
4. Click "Review + create" → "Create"

### Step 3: Create App Service
1. Search for "App Services"
2. Click "+ Create"
3. Select "Web App"
4. Fill in:
   - **Subscription**: Your subscription
   - **Resource Group**: `medical-billing-rg`
   - **Name**: `medical-billing-app-[uniqueid]` (must be globally unique)
   - **Runtime stack**: Node 20 LTS
   - **Operating System**: Windows
   - **App Service Plan**: Select `medical-billing-plan`
5. Click "Review + create" → "Create"

### Step 4: Configure Application Settings
1. When deployment completes, go to the App Service
2. Left sidebar → "Configuration"
3. Click "New application setting" and add:
   - **Name**: `NODE_ENV` | **Value**: `production`
   - **Name**: `NEXT_PUBLIC_API_URL` | **Value**: `https://your-app-name.azurewebsites.net`
4. Click "Save"

### Step 5: Configure Node.js Runtime
1. In App Service → Left sidebar → "General settings"
2. Set:
   - **Stack**: Node
   - **Node version**: 20 LTS
   - **Startup file**: `server.js` (or leave empty - App Service will auto-detect)
3. Click "Save"

### Step 6: Deploy Your Code
1. In App Service → Left sidebar → "Deployment Center"
2. Choose deployment method:
   
   **Option A: GitHub (Recommended)**
   - Click "GitHub" → Authorize → Connect to your repo
   - Azure will automatically deploy whenever you push to main branch
   
   **Option B: Local Git**
   - Click "Local Git"
   - Copy the Git Clone URL
   - In your local repo:
     ```powershell
     git remote add azure [paste-clone-url]
     git push azure main
     ```
   
   **Option C: ZIP Deploy (Quickest)**
   - Build locally: `npm run build` (after fixing local build)
   - ZIP the project folder
   - Go to "Deployment Center" → "Manual deployment" → Upload ZIP

### Step 7: Monitor Deployment
1. Go to App Service → "Deployment slots" or check logs
2. View logs: "Monitoring" → "Log stream"
3. Your app is live at: `https://your-app-name.azurewebsites.net`

---

## Option 2: Deploy via GitHub Actions (For Continuous Deployment)

### Create GitHub Actions Workflow
1. In your repo, create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'your-app-name'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: .
```

2. Get Publish Profile:
   - App Service → "Get publish profile" (top right)
   - Copy the content
   - GitHub → Settings → Secrets → "New secret"
   - Name: `AZURE_PUBLISH_PROFILE` → Paste content

---

## Troubleshooting

### 502 Bad Gateway
- Check "Log Stream" for errors
- Ensure `npm start` works locally
- Verify Node version compatibility

### Application Insights / Monitoring
- Enable "Application Insights" in App Service
- View real-time logs and errors

### Database Issues (SQLite)
SQLite will not persist data across app restarts on Azure. For production:
- Migrate to Azure SQL Database or PostgreSQL
- Update connection strings
- Run migrations

---

## Cost Estimation (as of March 2026)
- **App Service Plan (B1)**: ~$13/month
- **SQL Database (if needed)**: ~$15/month basic tier
- **Total**: Starting from ~$13/month

(Free tier available but limited - suitable for testing only)
