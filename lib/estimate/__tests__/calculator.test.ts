/**
 * Tests for estimate calculator
 * Run with: npm test or npx vitest
 */

import { describe, it, expect } from 'vitest'
import { calculateLineItem, calculateEstimateTotal, calculateEstimate } from '../calculator'
import { DEFAULT_SETTINGS } from '../defaults'
import type { EstimateInput } from '../types'

describe('calculateLineItem', () => {
  it('calculates sqft correctly', () => {
    const result = calculateLineItem('Roofing', 100, 'sqft', DEFAULT_SETTINGS)
    
    expect(result.laborCost).toBe(350) // 3.5 * 100
    expect(result.materialCost).toBeGreaterThan(0)
    expect(result.permitCost).toBeGreaterThan(0)
    expect(result.disposalCost).toBeGreaterThan(0)
    expect(result.subtotal).toBeGreaterThan(0)
  })

  it('calculates linear ft correctly', () => {
    const result = calculateLineItem('Deck', 50, 'linear ft', DEFAULT_SETTINGS)
    
    // Linear ft should be less than sqft equivalent
    expect(result.laborCost).toBe(280) // 8.0 * 50 * 0.7
    expect(result.materialCost).toBeGreaterThan(0)
  })

  it('calculates "each" unit correctly', () => {
    const result = calculateLineItem('Windows', 2, 'each', DEFAULT_SETTINGS)
    
    // Should use hourly rate for "each"
    expect(result.laborCost).toBeGreaterThan(0)
    expect(result.materialCost).toBeGreaterThan(0)
  })

  it('respects permit fee enabled/disabled', () => {
    const withPermit = calculateLineItem('Kitchen', 50, 'sqft', {
      ...DEFAULT_SETTINGS,
      permitFeeEnabled: true,
    })
    
    const withoutPermit = calculateLineItem('Kitchen', 50, 'sqft', {
      ...DEFAULT_SETTINGS,
      permitFeeEnabled: false,
    })
    
    expect(withPermit.permitCost).toBeGreaterThan(0)
    expect(withoutPermit.permitCost).toBe(0)
    expect(withPermit.subtotal).toBeGreaterThan(withoutPermit.subtotal)
  })

  it('applies markup to materials', () => {
    const result = calculateLineItem('Bathroom', 20, 'sqft', DEFAULT_SETTINGS)
    
    // Material cost should include 25% markup
    const baseMaterial = 60 * 20 // base rate * quantity
    const expectedMaterial = baseMaterial * 1.25 // with markup
    expect(result.materialCost).toBeCloseTo(expectedMaterial, 1)
  })
})

describe('calculateEstimateTotal', () => {
  it('sums line item subtotals correctly', () => {
    const lineItems = [
      { laborCost: 100, materialCost: 50, permitCost: 10, disposalCost: 5, subtotal: 165 },
      { laborCost: 200, materialCost: 100, permitCost: 20, disposalCost: 10, subtotal: 330 },
    ]
    
    const total = calculateEstimateTotal(lineItems)
    expect(total).toBe(495)
  })
})

describe('calculateEstimate', () => {
  it('calculates full estimate correctly', () => {
    const input: EstimateInput = {
      projectType: 'Roofing',
      lineItems: [
        { description: 'Roof replacement', quantity: 100, unit: 'sqft', notes: 'Test' },
        { description: 'Gutter installation', quantity: 50, unit: 'linear ft' },
      ],
      settings: DEFAULT_SETTINGS,
    }
    
    const result = calculateEstimate(input)
    
    expect(result.lineItems).toHaveLength(2)
    expect(result.totalAmount).toBeGreaterThan(0)
    expect(result.breakdown.totalLabor).toBeGreaterThan(0)
    expect(result.breakdown.totalMaterials).toBeGreaterThan(0)
    expect(result.breakdown.totalPermits).toBeGreaterThan(0)
    expect(result.breakdown.totalDisposal).toBeGreaterThan(0)
    
    // Total should equal sum of subtotals
    const sumOfSubtotals = result.lineItems.reduce((sum, item) => sum + item.subtotal, 0)
    expect(result.totalAmount).toBeCloseTo(sumOfSubtotals, 2)
  })
})
