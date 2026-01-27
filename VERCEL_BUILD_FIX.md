# Fix: Vercel Build Error - DATABASE_URL Not Set

## Error Message
```
Command "npm run build" exited with 1
```

## Root Cause
The build script correctly detects you're in production but `DATABASE_URL` is not set in Vercel environment variables.

## Quick Fix (5 minutes)

### Step 1: Get a PostgreSQL Database

**Option A: Vercel Postgres (Easiest - Recommended)**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `renorate` project
3. Click **"Storage"** tab
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Click **"Create"**
7. Copy the `DATABASE_URL` connection string (it will be shown)

**Option B: Supabase (Free Tier)**
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Create a new project
4. Go to **Settings → Database**
5. Copy the **Connection String** (URI format)
6. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**Option C: Railway or Neon**
- Follow similar steps to get a PostgreSQL connection string

### Step 2: Add DATABASE_URL to Vercel

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Click **"Add New"**
3. **Key:** `DATABASE_URL`
4. **Value:** Paste your PostgreSQL connection string
5. **Environment:** Select **Production** (and Preview if you want)
6. Click **"Save"**

**Important:** The connection string should look like:
```
postgresql://user:password@host:5432/database?schema=public
```

### Step 3: Redeploy

After adding `DATABASE_URL`:

1. Go to **Vercel Dashboard → Deployments**
2. Find the failed deployment
3. Click **"Redeploy"** (or wait for auto-deploy on next commit)
4. The build should now succeed!

### Step 4: Run Migrations

After successful deployment, run migrations on your production database:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option 2: Direct connection
export DATABASE_URL="your-postgres-connection-string"
npx prisma migrate deploy
```

## Verify It's Fixed

After redeploying, check:

1. **Build Logs:**
   - Vercel Dashboard → Deployments → Click on deployment
   - Should see: "✅ Switched to PostgreSQL schema for production"
   - Build should complete successfully

2. **Site:**
   - Visit https://renorate.net
   - Should load without errors

## Common Issues

### "DATABASE_URL is not set" error persists
- ✅ Make sure you added it in **Production** environment (not just Preview)
- ✅ Verify the variable name is exactly `DATABASE_URL` (case-sensitive)
- ✅ Try redeploying after adding the variable

### "Connection refused" or database errors
- ✅ Verify your PostgreSQL database is running
- ✅ Check the connection string is correct
- ✅ Ensure database allows connections from Vercel's IPs (most cloud providers do this automatically)

### Build succeeds but site shows errors
- ✅ Run migrations: `npx prisma migrate deploy`
- ✅ Check Vercel function logs for runtime errors

## Summary

**The Issue:** `DATABASE_URL` environment variable is missing in Vercel

**The Fix:** 
1. Get PostgreSQL database
2. Add `DATABASE_URL` to Vercel environment variables
3. Redeploy
4. Run migrations

**Time Required:** ~5 minutes

---

**Need Help?** Check the build logs in Vercel dashboard for the exact error message.
