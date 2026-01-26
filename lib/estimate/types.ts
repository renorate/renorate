/**
 * Pure TypeScript types for estimate calculations
 * No dependencies on React, Prisma, or database
 */

export type ProjectType = 
  | 'Roofing'
  | 'Bathroom'
  | 'Kitchen'
  | 'Flooring'
  | 'Paint'
  | 'Drywall'
  | 'Deck'
  | 'Windows'
  | 'Siding'
  | 'HVAC'
  | 'Electrical'
  | 'Plumbing'

export type Unit = 'sqft' | 'linear ft' | 'each'

export interface LineItemInput {
  description: string
  quantity: number
  unit: Unit
  notes?: string
}

export interface CalculationSettings {
  defaultMarkup: number      // e.g., 0.25 for 25%
  laborRate: number          // e.g., 75.0 for $75/hour
  permitFeeEnabled: boolean
}

export interface CalculationResult {
  laborCost: number
  materialCost: number
  permitCost: number
  disposalCost: number
  subtotal: number
}

export interface CalculatedLineItem extends LineItemInput, CalculationResult {}

export interface EstimateInput {
  projectType: ProjectType
  lineItems: LineItemInput[]
  settings: CalculationSettings
}

export interface EstimateOutput {
  lineItems: CalculatedLineItem[]
  totalAmount: number
  breakdown: {
    totalLabor: number
    totalMaterials: number
    totalPermits: number
    totalDisposal: number
  }
}
