import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
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
        estimate: {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { contractorId, status, budget, deposit, paidAmount } = body

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
      where: { id },
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
