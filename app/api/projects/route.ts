import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireUser()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || user.role
    const userId = user.id

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    let projects
    if (role === 'HOMEOWNER') {
      projects = await prisma.project.findMany({
        where: { homeownerId: userId },
        include: {
          contractor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          estimates: {
            select: {
              id: true,
              totalAmount: true,
            },
          },
          _count: {
            select: {
              messages: true,
              milestones: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else if (role === 'CONTRACTOR') {
      projects = await prisma.project.findMany({
        where: { contractorId: userId },
        include: {
          homeowner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          estimates: {
            select: {
              id: true,
              totalAmount: true,
            },
          },
          _count: {
            select: {
              messages: true,
              milestones: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    return NextResponse.json({ projects, success: true })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
