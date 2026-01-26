/**
 * Default values for estimate calculations
 */

import type { ProjectType, CalculationSettings } from './types'

/**
 * Base rates per unit for different project types
 * Format: { labor: cost per unit, material: cost per unit }
 */
export const BASE_RATES: Record<ProjectType, { labor: number; material: number }> = {
  Roofing: { labor: 3.5, material: 2.5 },
  Bathroom: { labor: 85, material: 60 },
  Kitchen: { labor: 100, material: 75 },
  Flooring: { labor: 4.5, material: 3.0 },
  Paint: { labor: 2.0, material: 1.5 },
  Drywall: { labor: 2.5, material: 1.8 },
  Deck: { labor: 8.0, material: 5.5 },
  Windows: { labor: 150, material: 200 },
  Siding: { labor: 4.0, material: 3.5 },
  HVAC: { labor: 120, material: 150 },
  Electrical: { labor: 95, material: 50 },
  Plumbing: { labor: 110, material: 80 },
}

/**
 * Default calculation settings
 */
export const DEFAULT_SETTINGS: CalculationSettings = {
  defaultMarkup: 0.25,      // 25% markup
  laborRate: 75.0,          // $75/hour
  permitFeeEnabled: true,
}

/**
 * Get base rates for a project type, with fallback
 */
export function getBaseRates(projectType: string): { labor: number; material: number } {
  return BASE_RATES[projectType as ProjectType] || { labor: 50, material: 40 }
}
