import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(['CONTRACTOR'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Get all projects without a contractor assigned (available for contractors)
    const projects = await prisma.project.findMany({
      where: {
        contractorId: null,
        status: 'PENDING', // Only show pending projects
      },
      include: {
        homeowner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ projects, success: true })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
