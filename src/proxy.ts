import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const authRoutes = ['/sign-in', '/sign-up']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(getSessionCookie(request))

  if (hasSession && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!hasSession && pathname.startsWith('/favorites')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/favorites', '/favorites/:path*', '/sign-in', '/sign-up'],
}
