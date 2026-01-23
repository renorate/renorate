# Deployment Guide

## Quick Start (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run db:migrate
   ```

3. **Seed with sample data (optional):**
   ```bash
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Step 1: Prepare Your Repository

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (or `prisma generate && next build`)
   - **Output Directory**: `.next` (default)
   - **Domain**: Add your custom domain `renorate.net` in Project Settings → Domains

### Step 3: Set Environment Variables

In Vercel project settings, add:
- `DATABASE_URL`: Your database connection string

### Step 4: Switch to PostgreSQL (Production)

For production, you should use PostgreSQL instead of SQLite:

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Get a PostgreSQL database:**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Or use [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech)

3. **Update your DATABASE_URL in Vercel:**
   ```
   postgresql://user:password@host:5432/database?schema=public
   ```

4. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Redeploy on Vercel**

### Step 5: Configure Custom Domain (renorate.net)

1. In Vercel Project Settings → Domains
2. Add `renorate.net` and `www.renorate.net`
3. Follow DNS configuration instructions:
   - Add A record pointing to Vercel's IP
   - Or add CNAME record pointing to `cname.vercel-dns.com`
4. SSL certificate will be automatically provisioned by Vercel
5. Once DNS propagates (usually 24-48 hours), your site will be live at renorate.net

## Database Commands

- **Create migration**: `npx prisma migrate dev --name migration_name`
- **Apply migrations**: `npm run db:migrate`
- **Open Prisma Studio**: `npm run db:studio`
- **Seed database**: `npm run db:seed`
- **Generate Prisma Client**: `npx prisma generate`

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Check your `DATABASE_URL` environment variable
2. Ensure the database is accessible from your deployment environment
3. For Vercel, make sure you're using a hosted database (not SQLite)

### Build Errors

If the build fails:
1. Make sure `prisma generate` runs before `next build`
2. Check that all environment variables are set
3. Verify Prisma schema is valid: `npx prisma validate`

### Migration Issues

If migrations fail:
1. Reset the database (dev only): `npx prisma migrate reset`
2. Check migration files in `prisma/migrations/`
3. Ensure database URL is correct
