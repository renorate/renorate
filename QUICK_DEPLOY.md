# 🚀 Quick Deploy Guide - RenoRate

## Fastest Path to Production (5 Steps)

### Step 1: Get a PostgreSQL Database (5 minutes)

**Easiest Option: Vercel Postgres**
1. After deploying to Vercel, go to your project
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the connection string (starts with `postgresql://`)

**Alternative: Supabase (Free)**
1. Go to https://supabase.com and sign up
2. Create new project
3. Settings → Database → Connection String → Copy

### Step 2: Push Code to GitHub (2 minutes)

```bash
# If not already done
git init
git add .
git commit -m "Ready for production"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/renorate.git
git push -u origin main
```

### Step 3: Deploy to Vercel (3 minutes)

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. **Add Environment Variable:**
   - Name: `DATABASE_URL`
   - Value: Your PostgreSQL connection string
5. Click "Deploy"

### Step 4: Switch to PostgreSQL (1 minute)

**Before first deployment, update Prisma schema:**

```bash
# Option A: Use the production schema file
cp prisma/schema.production.prisma prisma/schema.prisma

# Option B: Manually edit prisma/schema.prisma
# Change line 9 from: provider = "sqlite"
# To: provider = "postgresql"
```

Then commit and push:
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

Vercel will automatically redeploy.

### Step 5: Run Database Migrations (2 minutes)

After deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link
vercel login
vercel link

# Run migrations (uses production DATABASE_URL)
npx prisma migrate deploy
```

**OR** use Vercel's built-in terminal:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment → "Functions" tab
3. Use the terminal to run: `npx prisma migrate deploy`

---

## That's It! 🎉

Your site should now be live at `your-project.vercel.app`

### Next Steps:
- Add custom domain (renorate.net) in Vercel Settings → Domains
- Test all features
- Monitor in Vercel Dashboard

---

## Troubleshooting

**Build fails?**
- Check that `prisma generate` runs (it's in vercel.json)
- Verify DATABASE_URL is set correctly

**Database errors?**
- Make sure migrations ran: `npx prisma migrate deploy`
- Verify connection string is correct

**Need help?** Check `DEPLOYMENT_CHECKLIST.md` for detailed guide.
