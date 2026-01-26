# Force Deploy to renorate.net

## Issue
The live site at renorate.net is still showing old content. This means the latest deployment hasn't been applied.

## Quick Fix Options

### Option 1: Check Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Find your `renorate` project

2. **Check Deployment Status:**
   - Look at the "Deployments" tab
   - See if there's a recent deployment from commit `18239c2`
   - Check if it's "Ready" or "Building" or "Error"

3. **If No Recent Deployment:**
   - Click "Redeploy" on the latest deployment
   - OR click "Deploy" → "Deploy Latest Commit"

4. **If Deployment Failed:**
   - Check the build logs
   - Fix any errors
   - Redeploy

### Option 2: Install Vercel CLI and Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project (if not already linked)
cd /Users/admin/renorate
vercel link

# Deploy to production
vercel --prod
```

### Option 3: Connect GitHub to Vercel (If Not Connected)

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import from GitHub: `renorate/renorate`
4. Configure:
   - Framework: Next.js (auto-detected)
   - Build Command: `prisma generate && next build`
   - Root Directory: `.` (default)
5. Add environment variables (see below)
6. Click "Deploy"

## Environment Variables Required

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

- `NEXTAUTH_SECRET` - Must be set
- `NEXTAUTH_URL` - Set to `https://renorate.net`
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production`

## Clear Cache

After deployment, you may need to clear cache:

1. **Browser Cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or open in incognito/private window

2. **Vercel Cache:**
   - In Vercel dashboard → Deployments
   - Click "Redeploy" with "Use existing Build Cache" UNCHECKED

3. **CDN Cache:**
   - Vercel CDN cache should clear automatically
   - May take a few minutes

## Verify Deployment

After deploying, check:

1. **Visit https://renorate.net**
   - Should see: "The KBB of Renovation Pricing" (not "Professional Renovation Estimating Platform")
   - Should see new positioning message about pricing transparency

2. **Check Page Source:**
   - Right-click → View Page Source
   - Search for "KBB" - should find it
   - Search for "connecting verified contractors" - should NOT find it

3. **Check Deployment Hash:**
   ```bash
   curl -I https://renorate.net | grep -i "x-vercel"
   ```
   Should show deployment ID

## If Still Not Working

1. **Check DNS:**
   - Verify renorate.net points to Vercel
   - Check DNS records at your domain registrar

2. **Check Vercel Project Settings:**
   - Settings → Domains
   - Verify `renorate.net` and `www.renorate.net` are configured

3. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click on deployment → View logs
   - Look for build errors

4. **Force Redeploy:**
   - In Vercel dashboard, find the latest successful deployment
   - Click "Redeploy" (uncheck "Use existing Build Cache")

## Quick Command Reference

```bash
# Check if Vercel CLI is installed
which vercel

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

---

**Current Commit:** `18239c2` - Marketing repositioning  
**Expected Content:** "The KBB of Renovation Pricing"  
**Live Site Shows:** Old "Professional Renovation Estimating Platform" content
