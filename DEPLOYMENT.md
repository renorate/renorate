# Deployment Guide for renorate.net

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Domain: renorate.net (already owned)

### Step 1: Prepare Your Code

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for deployment"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `prisma generate && next build` (already in vercel.json)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Step 3: Set Environment Variables

In Vercel Project Settings → Environment Variables, add:

**For Development:**
- `DATABASE_URL`: `file:./prisma/dev.db` (for local testing)

**For Production:**
- `DATABASE_URL`: Your PostgreSQL connection string
  - Get one from: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech)
  - Format: `postgresql://user:password@host:5432/database?schema=public`

### Step 4: Switch to PostgreSQL for Production

**Important**: SQLite doesn't work on Vercel. You need PostgreSQL.

1. **Get a PostgreSQL database**:
   - Recommended: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (easiest)
   - Or: Supabase, Railway, Neon

2. **Update Prisma schema for production**:
   - In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Run migrations on production database**:
   ```bash
   # Set your production DATABASE_URL
   export DATABASE_URL="postgresql://..."
   npx prisma migrate deploy
   ```

### Step 5: Configure Domain (renorate.net)

1. In Vercel Project Settings → **Domains**
2. Click **"Add Domain"**
3. Enter: `renorate.net`
4. Also add: `www.renorate.net`
5. Vercel will show DNS configuration instructions

### Step 6: Update DNS Records

At your domain registrar (where you bought renorate.net):

**Option A - CNAME (Recommended):**
- Add CNAME record:
  - Name: `@` (or leave blank)
  - Value: `cname.vercel-dns.com`
- Add CNAME for www:
  - Name: `www`
  - Value: `cname.vercel-dns.com`

**Option B - A Records:**
- Vercel will provide IP addresses
- Add A records pointing to those IPs

### Step 7: Wait for DNS Propagation

- DNS changes take 24-48 hours to propagate globally
- Vercel will automatically provision SSL certificates
- You'll get an email when the domain is verified

### Step 8: Verify Deployment

Once DNS propagates:
- Visit: https://renorate.net
- Visit: https://www.renorate.net
- Both should show your RenoRate site

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables set in Vercel
- [ ] Domain configured and verified
- [ ] SSL certificate active (automatic)
- [ ] Test login/registration
- [ ] Test project creation
- [ ] Test messaging system

## Troubleshooting

**Database Errors:**
- Make sure you're using PostgreSQL, not SQLite
- Verify DATABASE_URL is set correctly
- Run migrations: `npx prisma migrate deploy`

**Domain Not Working:**
- Check DNS records are correct
- Wait 24-48 hours for propagation
- Verify domain in Vercel dashboard

**Build Errors:**
- Check that `prisma generate` runs before build
- Verify all dependencies are in package.json
- Check Vercel build logs for specific errors

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment
- Domain Setup: https://vercel.com/docs/concepts/projects/domains
