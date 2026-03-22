# Deploy Medical Billing Dashboard to Render.com

## ✅ Why Render?

- ✅ Free tier available ($0/month)
- ✅ Auto-deploys from GitHub
- ✅ Supports Node.js/Next.js
- ✅ Easy database setup
- ✅ No credit card required
- ✅ Good performance

---

## 🚀 Step-by-Step Deployment (15 minutes)

### Step 1: Set Up Database (5 minutes)

Choose ONE database option:

#### **Option A: MongoDB Atlas (Recommended)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up with GitHub
3. Create FREE cluster:
   - Cluster name: `medical-billing`
   - Tier: M0 Sandbox (Free)
   - Region: Closest to you (e.g., US-East)
4. Create database user:
   - Username: `billingadmin`
   - Password: [generate strong password]
5. Network Access → "Add IP Address" → "Allow from anywhere" (0.0.0.0/0)
6. Click "Connect" → "Drivers" → "Node.js"
7. Copy the connection string
8. Replace `<username>` with: billingadmin
9. Replace `<password>` with: your password
10. Replace `myFirstDatabase` with: medical_billing
11. **Save this URL** (you'll need it in Step 3)

**Your DATABASE_URL should look like:**
```
mongodb+srv://billingadmin:your-password@cluster0.xxxxx.mongodb.net/medical_billing?retryWrites=true&w=majority
```

---

#### **Option B: PostgreSQL via Render (Built-in)**

When creating service (Step 3), Render allows creating PostgreSQL directly.

---

### Step 2: Verify GitHub is Up to Date

Make sure your latest code is on GitHub:

```bash
cd "e:\React Apps\medical-billing-dashboard"
git status
git push origin main
```

Should show:
```
Your branch is up to date with 'origin/main'.
```

---

### Step 3: Deploy to Render (5 minutes)

#### **Step 3A: Create Render Account**

1. Go to: https://render.com
2. Click "Get Started"
3. Sign up with GitHub account
4. **Authorize Render** to access your GitHub repos
5. After login, you'll see Render dashboard

---

#### **Step 3B: Create Web Service**

1. Click **"+ New"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub repo:
   - Look for your repo under "umeshb4955"
   - If not visible, click "Connect account" → "Install GitHub App"
   - Select `umeshb4955/medical-billing-dashboard`
   - Click "Connect"

---

#### **Step 3C: Configure Service**

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | medical-billing-dashboard |
| **Environment** | Node |
| **Region** | US East (or closest to you) |
| **Branch** | main |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

---

#### **Step 3D: Add Environment Variables**

1. Scroll down to **"Environment"** section
2. Click **"Add Environment Variable"**
3. Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | Will update after deployment |
| `DATABASE_URL` | [Your MongoDB URI from Step 1] |
| `AUTH_SECRET` | [Generate secure random] |

**Generate AUTH_SECRET (PowerShell):**
```powershell
$RandomBytes = [byte[]]::new(32)
[System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($RandomBytes)
-join ($RandomBytes | ForEach-Object { '{0:x2}' -f $_ })
```

---

#### **Step 3E: Deploy**

1. At bottom, click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. See deployed URL at top: `https://your-app-name.onrender.com`

---

### Step 4: Update Environment Variable

After deployment completes:

1. Your live URL will be: `https://your-app-name.onrender.com`
2. Go to service settings
3. Update `NEXT_PUBLIC_API_URL` to: `https://your-app-name.onrender.com`
4. Save and redeploy (click "Manual Deploy" → "Deploy")

---

### Step 5: Test Your App (2 minutes)

1. Go to: `https://your-app-name.onrender.com`
2. Wait for app to load (may take 30-60 seconds on first visit)
3. Test features:

✅ **Verification Checklist:**
- [ ] Page loads without errors
- [ ] Can see login page
- [ ] Login works (use default credentials)
- [ ] Can create a test bill
- [ ] Bill appears in table
- [ ] Refresh page → data still there ✅ (database works!)
- [ ] Can edit bill
- [ ] Can delete bill
- [ ] Can download PDF
- [ ] No errors in browser console (F12)

---

## 🔧 Configuration Summary

### Required Files (Already Set Up)
- ✅ `lib/dbAdapter.js` - Detects Render environment
- ✅ `next.config.js` - Next.js configuration
- ✅ `package.json` - Build scripts
- ✅ `middleware.js` - Authentication

### Environment Variables on Render
```
NODE_ENV=production
DATABASE_URL=mongodb+srv://billingadmin:password@cluster...
AUTH_SECRET=random-secure-string-here
NEXT_PUBLIC_API_URL=https://your-app.onrender.com
```

---

## 🚀 After Deployment

### View Logs
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Look for deployment status and errors

### Redeploy Manually
1. Click "Manual Deploy" → "Clear build cache & deploy"
2. Useful if you made changes on GitHub

### Custom Domain (Optional)
1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Follow DNS setup instructions

---

## ❌ Troubleshooting

### **App loads but shows error**

**Problem:** `DATABASE_URL not set`

**Solution:**
1. Go to service settings
2. Check "Environment" section
3. Verify `DATABASE_URL` is set
4. Make sure it has correct MongoDB connection string
5. Click "Manual Deploy" → "Clear build cache & deploy"

---

### **Build fails**

**Check build logs:**
1. Render Dashboard → Select service
2. Click "Deploy" tab
3. See error message
4. Common issues:
   - Missing dependencies: `npm install`
   - Wrong Node version: Check package.json

**Fix locally:**
```bash
npm install
npm run build
npm start
```

If it works locally, commit and push:
```bash
git push origin main
```

Render auto-redeploys.

---

### **Data doesn't persist**

**Problem:** Each refresh loses data

**Solution:** Ensure DATABASE_URL is set
1. Go to service settings
2. Check "Environment" variables
3. Confirm `DATABASE_URL` is your MongoDB connection
4. Must include username, password, and host

---

### **Site takes 30-60 seconds to load first time**

**Normal behavior on Render free tier** - called "cold start"

Solution: Upgrade to paid tier ($7+/month) for instant access, or just wait.

---

### **Login not working**

**Check:**
1. `AUTH_SECRET` is set (at least 32 characters)
2. Run: `git status` locally
3. Ensure middleware.js hasn't been corrupted
4. Clear browser localStorage (F12 → Storage → Clear)

---

### **"Permission Denied" or GitHub won't connect**

**Solution:**
1. Go to Render account settings
2. Click "GitHub" section
3. Click "Manage" under connected account
4. Grant necessary permissions
5. Return to creating service

---

## 📊 What You Get (Free Tier)

| Feature | Limit |
|---------|-------|
| Compute | Shared vCPU, 512MB RAM |
| Storage | None (ephemeral) |
| Bandwidth | Unlimited |
| Builds | 750 build minutes/month |
| Deploys | Auto on git push |
| Downtime | Sleeps after 15 min inactivity |
| Cost | FREE |

**Note:** App sleeps after 15 minutes of no traffic. First request wakes it (takes 30-60 sec).

To keep always running: Upgrade to paid plan (~$7/month).

---

## 🔐 Security Notes

- ❌ Never commit DATABASE_URL to GitHub
- ✅ Only set in Render environment variables
- ✅ Use secure AUTH_SECRET (32+ characters)
- ✅ HTTPS automatic on Render
- ✅ Change default login credentials (optional)

---

## 📈 Scaling Up

As your app grows:

1. **Upgrade Render Plan** ($7-25/month)
   - More CPU, RAM
   - No "sleep" timeout
   - Better performance

2. **Add MongoDB Storage**
   - MongoDB Atlas free tier included
   - Can upgrade if needed

3. **Monitor Performance**
   - Render shows metrics
   - Watch CPU, memory usage

---

## 🎯 Live Features

Once deployed, your app has:
- ✅ Public URL (anyone can access)
- ✅ Database persistence (data stays)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ✅ PDF generation
- ✅ Authentication
- ✅ Real-time updates

---

## 📋 Render vs Other Platforms

| Feature | Render | Vercel | Railway |
|---------|--------|--------|---------|
| Free tier | ✅ Yes | ✅ Yes | ✅ Yes |
| Auto-deploy | ✅ Yes | ✅ Yes | ✅ Yes |
| Always on | ❌ Sleeps | ✅ Yes | ✅ Yes |
| Setup time | 10 min | 10 min | 10 min |

**Best overall:** Vercel (if you have GitHub token)
**No credit card:** Render (completely free)
**Best value:** Railway (if you'll use credits)

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas database created
- [ ] Render account created
- [ ] Web service created and deployed
- [ ] Environment variables set
- [ ] App loads at https://your-app.onrender.com
- [ ] Can login and create bills
- [ ] Data persists on refresh

---

## 🎉 Success!

Your app is now live and publicly accessible!

**Share URL:** https://your-app.onrender.com

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **MongoDB Docs:** https://docs.mongodb.com/

---

**Estimated Time:** 15-20 minutes total
