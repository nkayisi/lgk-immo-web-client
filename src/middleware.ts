import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes publiques (accessibles sans authentification)
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']

// Routes protégées (nécessitent authentification)
const PROTECTED_ROUTES = ['/account', '/profile', '/listings', '/onboarding']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  
  // Check for better-auth session cookie (with lgk_auth prefix)
  // En production avec useSecureCookies: true, le cookie a le préfixe __Secure-
  const sessionCookie = request.cookies.get('lgk_auth.session_token') 
    || request.cookies.get('__Secure-lgk_auth.session_token')
  const isAuthenticated = !!sessionCookie
  
  // Redirect authenticated users away from auth pages (except verify-email)
  if (isAuthenticated && isPublicRoute && !pathname.startsWith('/verify-email')) {
    return NextResponse.redirect(new URL('/account', request.url))
  }
  
  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
