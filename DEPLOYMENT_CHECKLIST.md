# 🚀 RenoRate Deployment Checklist

## Pre-Deployment Steps

### ✅ 1. Code Preparation
- [x] All features implemented
- [x] Build command configured (`prisma generate && next build`)
- [x] Vercel configuration file exists (`vercel.json`)

### ✅ 2. Database Setup (PostgreSQL)
You need a PostgreSQL database for production. Choose one:

**Option A: Vercel Postgres** (Recommended - easiest)
- Go to Vercel Dashboard → Your Project → Storage → Create Database
- Choose "Postgres"
- Copy the connection string

**Option B: Supabase** (Free tier available)
- Sign up at https://supabase.com
- Create a new project
- Go to Settings → Database → Connection String
- Copy the connection string

**Option C: Railway** (Easy setup)
- Sign up at https://railway.app
- Create a new PostgreSQL database
- Copy the connection string

**Option D: Neon** (Serverless PostgreSQL)
- Sign up at https://neon.tech
- Create a new project
- Copy the connection string

### ✅ 3. Update Prisma Schema for Production
The schema has been updated to support PostgreSQL. Make sure `prisma/schema.prisma` has:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### ✅ 4. Git Repository Setup
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for production deployment"

# Create GitHub repository, then:
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## Deployment Steps

### Step 1: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in (or create account)

2. **Click "Add New Project"**

3. **Import your GitHub repository**
   - Connect your GitHub account if needed
   - Select your `renorate` repository
   - Click "Import"

4. **Configure Project Settings:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `prisma generate && next build` (already in vercel.json)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `DATABASE_URL` = Your PostgreSQL connection string
   - Example: `postgresql://user:password@host:5432/database?schema=public`

6. **Click "Deploy"**

### Step 2: Run Database Migrations

After first deployment, you need to run migrations:

**Option A: Using Vercel CLI** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations (this will use your production DATABASE_URL)
npx prisma migrate deploy
```

**Option B: Using Prisma Studio (Local)**
```bash
# Set your production DATABASE_URL locally
export DATABASE_URL="your-production-connection-string"

# Run migrations
npx prisma migrate deploy
```

**Option C: Using Vercel Postgres Dashboard**
- If using Vercel Postgres, you can run SQL directly in the dashboard

### Step 3: Verify Deployment

1. Check your deployment URL (e.g., `renorate.vercel.app`)
2. Test the site:
   - Landing page loads
   - Can register/login
   - Can create estimates
   - Database operations work

### Step 4: Set Up Custom Domain (renorate.net)

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter `renorate.net` and `www.renorate.net`

2. **Configure DNS:**
   - Vercel will provide DNS records
   - Add them to your domain registrar:
     - **A Record**: Point to Vercel's IP (if provided)
     - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
   - Or use Vercel's nameservers (easiest)

3. **Wait for SSL:**
   - Vercel automatically provisions SSL certificates
   - Usually takes 1-24 hours for DNS propagation

---

## Post-Deployment

### ✅ Monitor Your Site

1. **Check Vercel Analytics:**
   - View deployment logs
   - Monitor errors
   - Check performance

2. **Test Key Features:**
   - [ ] User registration
   - [ ] User login
   - [ ] Estimate creation
   - [ ] PDF export
   - [ ] Project management
   - [ ] Messaging system

3. **Set Up Monitoring:**
   - Consider adding error tracking (Sentry, LogRocket)
   - Set up uptime monitoring (UptimeRobot, Pingdom)

### ✅ Environment Variables Checklist

Make sure these are set in Vercel:
- [x] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NODE_ENV` - Set to `production` (auto-set by Vercel)
- [ ] Any other API keys or secrets your app needs

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure `prisma generate` runs before `next build`
- Verify all dependencies are in `package.json`

### Database Connection Errors
- Verify `DATABASE_URL` is correct in Vercel
- Check database allows connections from Vercel IPs
- Ensure database is running and accessible

### Migration Errors
- Run `npx prisma migrate deploy` manually
- Check migration files are committed to git
- Verify database schema matches migrations

### Domain Not Working
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Verify SSL certificate is issued (check in Vercel dashboard)

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build locally (test before deploying)
npm run build

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (to view database)
npx prisma studio

# Vercel CLI commands
vercel login
vercel link
vercel deploy
vercel env pull  # Pull environment variables locally
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check database connection
3. Verify all environment variables are set
4. Review this checklist

Good luck with your launch! 🚀
