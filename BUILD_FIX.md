# Fix: Build Error on Vercel

## Problem
Build fails with: `Command "prisma generate && next build" exited with 1`

## Root Cause
The `schema.prisma` file uses SQLite, but Vercel production requires PostgreSQL. SQLite is file-based and doesn't work on Vercel's serverless environment.

## Solution Applied

1. **Created build preparation script** (`scripts/prepare-build.js`)
   - Automatically detects production environment
   - Switches to PostgreSQL schema for production builds
   - Validates DATABASE_URL is set

2. **Updated package.json**
   - Added `prebuild` script that runs before build
   - Ensures correct schema is used based on environment

## What You Need to Do

### 1. Set DATABASE_URL in Vercel

**Critical:** You must set `DATABASE_URL` in Vercel project settings:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `DATABASE_URL` with your PostgreSQL connection string
3. Format: `postgresql://user:password@host:5432/database?schema=public`

**Get a PostgreSQL database:**
- **Easiest:** [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (integrated with Vercel)
- **Alternative:** [Supabase](https://supabase.com) (free tier available)
- **Alternative:** [Railway](https://railway.app) or [Neon](https://neon.tech)

### 2. Verify Environment Variables

In Vercel Dashboard → Settings → Environment Variables, ensure:

- ✅ `DATABASE_URL` - PostgreSQL connection string (REQUIRED)
- ✅ `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- ✅ `NEXTAUTH_URL` - Set to: `https://renorate.net`
- ✅ `NODE_ENV` - Set to: `production` (optional, Vercel sets this automatically)

### 3. Redeploy

After setting `DATABASE_URL`:

1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger auto-deploy

### 4. Run Database Migrations

After successful deployment, run migrations:

```bash
# Using Vercel CLI (if installed)
vercel env pull .env.local
npx prisma migrate deploy

# Or connect to your database directly
export DATABASE_URL="your-postgres-url"
npx prisma migrate deploy
```

## How It Works

- **Local Development:** Uses SQLite (`schema.prisma`)
- **Vercel Production:** Automatically switches to PostgreSQL (`schema.production.prisma`)

The `prebuild` script:
1. Detects if running in production (checks `NODE_ENV` or `VERCEL`)
2. Validates `DATABASE_URL` is set
3. Copies `schema.production.prisma` to `schema.prisma` for the build
4. Prisma generates the client with PostgreSQL support
5. Next.js builds successfully

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- **Fix:** Add `DATABASE_URL` in Vercel project settings

### Error: "DATABASE_URL does not look like PostgreSQL"
- **Fix:** Ensure your `DATABASE_URL` starts with `postgresql://` or `postgres://`

### Build still fails after setting DATABASE_URL
- Check Vercel build logs for the exact error
- Verify the PostgreSQL database is accessible
- Ensure migrations have been run: `npx prisma migrate deploy`

### Local development broken
- The script only switches schemas in production
- Local development still uses SQLite (as intended)
- Your `.env` file should have: `DATABASE_URL="file:./prisma/dev.db"`

---

**Status:** Build script updated. Set `DATABASE_URL` in Vercel and redeploy.
