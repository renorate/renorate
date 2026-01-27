#!/usr/bin/env node
/**
 * Build preparation script
 * Switches Prisma schema based on environment
 */

const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const productionSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');

// Check current schema provider
const currentSchema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : '';
const isPostgreSQL = currentSchema.includes('provider = "postgresql"');
const isSQLite = currentSchema.includes('provider = "sqlite"');

if (isProduction) {
  console.log('🔧 Production build detected');
  
  // Check if DATABASE_URL is set and looks like PostgreSQL
  const databaseUrl = process.env.DATABASE_URL || '';
  
  if (!databaseUrl) {
    console.error('');
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    console.error('');
    console.error('📋 TO FIX THIS:');
    console.error('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.error('   2. Add DATABASE_URL with your PostgreSQL connection string');
    console.error('   3. Format: postgresql://user:password@host:5432/database?schema=public');
    console.error('');
    console.error('💡 Get a PostgreSQL database:');
    console.error('   - Vercel Postgres: Vercel Dashboard → Storage → Create Database');
    console.error('   - Supabase: https://supabase.com (free tier available)');
    console.error('   - Railway: https://railway.app');
    console.error('   - Neon: https://neon.tech');
    console.error('');
    process.exit(1);
  }
  
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.error('');
    console.error('❌ ERROR: DATABASE_URL does not look like a PostgreSQL connection string');
    console.error('   Current value starts with: ' + databaseUrl.substring(0, Math.min(50, databaseUrl.length)));
    console.error('');
    console.error('📋 TO FIX:');
    console.error('   1. Go to Vercel Dashboard → Settings → Environment Variables');
    console.error('   2. Edit DATABASE_URL');
    console.error('   3. Replace with PostgreSQL connection string');
    console.error('   4. Format: postgresql://user:password@host:5432/database?schema=public');
    console.error('');
    if (databaseUrl.startsWith('file:') || databaseUrl.includes('sqlite')) {
      console.error('   ⚠️  You have SQLite format - this won\'t work on Vercel!');
      console.error('   You need a PostgreSQL database (Vercel Postgres, Supabase, etc.)');
    }
    console.error('');
    process.exit(1);
  }
  
  // Verify schema is PostgreSQL
  if (isPostgreSQL) {
    console.log('✅ Schema is already configured for PostgreSQL');
  } else if (isSQLite) {
    // Copy production schema to main schema
    if (fs.existsSync(productionSchemaPath)) {
      const productionSchema = fs.readFileSync(productionSchemaPath, 'utf8');
      fs.writeFileSync(schemaPath, productionSchema);
      console.log('✅ Switched to PostgreSQL schema for production');
    } else {
      console.error('❌ ERROR: schema.production.prisma not found');
      console.error('   Expected at: ' + productionSchemaPath);
      process.exit(1);
    }
  } else {
    console.warn('⚠️  Could not detect schema provider - assuming PostgreSQL');
  }
} else {
  if (isPostgreSQL) {
    console.log('🔧 Development build - using PostgreSQL schema');
    console.log('   Make sure DATABASE_URL is set in your .env file');
  } else {
    console.log('🔧 Development build - using SQLite schema');
  }
}
