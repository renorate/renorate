# Deploy to renorate.net - Quick Guide

## Current Status
✅ All code committed and pushed to GitHub  
✅ Build passes successfully  
✅ Ready for production deployment  

## Deployment Options

### Option 1: Vercel Auto-Deploy (Recommended)

If your GitHub repo is connected to Vercel, it should auto-deploy when you push to `main`.

1. **Check Vercel Dashboard:**
   - Go to https://vercel.com/dashboard
   - Find your `renorate` project
   - Check if deployment is in progress or completed

2. **If Auto-Deploy is Working:**
   - Vercel will automatically build and deploy
   - Monitor the deployment in Vercel dashboard
   - After deployment completes, run the database migration (see below)

### Option 2: Manual Vercel Deployment

If you need to deploy manually:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your `renorate` project
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment (or trigger a new deployment)

## ⚠️ CRITICAL: Database Migration

**After deployment completes, you MUST run the database migration:**

```bash
# Option A: Via Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy

# Option B: Via Vercel Dashboard
# Go to your project → Settings → Environment Variables
# Then use Vercel's database migration feature or run via CLI
```

Or if you have direct database access:
```bash
npx prisma migrate deploy
```

This creates the `Client` table and updates the `Estimate` table.

## Environment Variables Check

Verify these are set in Vercel Dashboard → Settings → Environment Variables:

✅ **Required:**
- `NEXTAUTH_SECRET` - Must be set
- `NEXTAUTH_URL` - Should be `https://renorate.net`
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Should be `production`

## Post-Deployment Verification

After deployment and migration:

1. **Visit https://renorate.net**
   - ✅ Homepage loads with new "KBB of Renovation Pricing" messaging
   - ✅ No errors in browser console

2. **Test Authentication:**
   - ✅ Register new account
   - ✅ Login works
   - ✅ Session persists after refresh

3. **Test Estimates:**
   - ✅ Create estimate
   - ✅ Save estimate
   - ✅ Reopen estimate (all inputs preserved)
   - ✅ Export PDF (downloads correctly)

4. **Test Domain:**
   - ✅ `https://www.renorate.net` redirects to `https://renorate.net`
   - ✅ HTTPS is enforced

## Troubleshooting

### Build Fails in Vercel:
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Check that `prisma generate` runs successfully

### Migration Fails:
- Ensure `DATABASE_URL` is correct
- Verify database connection
- Check Prisma client is generated

### Site Not Loading:
- Check Vercel deployment status
- Verify custom domain is configured
- Check DNS settings for renorate.net

## Quick Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Open project in browser
vercel open
```

---

**Last Updated:** After marketing repositioning commit `18239c2`
