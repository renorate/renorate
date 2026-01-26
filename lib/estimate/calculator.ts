/**
 * Pure calculation functions for estimates
 * No database dependencies - all inputs must be provided
 */

import type {
  LineItemInput,
  CalculationResult,
  CalculatedLineItem,
  EstimateInput,
  EstimateOutput,
  CalculationSettings,
} from './types'
import { getBaseRates } from './defaults'

/**
 * Calculate costs for a single line item
 * Pure function - no side effects, no database calls
 */
export function calculateLineItem(
  projectType: string,
  quantity: number,
  unit: string,
  settings: CalculationSettings
): CalculationResult {
  const baseRates = getBaseRates(projectType)
  const { defaultMarkup, laborRate, permitFeeEnabled } = settings

  let laborCost = 0
  let materialCost = 0

  // Calculate based on unit type
  if (unit === 'sqft') {
    laborCost = baseRates.labor * quantity
    materialCost = baseRates.material * quantity
  } else if (unit === 'linear ft') {
    // Linear ft is typically less than sqft
    laborCost = baseRates.labor * quantity * 0.7
    materialCost = baseRates.material * quantity * 0.7
  } else if (unit === 'each') {
    // For "each", use hourly rate estimate
    const estimatedHours = Math.max(1, quantity * 0.5) // Rough estimate
    laborCost = laborRate * estimatedHours
    materialCost = baseRates.material * quantity * 10 // Rough estimate for "each"
  }

  // Apply markup to materials
  materialCost = materialCost * (1 + defaultMarkup)

  // Permit cost (typically 1-2% of project, or flat fee for small projects)
  const permitCost = permitFeeEnabled
    ? Math.max(100, (laborCost + materialCost) * 0.015)
    : 0

  // Disposal cost (typically 5-10% of material cost)
  const disposalCost = materialCost * 0.07

  const subtotal = laborCost + materialCost + permitCost + disposalCost

  return {
    laborCost: Math.round(laborCost * 100) / 100,
    materialCost: Math.round(materialCost * 100) / 100,
    permitCost: Math.round(permitCost * 100) / 100,
    disposalCost: Math.round(disposalCost * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
  }
}

/**
 * Calculate estimate total from line items
 * Pure function
 */
export function calculateEstimateTotal(lineItems: CalculationResult[]): number {
  return lineItems.reduce((sum, item) => sum + item.subtotal, 0)
}

/**
 * Calculate full estimate with all line items
 * Pure function - takes all inputs and returns calculated output
 */
export function calculateEstimate(input: EstimateInput): EstimateOutput {
  const calculatedLineItems: CalculatedLineItem[] = input.lineItems.map((item) => {
    const costs = calculateLineItem(
      input.projectType,
      item.quantity,
      item.unit,
      input.settings
    )
    return {
      ...item,
      ...costs,
    }
  })

  const totalAmount = calculateEstimateTotal(calculatedLineItems)

  const breakdown = calculatedLineItems.reduce(
    (acc, item) => ({
      totalLabor: acc.totalLabor + item.laborCost,
      totalMaterials: acc.totalMaterials + item.materialCost,
      totalPermits: acc.totalPermits + item.permitCost,
      totalDisposal: acc.totalDisposal + item.disposalCost,
    }),
    {
      totalLabor: 0,
      totalMaterials: 0,
      totalPermits: 0,
      totalDisposal: 0,
    }
  )

  return {
    lineItems: calculatedLineItems,
    totalAmount: Math.round(totalAmount * 100) / 100,
    breakdown: {
      totalLabor: Math.round(breakdown.totalLabor * 100) / 100,
      totalMaterials: Math.round(breakdown.totalMaterials * 100) / 100,
      totalPermits: Math.round(breakdown.totalPermits * 100) / 100,
      totalDisposal: Math.round(breakdown.totalDisposal * 100) / 100,
    },
  }
}
