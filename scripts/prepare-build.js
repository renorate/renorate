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

if (isProduction) {
  console.log('🔧 Production build detected - using PostgreSQL schema');
  
  // Check if DATABASE_URL is set and looks like PostgreSQL
  const databaseUrl = process.env.DATABASE_URL || '';
  
  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    console.error('   Please set DATABASE_URL in Vercel project settings');
    process.exit(1);
  }
  
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.warn('⚠️  WARNING: DATABASE_URL does not look like a PostgreSQL connection string');
    console.warn('   Expected format: postgresql://user:password@host:5432/database');
  }
  
  // Copy production schema to main schema
  if (fs.existsSync(productionSchemaPath)) {
    const productionSchema = fs.readFileSync(productionSchemaPath, 'utf8');
    fs.writeFileSync(schemaPath, productionSchema);
    console.log('✅ Switched to PostgreSQL schema for production');
  } else {
    console.error('❌ ERROR: schema.production.prisma not found');
    process.exit(1);
  }
} else {
  console.log('🔧 Development build - using SQLite schema');
  // Schema is already set to SQLite, no action needed
}
