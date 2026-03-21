# Deploy to Vercel - Quick Guide

## Why Vercel?
✅ Built specifically for Next.js  
✅ FREE tier includes 100 GB bandwidth/month  
✅ Automatic deployments on git push  
✅ Built-in analytics and monitoring  
✅ Automatic HTTPS and CDN  
✅ Serverless functions for your API routes  
✅ One-click deployment  

---

## Method 1: Deploy via GitHub (Recommended - Auto Deploy) ⭐

### Step 1: Push Code to GitHub
```powershell
# Initialize git if not already done
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main

# Add your GitHub repo (replace USERNAME/REPO)
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Click "New Project"
5. Select your `medical-billing-dashboard` repository
6. Vercel will auto-detect Next.js settings
7. Click "Deploy"

**That's it! Your app is live in seconds.** 🎉

Your URL will be: `https://medical-billing-dashboard.vercel.app`

---

## Method 2: Deploy via CLI (Direct Upload) ⚡

### Step 1: Install Vercel CLI
```powershell
npm i -g vercel
```

### Step 2: Deploy
```powershell
cd "e:\React Apps\medical-billing-dashboard"
vercel
```

Follow the prompts:
- Project name: `medical-billing-dashboard`
- Set as production: `Y`
- Your app is live!

---

## Method 3: Deploy via Vercel Dashboard (No Code Needed)

1. Go to https://vercel.com/new
2. Choose "Import Git Repository"
3. Paste your GitHub URL (or use GitHub login)
4. Link it
5. Click "Deploy"

---

## Configuration After Deployment

### Add Environment Variables
1. Go to your project dashboard: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add these:
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_API_URL` = Your Vercel URL (e.g., `https://medical-billing-dashboard.vercel.app`)

### Custom Domain (Optional)
1. Settings → Domains
2. Add your custom domain
3. Update DNS settings at your domain provider
4. Vercel provides auto-generated SSL certificates

---

## Database Configuration

### Current Setup: SQLite
⚠️ **Issue**: SQLite database resets on each deployment
✅ **Solution**: 
- Use Vercel Postgres (easy integration)
- Or Neon Postgres (free tier available)
- Or MongoDB Atlas

### Recommended: Vercel Postgres
1. In Vercel dashboard → Storage → Create Database
2. Select "Postgres" → Create
3. Copy connection string
4. Add to Environment Variables: `DATABASE_URL`
5. Update your database connection in `lib/db.js`

---

## Monitoring & Logs

### View Deployments
- Dashboard → Deployments tab
- Click any deployment to see logs
- Real-time logs as you deploy

### Analytics
- Your project → Analytics
- See traffic, performance, and errors

### Error Tracking
- Settings → Error Tracking
- Automatic error monitoring

---

## Auto-Deploy on Git Push

After connecting GitHub, every push to `main` branch auto-deploys:

```powershell
# Just push your code!
git add .
git commit -m "Feature: Add new functionality"
git push origin main

# Your app updates automatically! 🚀
```

---

## Rollback & History

- Dashboard → Deployments
- Click any previous deployment
- Click "Promote to Production" to rollback

---

## Production Checklist

- [ ] Database configured (switch from SQLite)
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error tracking enabled
- [ ] HTTPS enabled (automatic)
- [ ] CDN enabled (automatic)

---

## Pricing

| Feature | Hobby (Free) | Pro |
|---------|------|-----|
| Deployments | Unlimited | Unlimited |
| Bandwidth | 100 GB/mo | $0.50/GB |
| Database | Not included | Included |
| Support | Community | Priority |
| Cost | **FREE** | $20/mo |

**Recommended**: Start with FREE tier, upgrade to Pro if needed.

---

## Troubleshooting

### "Build failed"
- Check build logs: Dashboard → Deployments → Failed deployment
- Common issue: Missing environment variables
- Solution: Add all required vars to Environment Variables

### "Database connection error"
- Ensure DATABASE_URL is set
- Check database credentials
- For SQLite: Not recommended on Vercel (use Postgres)

### "502 Bad Gateway"
- Check application logs
- Ensure API routes are working locally first
- Deploy again (often temporary)

---

## Next Steps

1. Choose deployment method above (GitHub recommended)
2. Follow the steps
3. Your app will be **LIVE AND PUBLIC** within minutes!
4. Share URL: `https://[your-project].vercel.app`

**Questions?** Visit https://vercel.com/docs/frameworks/nextjs
