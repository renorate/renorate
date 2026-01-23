# Quick Start: Deploy to renorate.net

## 🚀 Fastest Path to Production

### 1. Push Code to GitHub
```bash
cd /Users/admin/renorate
git init
git add .
git commit -m "Initial commit"
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/renorate.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your `renorate` repository
5. Click "Deploy" (Vercel auto-detects Next.js)

### 3. Add PostgreSQL Database
1. In Vercel dashboard → Your project → Storage
2. Click "Create Database" → Select "Postgres"
3. Copy the `DATABASE_URL` connection string

### 4. Update Environment Variables
In Vercel Project Settings → Environment Variables:
- Add `DATABASE_URL` with your PostgreSQL connection string

### 5. Update Prisma Schema for Production
Change `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then commit and push:
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

Vercel will automatically redeploy.

### 6. Run Database Migrations
In Vercel dashboard → Your project → Settings → Environment Variables:
- Copy your `DATABASE_URL`
- Run locally (or use Vercel CLI):
```bash
export DATABASE_URL="your-postgres-url"
npx prisma migrate deploy
```

### 7. Add Your Domain
1. Vercel dashboard → Your project → Settings → Domains
2. Add `renorate.net`
3. Add `www.renorate.net`
4. Follow DNS instructions Vercel provides

### 8. Update DNS at Your Registrar
Add the DNS records Vercel provides (usually CNAME to `cname.vercel-dns.com`)

### 9. Wait & Verify
- DNS propagation: 24-48 hours
- SSL certificate: Automatic (Vercel handles this)
- Visit: https://renorate.net

## ✅ Done!

Your site will be live at renorate.net once DNS propagates!
