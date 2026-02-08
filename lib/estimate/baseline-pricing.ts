/**
 * Baseline pricing table for estimates.
 * Stored in code so estimates work even when DB is unavailable.
 * Clearly labeled as "baseline pricing" in the UI.
 */

export interface BaselineMaterial {
  id: string
  description: string
  unit: string
  unitCost: number // $ per unit
  category: 'lumber' | 'sheathing' | 'roofing' | 'siding' | 'openings' | 'concrete' | 'fasteners' | 'other'
}

/** Baseline material costs (conservative). Update periodically for accuracy. */
export const BASELINE_MATERIALS: Record<string, BaselineMaterial> = {
  stud_2x4: {
    id: 'stud_2x4',
    description: '2x4 studs',
    unit: 'each',
    unitCost: 4.25,
    category: 'lumber',
  },
  stud_2x6: {
    id: 'stud_2x6',
    description: '2x6 rafters / joists',
    unit: 'each',
    unitCost: 6.5,
    category: 'lumber',
  },
  osb: {
    id: 'osb',
    description: 'OSB / Plywood sheathing',
    unit: 'sqft',
    unitCost: 0.85,
    category: 'sheathing',
  },
  metal_roof_panel: {
    id: 'metal_roof_panel',
    description: 'Metal roofing panels',
    unit: 'sqft',
    unitCost: 2.1,
    category: 'roofing',
  },
  ridge_cap: {
    id: 'ridge_cap',
    description: 'Ridge cap',
    unit: 'linear ft',
    unitCost: 3.5,
    category: 'roofing',
  },
  underlayment: {
    id: 'underlayment',
    description: 'Roof underlayment',
    unit: 'sqft',
    unitCost: 0.35,
    category: 'roofing',
  },
  screws_roof: {
    id: 'screws_roof',
    description: 'Roofing screws',
    unit: 'each',
    unitCost: 0.08,
    category: 'fasteners',
  },
  nails: {
    id: 'nails',
    description: 'Nails / fasteners',
    unit: 'lb',
    unitCost: 4.0,
    category: 'fasteners',
  },
  house_wrap: {
    id: 'house_wrap',
    description: 'House wrap',
    unit: 'sqft',
    unitCost: 0.22,
    category: 'siding',
  },
  siding_vinyl: {
    id: 'siding_vinyl',
    description: 'Vinyl siding',
    unit: 'sqft',
    unitCost: 2.5,
    category: 'siding',
  },
  siding_metal: {
    id: 'siding_metal',
    description: 'Metal siding',
    unit: 'sqft',
    unitCost: 3.0,
    category: 'siding',
  },
  siding_wood: {
    id: 'siding_wood',
    description: 'Wood / LP siding',
    unit: 'sqft',
    unitCost: 3.5,
    category: 'siding',
  },
  window_unit: {
    id: 'window_unit',
    description: 'Window (unit)',
    unit: 'each',
    unitCost: 185,
    category: 'openings',
  },
  door_unit: {
    id: 'door_unit',
    description: 'Door (unit)',
    unit: 'each',
    unitCost: 320,
    category: 'openings',
  },
  concrete_block: {
    id: 'concrete_block',
    description: 'Concrete blocks / pads',
    unit: 'each',
    unitCost: 2.25,
    category: 'concrete',
  },
  trim: {
    id: 'trim',
    description: 'Trim (corner, fascia)',
    unit: 'linear ft',
    unitCost: 2.0,
    category: 'other',
  },
}

export type RoofType = 'metal' | 'shingle'
export type SidingType = 'vinyl' | 'metal' | 'wood'

export interface ShedInputs {
  widthFt: number
  lengthFt: number
  heightFt: number
  roofType: RoofType
  windowCount: number
  doorCount: number
  sidingType: SidingType
}

export interface QuickEstimateLineItem {
  description: string
  quantity: number
  unit: string
  unitCost: number
  extendedCost: number
}

export interface QuickEstimateResult {
  lineItems: QuickEstimateLineItem[]
  materialsSubtotal: number
  salesTaxEnabled: boolean
  salesTaxRate: number
  salesTaxAmount: number
  contingencyPercent: number
  contingencyAmount: number
  totalAmount: number
}

/**
 * Compute shed/utility building estimate from dimensions and options.
 * Pure function - no DB, no side effects.
 */
