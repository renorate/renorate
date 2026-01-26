/**
 * Validation functions for estimate inputs
 */

import type { LineItemInput, ProjectType } from './types'

export function validateLineItem(item: LineItemInput): { valid: boolean; error?: string } {
  if (!item.description || item.description.trim().length === 0) {
    return { valid: false, error: 'Description is required' }
  }

  if (item.quantity <= 0) {
    return { valid: false, error: 'Quantity must be greater than 0' }
  }

  if (!['sqft', 'linear ft', 'each'].includes(item.unit)) {
    return { valid: false, error: 'Invalid unit type' }
  }

  return { valid: true }
}

export function validateEstimateInput(input: {
  projectType: string
  lineItems: LineItemInput[]
}): { valid: boolean; error?: string } {
  if (!input.projectType || input.projectType.trim().length === 0) {
    return { valid: false, error: 'Project type is required' }
  }

  if (!input.lineItems || input.lineItems.length === 0) {
    return { valid: false, error: 'At least one line item is required' }
  }

  for (const item of input.lineItems) {
    const validation = validateLineItem(item)
    if (!validation.valid) {
      return validation
    }
  }

  return { valid: true }
}
