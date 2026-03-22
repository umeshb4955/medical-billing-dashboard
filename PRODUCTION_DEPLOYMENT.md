# Production Deployment Guide - Medical Billing Dashboard

## ⚠️ CRITICAL: Database Persistence Issue

Your current setup uses an **in-memory mock database** on Vercel, which means:
- ❌ All data is lost when the app restarts or redeployes
- ❌ NOT suitable for production with real billing data
- ✅ Only for demo/testing purposes

**Solution:** Use a persistent database service (PostgreSQL, MongoDB, or Firebase)

---

## Deployment Options

### Option 1: Vercel + PostgreSQL (RECOMMENDED - Free tier available)

**Simplest & most reliable setup for production**

#### Step 1: Set Up Database
Choose ONE database option:

**A) Free PostgreSQL via Railway.app**
```bash
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create new project → PostgreSQL
4. Copy the PostgreSQL connection string
5. Save as DATABASE_URL in your .env
```

**B) Free PostgreSQL via Render.com**
```bash
1. Go to https://render.com/
2. Sign up with GitHub
3. Create new PostgreSQL database (free tier)
4. Copy connection string to DATABASE_URL
```

**C) Free MongoDB via MongoDB Atlas**
```bash
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with GitHub
3. Create free cluster
4. Get connection string → save to DATABASE_URL
```

#### Step 2: Push to GitHub
```powershell
# If not already done
git add .
git commit -m "Production deployment with persistent database"
git push origin main
```

#### Step 3: Deploy to Vercel
```bash
1. Go to https://vercel.com/
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Add Environment Variables:
   - DATABASE_URL = [your database URL from step 1]
   - AUTH_SECRET = [generate random 32+ char string]
   - NODE_ENV = production
5. Click "Deploy"
```

**Your site will be live at: `https://your-repo.vercel.app`**

✅ Auto-deploys on every git push
✅ Free HTTPS & CDN
✅ Persistent database across restarts

---

### Option 2: Azure App Service + Azure Database for PostgreSQL

**Good for enterprise/Microsoft ecosystem**

#### Step 1: Create Azure Resources
```powershell
# Install Azure CLI if not done
Install-Module Az -Scope CurrentUser

# Login
az login

# Create resource group
az group create --name medical-billing-rg --location eastus

# Create PostgreSQL
az postgres server create `
  --resource-group medical-billing-rg `
  --name medical-billing-db `
  --location eastus `
  --admin-user dbadmin `
  --admin-password YourSecurePassword123! `
  --sku-name B_Gen5_1 `
  --storage-size 51200

# Create App Service Plan
az appservice plan create `
  --name medical-billing-plan `
  --resource-group medical-billing-rg `
  --sku B1 `
  --is-linux

# Create Web App
az webapp create `
  --resource-group medical-billing-rg `
  --plan medical-billing-plan `
  --name medical-billing-app-xyz `
  --runtime "NODE|20-lts"
```

#### Step 2: Configure Environment Variables
```powershell
az webapp config appsettings set `
  --resource-group medical-billing-rg `
  --name medical-billing-app-xyz `
  --settings `
    NODE_ENV="production" `
    DATABASE_URL="postgresql://user:pass@host:5432/db" `
    AUTH_SECRET="your-secret-key"
```

#### Step 3: Deploy Code
```powershell
# Option A: Deploy from Git
git remote add azure "https://your-app.scm.azurewebsites.net:443/your-app.git"
git push azure main

# Option B: Deploy from zip
npm run build
Compress-Archive -Path . -DestinationPath app.zip
az webapp deployment source config-zip `
  --resource-group medical-billing-rg `
  --name medical-billing-app-xyz `
  --src-path .\app.zip
```

---

### Option 3: Docker + Any Cloud (AWS, Google Cloud, DigitalOcean)

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

Then push to any container registry and deploy.

---

## Pre-Deployment Checklist

- [ ] **Create `.env.local` file** (copy from `.env.example`)
- [ ] **Set DATABASE_URL** to your persistent database
- [ ] **Generate AUTH_SECRET**: `openssl rand -hex 32`
- [ ] **Test locally**: `npm run dev`
- [ ] **Build test**: `npm run build` (should succeed)
- [ ] **Check `.gitignore`** includes `.env.local` and `billing.db`
- [ ] **Remove `open-chrome.js` from start script** (already done ✓)

---

## After Deployment: Post-Launch

✅ **Verify your site works:**
- Log in with test credentials
- Create a test bill
- Verify data persists after page refresh
- Download PDF
- Edit and delete bills

⚠️ **Monitor for errors:**
- Check deployment logs
- Set up error monitoring (Sentry, DataDog)
- Monitor database usage

---

## Troubleshooting

### "Data disappears after restart"
❌ Wrong: Using default in-memory database
✅ Solution: Set `DATABASE_URL` environment variable

### "Build fails"
❌ Check build logs for errors
✅ Run `npm run build` locally first

### "Can't connect to database"
❌ DATABASE_URL format wrong
✅ Verify connection string format for your DB type

### "401 Unauthorized when accessing /api/bills"
❌ Auth middleware issue
✅ Check localStorage.authToken is being set on login

---

## Production Security Best Practices

1. **Never commit `.env` or secrets**
   ```bash
   # .gitignore already has this
   .env.local
   billing.db
   ```

2. **Use environment variables for all secrets**
   - AUTH_SECRET
   - DATABASE_URL
   - API keys

3. **Enable HTTPS** (automatic on Vercel/Azure)

4. **Set strong AUTH_SECRET**
   ```powershell
   # Generate: 
   openssl rand -hex 32
   ```

5. **Regular backups**
   - PostgreSQL: Automated backups via cloud provider
   - MongoDB: Atlas automatic backups

---

## Monitoring & Maintenance

### View Logs
**Vercel**: Dashboard → Deployments → Logs
**Azure**: App Service → Log Stream

### Database Backups
- PostgreSQL: Weekly automated backups
- MongoDB_Atlas: Daily snapshots
- Scale storage as needed

### Performance
- Monitor response times
- Check error rates
- Set up alerts for failures

---

## Support

- Vercel Docs: https://vercel.com/docs
- Azure App Service: https://docs.microsoft.com/azure/app-service/
- PostgreSQL Guide: https://www.postgresql.org/docs/
- MongoDB Atlas: https://docs.atlas.mongodb.com/

**Need help? Check deployment logs first!**
