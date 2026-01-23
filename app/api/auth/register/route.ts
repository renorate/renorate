import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['HOMEOWNER', 'CONTRACTOR']),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const user = await createUser(
      data.email,
      data.password,
      data.name,
      data.role,
      data.phone
    )

    // Create subscription for new user
    await prisma.subscription.create({
      data: {
        userId: user.id,
        status: 'FREE',
      },
    })

    // Create contractor profile if role is CONTRACTOR
    if (data.role === 'CONTRACTOR') {
      await prisma.contractorProfile.create({
        data: {
          userId: user.id,
          isVerified: false, // Will be verified by admin later
        },
      })
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, success: true },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
