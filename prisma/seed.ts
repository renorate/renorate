import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default settings if they don't exist
  const existingSettings = await prisma.settings.findUnique({
    where: { id: 'default' },
  })

  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        id: 'default',
        defaultMarkup: 0.25,
        laborRate: 75.0,
        permitFeeEnabled: true,
      },
    })
  }

  // Create sample estimate 1
  const estimate1 = await prisma.estimate.create({
    data: {
      clientName: 'John Smith',
      clientPhone: '(555) 123-4567',
      clientEmail: 'john.smith@email.com',
      address: '123 Main Street',
      zipCode: '12345',
      projectType: 'Kitchen',
      totalAmount: 0,
      lineItems: {
        create: [
          {
            description: 'Install new cabinets',
            quantity: 20,
            unit: 'linear ft',
            notes: 'White shaker style',
            laborCost: 1400.0,
            materialCost: 1200.0,
            permitCost: 39.0,
            disposalCost: 84.0,
            subtotal: 2723.0,
          },
          {
            description: 'Install countertops',
            quantity: 30,
            unit: 'sqft',
            notes: 'Quartz material',
            laborCost: 2250.0,
            materialCost: 2812.5,
            permitCost: 75.9,
            disposalCost: 196.88,
            subtotal: 5335.28,
          },
          {
            description: 'Install new flooring',
            quantity: 200,
            unit: 'sqft',
            notes: 'Hardwood flooring',
            laborCost: 900.0,
            materialCost: 750.0,
            permitCost: 24.75,
            disposalCost: 52.5,
            subtotal: 1727.25,
          },
        ],
      },
    },
    include: {
      lineItems: true,
    },
  })

  // Calculate and update total
  const total1 = estimate1.lineItems.reduce((sum, item) => sum + item.subtotal, 0)
  await prisma.estimate.update({
    where: { id: estimate1.id },
    data: { totalAmount: total1 },
  })

  // Create sample estimate 2
  const estimate2 = await prisma.estimate.create({
    data: {
      clientName: 'Sarah Johnson',
      clientPhone: '(555) 987-6543',
      clientEmail: 'sarah.j@email.com',
      address: '456 Oak Avenue',
      zipCode: '67890',
      projectType: 'Bathroom',
      totalAmount: 0,
      lineItems: {
        create: [
          {
            description: 'Install new bathtub',
            quantity: 1,
            unit: 'each',
            notes: 'Standard size, white',
            laborCost: 550.0,
            materialCost: 825.0,
            permitCost: 20.63,
            disposalCost: 57.75,
            subtotal: 1453.38,
          },
          {
            description: 'Install tile flooring',
            quantity: 50,
            unit: 'sqft',
            notes: 'Ceramic tile',
            laborCost: 212.5,
            materialCost: 187.5,
            permitCost: 6.0,
            disposalCost: 13.13,
            subtotal: 419.13,
          },
          {
            description: 'Install vanity and sink',
            quantity: 1,
            unit: 'each',
            notes: '36 inch vanity',
            laborCost: 550.0,
            materialCost: 990.0,
            permitCost: 23.1,
            disposalCost: 69.3,
            subtotal: 1632.4,
          },
        ],
      },
    },
    include: {
      lineItems: true,
    },
  })

  // Calculate and update total
  const total2 = estimate2.lineItems.reduce((sum, item) => sum + item.subtotal, 0)
  await prisma.estimate.update({
    where: { id: estimate2.id },
    data: { totalAmount: total2 },
  })

  console.log('Seed data created successfully!')
  console.log(`Created ${estimate1.id} and ${estimate2.id}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
