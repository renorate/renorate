import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractorId = searchParams.get('contractorId')

    if (!contractorId) {
      return NextResponse.json(
        { error: 'Contractor ID is required' },
        { status: 400 }
      )
    }

    const estimates = await prisma.estimate.findMany({
      where: { contractorId },
      include: {
        lineItems: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ estimates, success: true })
  } catch (error) {
    console.error('Error fetching estimates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch estimates' },
      { status: 500 }
    )
  }
}
