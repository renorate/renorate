'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      if (requiredRole === 'HOMEOWNER') {
        router.push('/portal/homeowner/login')
      } else if (requiredRole === 'CONTRACTOR') {
        router.push('/portal/contractor/login')
      } else {
        router.push('/portal')
      }
    } else if (status === 'authenticated' && requiredRole && session?.user?.role !== requiredRole) {
      // Wrong role, redirect to appropriate login
      if (requiredRole === 'HOMEOWNER') {
        router.push('/portal/homeowner/login')
      } else if (requiredRole === 'CONTRACTOR') {
        router.push('/portal/contractor/login')
      }
    }
  }, [status, session, requiredRole, router])

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name!,
        role: session.user.role,
      }
    : null

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}
