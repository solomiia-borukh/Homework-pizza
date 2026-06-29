import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './pkg/locale'

const authRoutes = ['/sign-in', '/sign-up']

export function proxy(request: NextRequest) {
  const i18nRes = createMiddleware(routing)(request)

  const { pathname } = request.nextUrl
  const hasSession = Boolean(getSessionCookie(request))

  if (hasSession && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!hasSession && pathname.startsWith('/favorites')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return i18nRes
}

export const config = {
  matcher: [
    '/((?!api|_next|_next/static|_next/image|_vercel|static|.well-known|fonts|sitemap|images|icons|robots|webmanifest|.*\\.xml$|.*\\.webp$|.*\\.avif$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.ico$|.*\\.svg$|.*\\.txt$|.*\\.js$|.*\\.css$).*)',
  ],
}
