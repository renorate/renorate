'use server'

import { prisma } from '@/lib/prisma'
import { calculateLineItem, calculateEstimateTotal } from '@/lib/calculations'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const estimateSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientPhone: z.string().min(1, 'Phone is required'),
  clientEmail: z.string().email('Valid email is required'),
  address: z.string().min(1, 'Address is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  projectType: z.string().min(1, 'Project type is required'),
})

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  notes: z.string().optional(),
})

export async function createEstimate(formData: FormData) {
  try {
    const estimateData = estimateSchema.parse({
      clientName: formData.get('clientName'),
      clientPhone: formData.get('clientPhone'),
      clientEmail: formData.get('clientEmail'),
      address: formData.get('address'),
      zipCode: formData.get('zipCode'),
      projectType: formData.get('projectType'),
    })

    const lineItemsData = JSON.parse(formData.get('lineItems') as string || '[]')
    
    if (!Array.isArray(lineItemsData) || lineItemsData.length === 0) {
      return { success: false, error: 'Please add at least one line item' }
    }
    
    // Validate line items
    const validatedLineItems = lineItemsData.map((item: any) =>
      lineItemSchema.parse(item)
    )

    // Calculate costs for each line item
    const calculatedLineItems = await Promise.all(
      validatedLineItems.map(async (item: any) => {
        const costs = await calculateLineItem(
          estimateData.projectType,
          item.quantity,
          item.unit,
          item.description
        )
        return {
          ...item,
          ...costs,
        }
      })
    )

    const totalAmount = await calculateEstimateTotal(calculatedLineItems)

    // Create estimate with line items
    const estimate = await prisma.estimate.create({
      data: {
        ...estimateData,
        totalAmount,
        lineItems: {
          create: calculatedLineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            notes: item.notes || null,
            laborCost: item.laborCost,
            materialCost: item.materialCost,
            permitCost: item.permitCost,
            disposalCost: item.disposalCost,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    })

    revalidatePath('/estimates')
    return { success: true, estimate }
  } catch (error) {
    console.error('Error creating estimate:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create estimate. Please check that the database is set up correctly.' }
  }
}

export async function updateEstimate(id: string, formData: FormData) {
  try {
    const estimateData = estimateSchema.parse({
      clientName: formData.get('clientName'),
      clientPhone: formData.get('clientPhone'),
      clientEmail: formData.get('clientEmail'),
      address: formData.get('address'),
      zipCode: formData.get('zipCode'),
      projectType: formData.get('projectType'),
    })

    const lineItemsData = JSON.parse(formData.get('lineItems') as string || '[]')
    const validatedLineItems = lineItemsData.map((item: any) =>
      lineItemSchema.parse(item)
    )

    // Delete existing line items
    await prisma.lineItem.deleteMany({
      where: { estimateId: id },
    })

    // Calculate costs for each line item
    const calculatedLineItems = await Promise.all(
      validatedLineItems.map(async (item: any) => {
        const costs = await calculateLineItem(
          estimateData.projectType,
          item.quantity,
          item.unit,
          item.description
        )
        return {
          ...item,
          ...costs,
        }
      })
    )

    const totalAmount = await calculateEstimateTotal(calculatedLineItems)

    // Update estimate
    const estimate = await prisma.estimate.update({
      where: { id },
      data: {
        ...estimateData,
        totalAmount,
        lineItems: {
          create: calculatedLineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            notes: item.notes,
            laborCost: item.laborCost,
            materialCost: item.materialCost,
            permitCost: item.permitCost,
            disposalCost: item.disposalCost,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    })

    revalidatePath('/estimates')
    revalidatePath(`/estimate/${id}`)
    return { success: true, estimate }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Failed to update estimate' }
  }
}

export async function getEstimate(id: string) {
  try {
    const estimate = await prisma.estimate.findUnique({
      where: { id },
      include: {
        lineItems: true,
      },
    })
    return estimate
  } catch (error) {
    return null
  }
}

export async function getAllEstimates() {
  try {
    const estimates = await prisma.estimate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lineItems: true,
      },
    })
    return estimates
  } catch (error) {
    return []
  }
}

export async function deleteEstimate(id: string) {
  try {
    await prisma.estimate.delete({
      where: { id },
    })
    revalidatePath('/estimates')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete estimate' }
  }
}

export async function getSettings() {
  let settings = await prisma.settings.findUnique({
    where: { id: 'default' },
  })
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
  return settings
}

export async function updateSettings(formData: FormData) {
  try {
    const defaultMarkup = parseFloat(formData.get('defaultMarkup') as string)
    const laborRate = parseFloat(formData.get('laborRate') as string)
    const permitFeeEnabled = formData.get('permitFeeEnabled') === 'true'

    if (isNaN(defaultMarkup) || defaultMarkup < 0) {
      return { success: false, error: 'Invalid markup percentage' }
    }
    if (isNaN(laborRate) || laborRate < 0) {
      return { success: false, error: 'Invalid labor rate' }
    }

    let settings = await prisma.settings.findUnique({
      where: { id: 'default' },
    })
    if (settings) {
      settings = await prisma.settings.update({
        where: { id: 'default' },
        data: {
          defaultMarkup: defaultMarkup / 100, // Convert percentage to decimal
          laborRate,
          permitFeeEnabled,
        },
      })
    } else {
      settings = await prisma.settings.create({
        data: {
          id: 'default',
          defaultMarkup: defaultMarkup / 100,
          laborRate,
          permitFeeEnabled,
        },
      })
    }

    revalidatePath('/settings')
    return { success: true, settings }
  } catch (error) {
    return { success: false, error: 'Failed to update settings' }
  }
}
