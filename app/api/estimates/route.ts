import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(['CONTRACTOR'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const estimates = await prisma.estimate.findMany({
      where: { contractorId: user.id },
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
