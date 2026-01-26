import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  role: string
}

/**
 * Get the authenticated user from the session (for server components and API routes)
 * Returns null if not authenticated
 */
export async function getAuthedUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name!,
    role: session.user.role,
  }
}

/**
 * Require authentication for API routes
 * Returns the authenticated user or a 401 response
 */
export async function requireUser(): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await getAuthedUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return { user }
}

/**
 * Require a specific role for API routes
 * Returns the authenticated user or a 403 response
 */
export async function requireRole(
  allowedRoles: string[]
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const authResult = await requireUser()
  
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  return { user }
}

/**
 * Redirect to login if not authenticated (for server components)
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthedUser()
  
  if (!user) {
    redirect('/portal')
  }

  return user
}
