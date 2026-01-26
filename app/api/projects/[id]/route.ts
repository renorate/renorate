import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireUser()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        homeowner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        contractor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        estimates: {
          include: {
            lineItems: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        milestones: {
          orderBy: { dueDate: 'asc' },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this project
    if (project.homeownerId !== user.id && project.contractorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({ project, success: true })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireUser()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { contractorId, status, budget, deposit, paidAmount } = body

    // Verify project exists and user has access
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
      select: {
        homeownerId: true,
        contractorId: true,
      },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Only homeowner or assigned contractor can update
    if (existingProject.homeownerId !== user.id && existingProject.contractorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const updateData: any = {}
    if (contractorId !== undefined) updateData.contractorId = contractorId
    if (status) updateData.status = status
    if (budget !== undefined) updateData.budget = budget
    if (deposit !== undefined) updateData.deposit = deposit
    if (paidAmount !== undefined) {
      updateData.paidAmount = paidAmount
      updateData.balance = (updateData.budget || 0) - paidAmount
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
      include: {
        homeowner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contractor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ project, success: true })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}
