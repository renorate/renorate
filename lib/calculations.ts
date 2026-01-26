/**
 * Legacy calculation functions - now wraps pure calculator
 * Maintains backward compatibility while using new pure functions
 */

import { prisma } from './prisma'
import { calculateLineItem as calculateLineItemPure, calculateEstimateTotal as calculateEstimateTotalPure, DEFAULT_SETTINGS } from './estimate'
import type { CalculationResult } from './estimate/types'

/**
 * @deprecated Use calculateLineItem from lib/estimate/calculator directly
 * This function is kept for backward compatibility
 */
export async function calculateLineItem(
  projectType: string,
  quantity: number,
  unit: string,
  description: string
): Promise<CalculationResult> {
  // Get settings from DB (or use defaults)
  let settings = await prisma.settings.findUnique({
    where: { id: 'default' },
  })
  
  // Create default settings if they don't exist
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: 'default',
        defaultMarkup: DEFAULT_SETTINGS.defaultMarkup,
        laborRate: DEFAULT_SETTINGS.laborRate,
        permitFeeEnabled: DEFAULT_SETTINGS.permitFeeEnabled,
      },
    })
  }
  
  // Use pure calculation function
  return calculateLineItemPure(
    projectType,
    quantity,
    unit,
    {
      defaultMarkup: settings.defaultMarkup,
      laborRate: settings.laborRate,
      permitFeeEnabled: settings.permitFeeEnabled,
    }
  )
}

/**
 * @deprecated Use calculateEstimateTotal from lib/estimate/calculator directly
 */
export async function calculateEstimateTotal(lineItems: CalculationResult[]): Promise<number> {
  return calculateEstimateTotalPure(lineItems)
}
