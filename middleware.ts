import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Handle canonical domain redirect (www -> non-www)
    const hostname = req.headers.get('host') || ''
    const isProduction = process.env.NODE_ENV === 'production'
    const canonicalDomain = 'renorate.net'

    if (isProduction && hostname === `www.${canonicalDomain}`) {
      const url = req.nextUrl.clone()
      url.hostname = canonicalDomain
      return NextResponse.redirect(url, 301)
    }

    // Redirect HTTP to HTTPS in production
    if (isProduction && req.nextUrl.protocol === 'http:') {
      const url = req.nextUrl.clone()
      url.protocol = 'https:'
      return NextResponse.redirect(url, 301)
    }

    // Role-based route protection
    if (pathname.startsWith('/portal/homeowner')) {
      if (!token || token.role !== 'HOMEOWNER') {
        return NextResponse.redirect(new URL('/portal/homeowner/login', req.url))
      }
    }

    if (pathname.startsWith('/portal/contractor')) {
      if (!token || token.role !== 'CONTRACTOR') {
        return NextResponse.redirect(new URL('/portal/contractor/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes that don't require auth
        const publicRoutes = [
          '/',
          '/portal',
          '/portal/homeowner/login',
          '/portal/contractor/login',
          '/api/auth',
          '/estimate',
        ]

        // Check if route is public
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }

        // Protected routes require token
        if (pathname.startsWith('/portal/')) {
          return !!token
        }

        // API routes (except auth) require token
        if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
