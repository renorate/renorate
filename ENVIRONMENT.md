# Environment Variables

This document lists all required environment variables for the RenoRate application.

## Required for Production

### Authentication
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js session encryption. Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - The canonical URL of your site (e.g., `https://renorate.net`)

### Database
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:password@host:5432/database?schema=public`)

### Node Environment
- `NODE_ENV` - Set to `production` for production deployments

## Local Development

For local development, create a `.env.local` file with:

```env
# For local development (SQLite):
DATABASE_URL="file:./prisma/dev.db"

# NextAuth (generate a secret for local dev):
NEXTAUTH_SECRET="your-local-dev-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Node environment
NODE_ENV="development"
```

## Production Setup

1. Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

2. Set `NEXTAUTH_URL` to your canonical domain (non-www):
   ```
   NEXTAUTH_URL=https://renorate.net
   ```

3. Configure your database connection string for PostgreSQL.

4. Set all variables in your hosting platform (Vercel, etc.) before deploying.

## Optional: Permit Lookup API

If you want to enable permit lookup functionality:

- `PERMIT_API_KEY` - API key for permit lookup service (if required)
- `PERMIT_API_URL` - Base URL for permit lookup API endpoint

**Note**: Permit lookup requires integration with local jurisdiction APIs. See `app/api/permits/search/route.ts` for implementation details.

## Security Notes

- **Never commit** `.env.local` or `.env` files to version control
- `NEXTAUTH_SECRET` should be a strong, random string
- Use different secrets for development and production
- Ensure `DATABASE_URL` uses SSL in production
