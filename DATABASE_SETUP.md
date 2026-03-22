# Database Setup Guide for Vercel Deployment

## Quick Setup (Choose One)

### Option 1: MongoDB Atlas (Cloud Database - RECOMMENDED)

**Fastest setup, Free tier available**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (optional: connect GitHub account)
3. Create a free cluster:
   - Selected region: Closest to you (e.g., US-East for US)
   - Cluster tier: **M0 Sandbox (Free)**
4. Create database user:
   - **Username**: billingadmin
   - **Password**: Generate secure password
5. Whitelist IP:
   - Click "Network Access" → "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" → "Drivers"
   - Copy MongoDB connection string
   - Replace `<username>` and `<password>` with your credentials
   - Replace `myFirstDatabase` with `medical_billing`
7. Use this as your DATABASE_URL

**Connection String Format:**
```
mongodb+srv://billingadmin:your-password@cluster0.xxxxx.mongodb.net/medical_billing?retryWrites=true&w=majority
```

---

### Option 2: PostgreSQL via Railway.app

**Simple, generous free tier**

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Select "PostgreSQL"
4. Railway creates database automatically
5. Go to "Connect" tab → "Postgres" connection
6. Copy the connection string
7. Use as DATABASE_URL

**Connection String Format:**
```
postgresql://postgres:password@host:port/railway
```

---

### Option 3: PostgreSQL via Render.com

**Easy setup, good uptime**

1. Go to https://render.com/
2. Create account
3. Dashboard → "New" → "PostgreSQL"
4. Fill in:
   - **Name**: medical-billing-db
   - **Database**: medical_billing
5. Get External Database URL from Info tab
6. Use as DATABASE_URL

---

### Option 4: Firebase/Firestore (Google-hosted)

**Free forever for small usage**

1. Go to https://console.firebase.google.com/
2. Create new project → Firestore Database
3. Get credentials and connection details
4. Set DATABASE_URL to Firebase connection string

---

## Vercel Environment Variables Setup

After choosing a database:

### Method 1: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add three variables:

| Name | Value | Example |
|------|-------|---------|
| `DATABASE_URL` | Your database connection string | `mongodb+srv://user:pass@cluster.mongodb.net/medical_billing` |
| `NODE_ENV` | production | production |
| `AUTH_SECRET` | Random 32+ character string | Generate with: `openssl rand -hex 32` |

5. Redeploy: Click "Deployments" → Three dots → "Redeploy"

### Method 2: Via Vercel CLI

```bash
vercel env add DATABASE_URL
# Paste your database URL when prompted

vercel env add AUTH_SECRET
# Paste a random secret when prompted

vercel env add NODE_ENV
# Type: production
```

---

## Generate AUTH_SECRET

Run this command on your PC:

**Windows (PowerShell):**
```powershell
$RandomBytes = [byte[]]::new(32)
[System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($RandomBytes)
$Secret = -join ($RandomBytes | ForEach-Object { '{0:x2}' -f $_ })
Write-Host "AUTH_SECRET=$Secret"
```

**Windows (Command Prompt):**
```cmd
# Use any online generator like:
# https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html
```

**Mac/Linux:**
```bash
openssl rand -hex 32
```

---

## Test Database Connection

After setting environment variables:

1. Go to Vercel Dashboard
2. Project → Deployments → Latest → View Logs
3. Look for: `✓ Database connected successfully`

If you see errors:
- Check DATABASE_URL format is correct
- Verify database user credentials
- Check IP whitelist rules
- Ensure database is running

---

## Local Development Setup

Create `.env.local` file in root:

```
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=mongodb+srv://billingadmin:your-password@cluster.mongodb.net/medical_billing
AUTH_SECRET=your-secret-key-here
```

Then test locally:
```bash
npm run build
npm start
```

---

## Troubleshooting

### "Cannot connect to database"
- ❌ Check DATABASE_URL environment variable is set
- ❌ Verify IP whitelist (especially for PostgreSQL)
- ✅ Test connection string locally first

### "Data still not persisting"
- ❌ Ensure you're using cloud database, not SQLite
- ❌ Check node_modules has latest package versions
- ✅ Run: `npm install --save-exact`

### "Build fails on Vercel"
- ❌ Check build logs: Deployments → Latest → View log
- ✅ Run locally: `npm run build`
- ✅ Push fix and redeploy

---

## Next Steps

1. ✅ Choose a database option above
2. ✅ Get your DATABASE_URL connection string
3. ✅ Set environment variables in Vercel
4. ✅ Redeploy your project
5. ✅ Test that data persists

Your app is now production-ready! 🚀
