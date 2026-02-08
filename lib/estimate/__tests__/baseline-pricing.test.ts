/**
 * Tests for shed/utility building baseline pricing calculator
 */

import { describe, it, expect } from 'vitest'
import {
  computeShedEstimate,
  applyTaxAndContingency,
  type ShedInputs,
} from '../baseline-pricing'

describe('computeShedEstimate', () => {
  const baseInputs: ShedInputs = {
    widthFt: 10,
    lengthFt: 12,
    heightFt: 8,
    roofType: 'metal',
    windowCount: 1,
    doorCount: 1,
    sidingType: 'vinyl',
  }

  it('returns line items and totals for default dimensions', () => {
    const result = computeShedEstimate(baseInputs)
    expect(result.lineItems.length).toBeGreaterThan(5)
    expect(result.materialsSubtotal).toBeGreaterThan(0)
    expect(result.totalAmount).toBeGreaterThanOrEqual(result.materialsSubtotal)
    expect(result.contingencyPercent).toBe(10)
  })

  it('increases total when dimensions increase', () => {
    const small = computeShedEstimate({ ...baseInputs, widthFt: 8, lengthFt: 8 })
    const large = computeShedEstimate({ ...baseInputs, widthFt: 20, lengthFt: 24 })
    expect(large.materialsSubtotal).toBeGreaterThan(small.materialsSubtotal)
  })

  it('includes window and door line items when count > 0', () => {
    const withOpenings = computeShedEstimate({ ...baseInputs, windowCount: 2, doorCount: 1 })
    const windowItem = withOpenings.lineItems.find((i) => i.description.toLowerCase().includes('window'))
    const doorItem = withOpenings.lineItems.find((i) => i.description.toLowerCase().includes('door'))
    expect(windowItem).toBeDefined()
    expect(windowItem?.quantity).toBe(2)
    expect(doorItem).toBeDefined()
    expect(doorItem?.quantity).toBe(1)
  })

  it('applies contingency to subtotal', () => {
    const result = computeShedEstimate(baseInputs)
    const expectedContingency = Math.round(result.materialsSubtotal * 0.1 * 100) / 100
    expect(result.contingencyAmount).toBe(expectedContingency)
    expect(result.totalAmount).toBe(result.materialsSubtotal + result.contingencyAmount)
  })
})

describe('applyTaxAndContingency', () => {
  it('applies tax when enabled', () => {
    const { salesTaxAmount, totalAmount } = applyTaxAndContingency(1000, true, 0.07, 10)
    expect(salesTaxAmount).toBe(70)
    expect(totalAmount).toBe(1000 + 70 + 100) // subtotal + tax + 10% contingency
  })

  it('no tax when disabled', () => {
    const { salesTaxAmount, contingencyAmount, totalAmount } = applyTaxAndContingency(
      1000,
      false,
      0.07,
      10
    )
    expect(salesTaxAmount).toBe(0)
    expect(contingencyAmount).toBe(100)
    expect(totalAmount).toBe(1100)
  })

  it('respects contingency percent', () => {
    const { contingencyAmount, totalAmount } = applyTaxAndContingency(1000, false, 0, 15)
    expect(contingencyAmount).toBe(150)
    expect(totalAmount).toBe(1150)
  })
})
