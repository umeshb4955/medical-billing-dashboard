
# Medical Billing Dashboard (Next.js)

A professional, full-featured medical billing system built with Next.js, React, and Material-UI.

## ✨ Features

- 📄 Manage medical bills and patient records
- 💰 Calculate totals automatically
- 📊 View statistics and analytics
- 🖨️ Print & generate PDF invoices
- ✏️ Edit and manage bills
- 🔐 Secure login authentication
- 📱 Responsive design (mobile-friendly)
- 🌙 Dark mode UI

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Run development server (opens Chrome automatically)
npm run dev

# Or run without opening browser
npm run dev:no-browser

# Access at http://localhost:3000
```

### Local Testing
```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📦 Deployment (Production)

### ⭐ **IMPORTANT:** Database Persistence

By default, data is stored locally. **For production**, you must:
1. Set up a persistent database (MongoDB, PostgreSQL, etc.)
2. Configure environment variables
3. Deploy to Vercel, Azure, or similar platform

### Quick Deployment (5 minutes)

**See [QUICK_DEPLOY.md](QUICK_DEPLOY.md)** for step-by-step guide to deploy on Vercel with MongoDB.

### Detailed Guides

- **[DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)** - Overview & checklist
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - 5-minute deployment (Vercel + MongoDB)
- **[PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)** - Detailed options (Vercel/Azure/Cloud)
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Database configuration guide

### One-Line Deploy to Vercel

```bash
npm i -g vercel && vercel --prod
```

---

## 📋 Project Structure

```
app/
├── page.jsx                  # Main dashboard
├── login/page.jsx            # Login page
├── api/                      # API routes
│   ├── auth/login/route.js  # Authentication
│   └── bills/               # Bill management endpoints
└── components/              # React components

lib/
├── db.js                    # Database initialization
├── dbAdapter.js             # Database adapter (SQLite/Mock)
└── pdfGenerator.js          # PDF generation

middleware.js               # Auth middleware
next.config.js             # Next.js configuration
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
# Local development (SQLite)
NODE_ENV=development
DATABASE_URL=./billing.db

# Production (use cloud database)
# DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/database
# AUTH_SECRET=your-secret-key-here
# NODE_ENV=production
```

See [.env.example](.env.example) for all options.

---

## 🔐 Authentication

Default login credentials (change in production):
- **Username:** admin
- **Password:** admin

Configure in: `app/api/auth/login/route.js`

---

## 📄 Pages

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/` | View all bills, stats, actions |
| Login | `/login` | User authentication |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14.2
- **UI Library:** Material-UI (MUI)
- **Database:** SQLite (local) / PostgreSQL / MongoDB (production)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **PDF:** jsPDF + html2pdf

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bills` | Get all bills |
| POST | `/api/bills` | Create new bill |
| PUT | `/api/bills/[id]` | Update bill |
| DELETE | `/api/bills/[id]` | Delete bill |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

```bash
# 1. Run deployment check (Windows)
.\check-deployment.bat

# Or (Mac/Linux)
bash check-deployment.sh

# 2. Build test
npm run build

# 3. Verify all features locally
npm start
# Test: Login → Create bill → Edit → Delete → PDF → Logout

# 4. Verify git is clean
git status

# 5. Ready to deploy!
git push origin main
```

---

## 🚨 Known Limitations

### Local Development Only
- ❌ SQLite won't work on Vercel/Azure/serverless
- ❌ Data persists only on your machine
- ✅ Fine for development & testing

### Production Requirements
- ✅ Must use cloud database (MongoDB Atlas, PostgreSQL, etc.)
- ✅ Set NODE_ENV=production
- ✅ Configure AUTH_SECRET
- ✅ Use HTTPS (automatic on Vercel)

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for how to fix.

---

## 📈 Scaling for Production

To handle more users:

1. **Upgrade Database**
   - MongoDB Atlas: upgrade cluster tier
   - PostgreSQL: increase instance size
   
2. **Enable Caching**
   - Add Redis for frequent queries
   - Cache static assets (automatic on Vercel)

3. **Monitor Performance**
   - Set up Sentry for error tracking
   - Monitor database queries
   - Check API response times

4. **Optimize UI**
   - Lazy load DataGrid rows
   - Optimize PDF generation
   - Compress images

---

## 🐛 Troubleshooting

### "npm run dev won't open Chrome"
- Use: `npm run dev:no-browser`
- Open Chrome manually to `http://localhost:3000`

### "Data not persisting on Vercel"
- See [DATABASE_SETUP.md](DATABASE_SETUP.md)
- Set DATABASE_URL environment variable
- Use cloud database, not SQLite

### "Build fails"
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### "Login not working"
- Check middleware.js is not blocking routes
- Clear browser localStorage
- Verify auth route is correct

---

## 📞 Support & Documentation

- **Next.js Docs:** https://nextjs.org/docs
- **MUI Docs:** https://mui.com/
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **PostgreSQL:** https://www.postgresql.org/docs/

---

## 📜 License

This project is provided as-is for medical billing purposes.

---

## 🎉 Ready to Deploy?

Follow **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** to get your app live in 5 minutes!

---

**Last Updated:** March 2026
**Version:** 1.0.0
