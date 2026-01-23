import { prisma } from './prisma'

export interface LineItemInput {
  description: string
  quantity: number
  unit: string
  notes?: string
}

export interface CalculationResult {
  laborCost: number
  materialCost: number
  permitCost: number
  disposalCost: number
  subtotal: number
}

// Base rates per unit for different project types
const BASE_RATES: Record<string, { labor: number; material: number }> = {
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

export async function calculateLineItem(
  projectType: string,
  quantity: number,
  unit: string,
  description: string
): Promise<CalculationResult> {
  let settings = await prisma.settings.findUnique({
    where: { id: 'default' },
  })
  
  // Create default settings if they don't exist
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: 'default',
        defaultMarkup: 0.25,
        laborRate: 75.0,
        permitFeeEnabled: true,
      },
    })
  }
  
  const markup = settings.defaultMarkup
  const laborRate = settings.laborRate
  const permitEnabled = settings.permitFeeEnabled

  const baseRates = BASE_RATES[projectType] || { labor: 50, material: 40 }

  let laborCost = 0
  let materialCost = 0

  // Calculate based on unit type
  if (unit === 'sqft') {
    laborCost = baseRates.labor * quantity
    materialCost = baseRates.material * quantity
  } else if (unit === 'linear ft') {
    laborCost = baseRates.labor * quantity * 0.7 // Linear ft is typically less than sqft
    materialCost = baseRates.material * quantity * 0.7
  } else if (unit === 'each') {
    // For "each", use hourly rate estimate
    const estimatedHours = Math.max(1, quantity * 0.5) // Rough estimate
    laborCost = laborRate * estimatedHours
    materialCost = baseRates.material * quantity * 10 // Rough estimate for "each"
  }

  // Apply markup to materials
  materialCost = materialCost * (1 + markup)

  // Permit cost (typically 1-2% of project, or flat fee for small projects)
  const permitCost = permitEnabled
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

export async function calculateEstimateTotal(lineItems: CalculationResult[]): Promise<number> {
  return lineItems.reduce((sum, item) => sum + item.subtotal, 0)
}
