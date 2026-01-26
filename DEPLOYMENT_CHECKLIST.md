# Deployment Checklist - Updated Version

## Pre-Deployment Steps

### 1. Database Migration ⚠️ REQUIRED

The new version includes a `Client` model. You **must** run a migration:

**For Vercel/Production:**
```bash
# In your production environment or via Vercel CLI
npx prisma migrate deploy
```

**For Local Testing First:**
```bash
npx prisma migrate dev --name add_client_model
```

This will:
- Create the `Client` table
- Update `Estimate` table to support both legacy and new client relations
- Maintain backward compatibility with existing estimates

### 2. Install Dependencies

The new version includes vitest for testing. Install dependencies:

```bash
npm install
```

### 3. Environment Variables

Ensure these are set in your production environment (Vercel dashboard):

**Required:**
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Set to: `https://renorate.net`
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production`

**Optional (for permit lookup):**
- `PERMIT_API_KEY` - Permit lookup API key (if available)
- `PERMIT_API_URL` - Permit lookup API URL (if available)

See `ENVIRONMENT.md` for full details.

## Deployment Steps

### If Using Vercel:

1. **Push to GitHub** ✅ (Already done)
   - Code is pushed to `main` branch

2. **Vercel Auto-Deploy:**
   - Vercel should automatically detect the push and start building
   - Monitor the deployment in Vercel dashboard

3. **Run Database Migration:**
   - After deployment, run: `npx prisma migrate deploy`
   - Or use Vercel's database migration feature if configured

4. **Verify Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Ensure all required variables are set

### Manual Deployment:

If not using auto-deploy:

```bash
# Build locally to check for errors
npm run build

# Deploy (method depends on your hosting)
# For Vercel CLI:
vercel --prod

# Then run migration:
npx prisma migrate deploy
```

## Post-Deployment Verification

### 1. Test Authentication
- [ ] Visit `https://renorate.net/portal`
- [ ] Register a new account
- [ ] Login with existing account
- [ ] Verify session persists after page refresh
- [ ] Test logout/login flow

### 2. Test Estimate Functionality
- [ ] Create new estimate (`/estimate/new`)
- [ ] Add multiple line items
- [ ] Save estimate
- [ ] Reopen saved estimate (`/estimate/[id]`)
- [ ] Verify all inputs are preserved
- [ ] Edit and save changes
- [ ] Export PDF - verify download works
- [ ] Verify PDF matches saved data

### 3. Test API Endpoints
- [ ] PDF export: `/api/estimate/[id]/pdf` (should download PDF)
- [ ] Permit lookup: `/api/permits/search` (should show "not configured" message)
- [ ] Verify authentication required for protected routes

### 4. Test Domain Redirects
- [ ] Visit `https://www.renorate.net` - should redirect to `https://renorate.net`
- [ ] Verify HTTPS is enforced

### 5. Check Database
- [ ] Verify `Client` table exists
- [ ] Verify existing estimates still work (backward compatibility)
- [ ] Check that new estimates can be created

## Troubleshooting

### Build Fails:
- Check that all dependencies are installed
- Verify `prisma generate` runs successfully
- Check for TypeScript errors: `npm run build`

### Database Errors:
- Ensure `DATABASE_URL` is set correctly
- Run migration: `npx prisma migrate deploy`
- Check database connection

### Authentication Issues:
- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Check cookie settings in production

### PDF Export Fails:
- Check server logs for errors
- Verify estimate exists in database
- Check authentication is working

## Rollback Plan

If issues occur, you can rollback:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <previous-commit-hash>
git push origin main --force
```

**Note:** Rolling back will require reverting the database migration if the Client model was created.

## Success Criteria

✅ All tests pass: `npm test`
✅ Build succeeds: `npm run build`
✅ Authentication works end-to-end
✅ Estimates can be created, saved, reopened, and exported
✅ PDF export generates correctly from database
✅ No console errors in production
✅ All environment variables are set

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables
4. Check database connection
5. Review `IMPLEMENTATION_SUMMARY.md` for details

---

**Last Updated:** After commit `701621a`
**Deployment Date:** _______________
**Deployed By:** _______________
