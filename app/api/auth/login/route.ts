import { NextRequest, NextResponse } from 'next/server'
import { signIn } from 'next-auth/react'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// This route is kept for backward compatibility but NextAuth handles login
// Client should use signIn from next-auth/react instead
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Please use NextAuth signIn. This endpoint is deprecated.',
      redirect: '/api/auth/signin'
    },
    { status: 400 }
  )
}
