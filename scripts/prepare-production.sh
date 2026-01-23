#!/bin/bash

# Script to prepare RenoRate for production deployment
# This switches Prisma schema from SQLite to PostgreSQL

echo "🚀 Preparing RenoRate for production deployment..."

# Backup current schema
if [ -f "prisma/schema.prisma" ]; then
  cp prisma/schema.prisma prisma/schema.sqlite.backup
  echo "✅ Backed up current schema to prisma/schema.sqlite.backup"
fi

# Copy production schema
if [ -f "prisma/schema.production.prisma" ]; then
  cp prisma/schema.production.prisma prisma/schema.prisma
  echo "✅ Switched to PostgreSQL schema"
else
  echo "❌ Error: prisma/schema.production.prisma not found"
  exit 1
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Production preparation complete!"
echo ""
echo "Next steps:"
echo "1. Set DATABASE_URL environment variable in Vercel"
echo "2. Commit and push: git add . && git commit -m 'Switch to PostgreSQL' && git push"
echo "3. After deployment, run: npx prisma migrate deploy"
echo ""
