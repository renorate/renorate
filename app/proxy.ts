import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Next.js 16 proxy.ts - handles routing only (redirects, rewrites, headers)
// Authentication is handled in layouts and route handlers
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle canonical domain redirect (www -> non-www)
  const hostname = request.headers.get('host') || ''
  const isProduction = process.env.NODE_ENV === 'production'
  const canonicalDomain = 'renorate.net'

  if (isProduction && hostname === `www.${canonicalDomain}`) {
    const url = request.nextUrl.clone()
    url.hostname = canonicalDomain
    return NextResponse.redirect(url, 301)
  }

  // Redirect HTTP to HTTPS in production
  if (isProduction && request.nextUrl.protocol === 'http:') {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  // Note: Authentication checks are now handled in:
  // - Layout guards (app/portal/*/layout.tsx)
  // - Route handlers (app/api/**/route.ts)
  // - Server components using getServerSession()

  return NextResponse.next()
}

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
