# QUICK DEPLOYMENT STEPS - Medical Billing Dashboard

## 🚀 Deploy in 5 Minutes to Vercel (Recommended)

### Step 1: Set Up Database (2 min)

**MongoDB Atlas (Recommended - Free forever)**

```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up → Create FREE cluster
3. Create database user:
   - Username: billingadmin  
   - Password: [Generate strong password]
4. Network Access → Allow access from anywhere (0.0.0.0/0)
5. Click "Connect" → "Drivers"
6. Copy MongoDB URI string
7. Replace <username> and <password>
8. Copy final string (will look like):
   mongodb+srv://billingadmin:password@cluster.mongodb.net/medical_billing
```

### Step 2: Configure Environment (1 min)

Create `.env.local` file in root:

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://billingadmin:YOUR_PASSWORD@cluster.mongodb.net/medical_billing
AUTH_SECRET=your-random-secret-here
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

Generate AUTH_SECRET (PowerShell):
```powershell
$RandomBytes = [byte[]]::new(32)
[System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($RandomBytes)
-join ($RandomBytes | ForEach-Object { '{0:x2}' -f $_ })
```

### Step 3: Test Locally (1 min)

```bash
npm run build       # Test build works
npm start           # Start production server
```

Visit: http://localhost:3000

✅ Verify:
- Login works
- Can create bills
- Data persists on refresh

### Step 4: Deploy to GitHub (0.5 min)

```bash
git add .
git commit -m "Production deployment"
git push origin main
```

### Step 5: Deploy to Vercel (1 min)

**Option A: Automatic (Recommended)**
1. Go to: https://vercel.com/new
2. Import your GitHub repo
3. Click "Continue"
4. Add Environment Variables:
   - `DATABASE_URL` = [MongoDB URI from Step 1]
   - `AUTH_SECRET` = [Generated secret from Step 2]
   - `NODE_ENV` = production
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env add DATABASE_URL
# Paste your MongoDB URI
vercel env add AUTH_SECRET
# Paste your secret
vercel deploy --prod
```

---

## ✅ Verification Checklist

After deployment:

- [ ] Site loads at: `https://your-app.vercel.app`
- [ ] Login page works
- [ ] Can create a test bill
- [ ] Data persists after page refresh
- [ ] Can edit bills
- [ ] Can delete bills
- [ ] PDF download works
- [ ] No error messages in console

---

## 🔗 Your Live Site

Once deployed, share your URL:
```
https://your-app.vercel.app
```

Login credentials (change these later):
- Default username: admin (if you set it up in seed.js)
- Update in app/api/auth/login/route.js

---

## Troubleshooting

### "Deployment failed"
- Check build logs: Vercel Dashboard → Deployments → Latest → View Log
- Run locally: `npm run build`
- Fix errors shown, commit, and push

### "Cannot connect to database"
- Verify DATABASE_URL environment variable is set
- Check MongoDB cluster is running
- Verify IP whitelist includes 0.0.0.0/0

### "Data doesn't persist"
- Ensure DATABASE_URL is set (not using SQLite)
- Check database is online and accessible
- Verify connection string format is correct

### "Login not working"
- Check middleware.js is not blocking auth
- Verify AUTH_SECRET environment variable is set
- Check browser localStorage

---

## Production Security Checklist

- [ ] Change default login credentials
- [ ] Set strong AUTH_SECRET (32+ chars)
- [ ] Use HTTPS (automatic on Vercel)
- [ ] Enable database encryption
- [ ] Set up error monitoring (optional)
- [ ] Review and restrict database access

---

## Next Steps

1. **Monitor**: Set up error alerts (Sentry, DataDog)
2. **Backup**: Enable automatic database backups  
3. **Scale**: Upgrade as you add users
4. **Security**: Change default auth credentials
5. **Domain**: Add custom domain in Vercel settings

---

**Questions?** Check PRODUCTION_DEPLOYMENT.md for detailed guides!
