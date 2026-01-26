import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth-helpers'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  projectType: z.string().min(1, 'Project type is required'),
  address: z.string().min(1, 'Address is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  budget: z.number().min(0).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(['HOMEOWNER'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const data = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        projectType: data.projectType,
        address: data.address,
        zipCode: data.zipCode,
        budget: data.budget || 0,
        homeownerId: user.id,
        status: 'PENDING',
      },
      include: {
        homeowner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      { project, success: true },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