export function computeShedEstimate(inputs: ShedInputs): QuickEstimateResult {
  const {
    widthFt,
    lengthFt,
    heightFt,
    roofType,
    windowCount,
    doorCount,
    sidingType,
  } = inputs

  const floorArea = widthFt * lengthFt
  const perimeter = 2 * (widthFt + lengthFt)
  const wallArea = perimeter * heightFt
  // Roof area (gable assumed): base * (length + overhang)
  const roofArea = (widthFt + 2) * (lengthFt + 2) * 1.08 // ~8% pitch factor
  const ridgeLength = lengthFt + 2

  const lineItems: QuickEstimateLineItem[] = []

  // Floor: concrete pads (one per ~4 sqft)
  const padCount = Math.ceil(floorArea / 4) * 4
  lineItems.push({
    description: BASELINE_MATERIALS.concrete_block.description,
    quantity: padCount,
    unit: BASELINE_MATERIALS.concrete_block.unit,
    unitCost: BASELINE_MATERIALS.concrete_block.unitCost,
    extendedCost: Math.round(padCount * BASELINE_MATERIALS.concrete_block.unitCost * 100) / 100,
  })

  // 2x4 studs: perimeter * 2 (top/bottom plate) + wall studs 16" OC + floor joists
  const studCount = Math.ceil(perimeter * 2 / 8) * 2 + Math.ceil(perimeter / 1.33) * Math.ceil(heightFt * 2) + Math.ceil(lengthFt / 1.33) * Math.ceil(widthFt * 2)
  lineItems.push({
    description: BASELINE_MATERIALS.stud_2x4.description,
    quantity: Math.ceil(studCount),
    unit: BASELINE_MATERIALS.stud_2x4.unit,
    unitCost: BASELINE_MATERIALS.stud_2x4.unitCost,
    extendedCost: Math.round(Math.ceil(studCount) * BASELINE_MATERIALS.stud_2x4.unitCost * 100) / 100,
  })

  // 2x6 rafters
  const rafterCount = Math.ceil((widthFt + 2) / 2) * 2 * (Math.ceil(lengthFt / 2) + 1)
  lineItems.push({
    description: BASELINE_MATERIALS.stud_2x6.description,
    quantity: rafterCount,
    unit: BASELINE_MATERIALS.stud_2x6.unit,
    unitCost: BASELINE_MATERIALS.stud_2x6.unitCost,
    extendedCost: Math.round(rafterCount * BASELINE_MATERIALS.stud_2x6.unitCost * 100) / 100,
  })

  // OSB floor + walls + roof
  const osbArea = floorArea + wallArea + roofArea
  lineItems.push({
    description: BASELINE_MATERIALS.osb.description,
    quantity: Math.ceil(osbArea),
    unit: BASELINE_MATERIALS.osb.unit,
    unitCost: BASELINE_MATERIALS.osb.unitCost,
    extendedCost: Math.round(Math.ceil(osbArea) * BASELINE_MATERIALS.osb.unitCost * 100) / 100,
  })

  // Roof
  lineItems.push({
    description: BASELINE_MATERIALS.underlayment.description,
    quantity: Math.ceil(roofArea),
    unit: BASELINE_MATERIALS.underlayment.unit,
    unitCost: BASELINE_MATERIALS.underlayment.unitCost,
    extendedCost: Math.round(Math.ceil(roofArea) * BASELINE_MATERIALS.underlayment.unitCost * 100) / 100,
  })
  lineItems.push({
    description: BASELINE_MATERIALS.metal_roof_panel.description,
    quantity: Math.ceil(roofArea),
    unit: BASELINE_MATERIALS.metal_roof_panel.unit,
    unitCost: BASELINE_MATERIALS.metal_roof_panel.unitCost,
    extendedCost: Math.round(Math.ceil(roofArea) * BASELINE_MATERIALS.metal_roof_panel.unitCost * 100) / 100,
  })
  lineItems.push({
    description: BASELINE_MATERIALS.ridge_cap.description,
    quantity: ridgeLength,
    unit: BASELINE_MATERIALS.ridge_cap.unit,
    unitCost: BASELINE_MATERIALS.ridge_cap.unitCost,
    extendedCost: Math.round(ridgeLength * BASELINE_MATERIALS.ridge_cap.unitCost * 100) / 100,
  })
  lineItems.push({
    description: BASELINE_MATERIALS.screws_roof.description,
    quantity: Math.ceil(roofArea * 1.5),
    unit: BASELINE_MATERIALS.screws_roof.unit,
    unitCost: BASELINE_MATERIALS.screws_roof.unitCost,
    extendedCost: Math.round(Math.ceil(roofArea * 1.5) * BASELINE_MATERIALS.screws_roof.unitCost * 100) / 100,
  })

  // House wrap
  lineItems.push({
    description: BASELINE_MATERIALS.house_wrap.description,
    quantity: Math.ceil(wallArea),
    unit: BASELINE_MATERIALS.house_wrap.unit,
    unitCost: BASELINE_MATERIALS.house_wrap.unitCost,
    extendedCost: Math.round(Math.ceil(wallArea) * BASELINE_MATERIALS.house_wrap.unitCost * 100) / 100,
  })

  // Siding
  const siding = sidingType === 'vinyl' ? BASELINE_MATERIALS.siding_vinyl : sidingType === 'metal' ? BASELINE_MATERIALS.siding_metal : BASELINE_MATERIALS.siding_wood
  lineItems.push({
    description: siding.description,
    quantity: Math.ceil(wallArea),
    unit: siding.unit,
    unitCost: siding.unitCost,
    extendedCost: Math.round(Math.ceil(wallArea) * siding.unitCost * 100) / 100,
  })

  // Windows & doors
  if (windowCount > 0) {
    lineItems.push({
      description: BASELINE_MATERIALS.window_unit.description,
      quantity: windowCount,
      unit: BASELINE_MATERIALS.window_unit.unit,
      unitCost: BASELINE_MATERIALS.window_unit.unitCost,
      extendedCost: Math.round(windowCount * BASELINE_MATERIALS.window_unit.unitCost * 100) / 100,
    })
  }
  if (doorCount > 0) {
    lineItems.push({
      description: BASELINE_MATERIALS.door_unit.description,
      quantity: doorCount,
      unit: BASELINE_MATERIALS.door_unit.unit,
      unitCost: BASELINE_MATERIALS.door_unit.unitCost,
      extendedCost: Math.round(doorCount * BASELINE_MATERIALS.door_unit.unitCost * 100) / 100,
    })
  }

  // Trim
  const trimLinearFt = perimeter * 2 + ridgeLength * 2
  lineItems.push({
    description: BASELINE_MATERIALS.trim.description,
    quantity: Math.ceil(trimLinearFt),
    unit: BASELINE_MATERIALS.trim.unit,
    unitCost: BASELINE_MATERIALS.trim.unitCost,
    extendedCost: Math.round(Math.ceil(trimLinearFt) * BASELINE_MATERIALS.trim.unitCost * 100) / 100,
  })

  // Nails
  lineItems.push({
    description: BASELINE_MATERIALS.nails.description,
    quantity: 25,
    unit: BASELINE_MATERIALS.nails.unit,
    unitCost: BASELINE_MATERIALS.nails.unitCost,
    extendedCost: Math.round(25 * BASELINE_MATERIALS.nails.unitCost * 100) / 100,
  })

  // Labor (estimated baseline: ~$75/hr, ~2 hr per 10 sqft for shed)
  const laborHours = Math.max(8, (floorArea / 10) * 2)
  const laborRate = 75
  const laborCost = Math.round(laborHours * laborRate * 100) / 100
  lineItems.push({
    description: 'Labor (estimated)',
    quantity: laborHours,
    unit: 'hr',
    unitCost: laborRate,
    extendedCost: laborCost,
  })

  const materialsSubtotal = lineItems.reduce((sum, i) => sum + i.extendedCost, 0)
  const salesTaxRate = 0
  const salesTaxAmount = 0
  const contingencyPercent = 10
  const contingencyAmount = Math.round(materialsSubtotal * 0.1 * 100) / 100
  const totalAmount = materialsSubtotal + salesTaxAmount + contingencyAmount

  return {
    lineItems,
    materialsSubtotal,
    salesTaxEnabled: false,
    salesTaxRate,
    salesTaxAmount,
    contingencyPercent,
    contingencyAmount,
    totalAmount,
  }
}

/**
 * Apply tax and contingency to a precomputed result (for UI toggles/sliders).
 */
export function applyTaxAndContingency(
  materialsSubtotal: number,
  salesTaxEnabled: boolean,
  salesTaxRate: number,
  contingencyPercent: number
): { salesTaxAmount: number; contingencyAmount: number; totalAmount: number } {
  const salesTaxAmount = salesTaxEnabled ? Math.round(materialsSubtotal * salesTaxRate * 100) / 100 : 0
  const contingencyAmount = Math.round(materialsSubtotal * (contingencyPercent / 100) * 100) / 100
  const totalAmount = materialsSubtotal + salesTaxAmount + contingencyAmount
  return { salesTaxAmount, contingencyAmount, totalAmount }
}
