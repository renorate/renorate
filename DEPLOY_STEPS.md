# Deploy Latest Changes to renorate.net

## Current Situation
- ✅ Code is pushed to GitHub (commit `18239c2`)
- ❌ Live site at renorate.net still shows old content
- ⚠️ Vercel may not have auto-deployed or deployment failed

## Immediate Action Required

### Step 1: Check Vercel Dashboard

1. **Go to:** https://vercel.com/dashboard
2. **Find your project:** Look for `renorate` project
3. **Check Deployments tab:**
   - Is there a deployment from commit `18239c2`?
   - What's the status? (Ready / Building / Error)

### Step 2A: If Vercel is Connected to GitHub

**Trigger Redeploy:**
1. In Vercel Dashboard → Deployments
2. Find the latest deployment
3. Click "..." menu → "Redeploy"
4. **UNCHECK** "Use existing Build Cache"
5. Click "Redeploy"

### Step 2B: If Vercel is NOT Connected to GitHub

**Connect and Deploy:**
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import from GitHub: `renorate/renorate`
4. Configure:
   - Framework: Next.js
   - Build Command: `prisma generate && next build`
   - Root Directory: `.`
5. Add Environment Variables (see below)
6. Click "Deploy"

### Step 2C: Deploy via CLI (Alternative)

```bash
cd /Users/admin/renorate

# Login to Vercel (if not already)
vercel login

# Link to existing project or create new
vercel link

# Deploy to production
vercel --prod
```

## Required Environment Variables

In Vercel Dashboard → Settings → Environment Variables, ensure:

- `NEXTAUTH_SECRET` - Must be set
- `NEXTAUTH_URL` - `https://renorate.net`
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - `production`

## After Deployment

1. **Wait 2-3 minutes** for deployment to complete
2. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or use incognito/private window
3. **Verify new content:**
   - Visit https://renorate.net
   - Should see: **"The KBB of Renovation Pricing"**
   - Should NOT see: "connecting verified contractors"

## If Deployment Succeeds But Site Still Shows Old Content

1. **Check DNS propagation:**
   ```bash
   curl -I https://renorate.net | grep -i location
   ```

2. **Clear Vercel CDN cache:**
   - Vercel Dashboard → Deployments
   - Redeploy with cache disabled

3. **Check custom domain:**
   - Vercel Dashboard → Settings → Domains
   - Verify `renorate.net` is configured correctly

## Quick Test

After deployment, test this URL should show new content:
```bash
curl https://renorate.net | grep -i "KBB"
```

Should return: "The KBB of Renovation Pricing"

---

**Need Help?** Check Vercel deployment logs for any build errors.
