import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const milestoneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  isCompleted: z.boolean().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireUser()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: {
        homeownerId: true,
        contractorId: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.homeownerId !== user.id && project.contractorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = milestoneSchema.parse(body)

    const milestone = await prisma.milestone.create({
      data: {
        projectId: params.id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        isCompleted: data.isCompleted || false,
      },
    })

    return NextResponse.json(
      { milestone, success: true },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error creating milestone:', error)
    return NextResponse.json(
      { error: 'Failed to create milestone' },
      { status: 500 }
    )
  }
}

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

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: {
        homeownerId: true,
        contractorId: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.homeownerId !== user.id && project.contractorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const milestones = await prisma.milestone.findMany({
      where: { projectId: params.id },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json({ milestones, success: true })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch milestones' },
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
    const { milestoneId, isCompleted, completedAt } = body

    if (!milestoneId) {
      return NextResponse.json(
        { error: 'Milestone ID is required' },
        { status: 400 }
      )
    }

    // Verify milestone exists and belongs to a project user has access to
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: {
          select: {
            homeownerId: true,
            contractorId: true,
          },
        },
      },
    })

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    if (milestone.project.homeownerId !== user.id && milestone.project.contractorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        isCompleted: isCompleted,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    })

    return NextResponse.json({ milestone: updatedMilestone, success: true })
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json(
      { error: 'Failed to update milestone' },
      { status: 500 }
    )
  }
}
