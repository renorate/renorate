# Troubleshooting Guide

## "Failed to create estimate" Error

If you're getting this error when trying to create an estimate, follow these steps:

### Step 1: Check Database Setup

Make sure the database is properly set up:

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

### Step 2: Verify Database File Exists

Check if the SQLite database file was created:
```bash
ls -la prisma/dev.db
```

If the file doesn't exist, run migrations again:
```bash
npm run db:migrate
```

### Step 3: Check Server Logs

When running `npm run dev`, check the terminal/console for error messages. The improved error handling will now show the actual error in the console.

### Step 4: Verify Settings Exist

The app should auto-create default settings, but you can verify:
```bash
npm run db:studio
```

Open the Settings table and ensure there's a record with id "default".

### Step 5: Check Form Data

Make sure you're filling out all required fields:
- Client Name
- Phone
- Email (must be valid email format)
- Address
- ZIP Code (at least 5 characters)
- Project Type (must select one)
- At least one line item with description and quantity > 0

### Step 6: Check Browser Console

Open your browser's developer tools (F12) and check the Console tab for any JavaScript errors.

### Step 7: Common Issues

**Issue: "Prisma Client is not generated"**
- Solution: Run `npx prisma generate`

**Issue: "Database not found"**
- Solution: Run `npm run db:migrate`

**Issue: "Cannot read property 'defaultMarkup' of null"**
- Solution: Settings should auto-create, but if this happens, run `npm run db:seed`

**Issue: Validation errors**
- Check that all fields are filled correctly
- Email must be a valid email format
- ZIP code must be at least 5 characters
- Line items must have description and quantity > 0

### Step 8: Reset Database (Development Only)

If all else fails, you can reset the database:

```bash
npx prisma migrate reset
npm run db:seed
```

**Warning:** This will delete all data!

### Still Having Issues?

1. Check that all dependencies are installed: `npm install`
2. Verify Node.js version is 18+: `node --version`
3. Make sure the development server is running: `npm run dev`
4. Try clearing `.next` cache: `rm -rf .next`

If you continue to have issues, check the server terminal output for the detailed error message (it's now logged with console.error).
