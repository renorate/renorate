# RenoRate Architecture Summary

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Authentication**: NextAuth.js v4 (Credentials Provider)
- **PDF Generation**: jsPDF v4.0.0 (client-side, needs server-side migration)
- **Styling**: TailwindCSS
- **Validation**: Zod

## Current Core Flows

### 1. Estimate Maker UI
- **Location**: `app/estimate/new/page.tsx`
- **Functionality**: Form to create new estimates with client info and line items
- **Persistence**: Saves to DB via `app/actions.ts` → `createEstimate()`

### 2. Client Management
- **Current State**: Client info is embedded in Estimate model (no separate Client model)
- **Fields**: `clientName`, `clientPhone`, `clientEmail`, `address`, `zipCode` stored directly in Estimate
- **Issue**: No client reuse or management - each estimate duplicates client data

### 3. Estimate Persistence
- **Location**: `app/actions.ts` (server actions)
- **Database**: Prisma `Estimate` model with `LineItem` relations
- **Save**: `createEstimate()` and `updateEstimate()` functions
- **Load**: `getEstimate()` and `getAllEstimates()` functions
- **Status**: ✅ Working - estimates are saved and can be reopened

### 4. Calculation Logic
- **Location**: `lib/calculations.ts`
- **Current State**: Async functions that depend on DB settings lookup
- **Functions**: 
  - `calculateLineItem()` - calculates costs per line item
  - `calculateEstimateTotal()` - sums line item subtotals
- **Issue**: Not pure/testable - depends on Prisma DB calls for settings

### 5. PDF Export
- **Location**: `lib/pdf.ts` (client-side)
- **Method**: jsPDF - generates PDF in browser
- **Usage**: Called from `components/EstimateDetail.tsx` via `handleExportPDF()`
- **Issue**: Client-side only, doesn't work reliably in production, uses current screen state

### 6. Permit Lookup
- **Status**: ❌ Not implemented
- **References**: Only permit cost calculation exists (included in estimate totals)
- **Need**: Actual permit lookup API integration or "Coming soon" message

## Data Models

### Current Schema (Prisma)
```prisma
model Estimate {
  id          String      @id @default(cuid())
  clientName  String      // Embedded client data
  clientPhone String
  clientEmail String
  address     String
  zipCode     String
  projectType String
  contractorId String?
  projectId    String?
  lineItems   LineItem[]
  totalAmount Float
  createdAt   DateTime
  updatedAt   DateTime
}

model LineItem {
  id          String   @id @default(cuid())
  estimateId  String
  description String
  quantity    Float
  unit        String
  notes       String?
  laborCost   Float
  materialCost Float
  permitCost  Float
  disposalCost Float
  subtotal    Float
}
```

### Missing Models
- **Client**: No separate client model for reuse
- **EstimateVersion**: No versioning system

## Issues to Fix

1. ✅ **Client Management**: Need separate Client model
2. ✅ **Calculation Purity**: Extract calculations from DB dependencies
3. ✅ **PDF Export**: Move to server-side endpoint
4. ✅ **Permit Lookup**: Implement or mark as "Coming soon"
5. ✅ **Input Preservation**: Ensure all inputs are saved and reloaded correctly

## File Structure

```
app/
  estimate/
    new/page.tsx          # Create estimate form
    [id]/page.tsx         # View/edit estimate
  estimates/page.tsx      # List all estimates
  actions.ts              # Server actions (create/update/get estimates)
lib/
  calculations.ts         # Calculation logic (needs refactoring)
  pdf.ts                  # PDF generation (client-side, needs server endpoint)
  prisma.ts               # Prisma client
components/
  EstimateDetail.tsx      # Estimate detail view with edit capability
prisma/
  schema.prisma           # Database schema
```
