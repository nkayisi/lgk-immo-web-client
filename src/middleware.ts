import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']
const PROTECTED_ROUTES = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  
  // Check for better-auth session cookie (with lgk_auth prefix)
  const sessionCookie = request.cookies.get('lgk_auth.session_token')
  const isAuthenticated = !!sessionCookie
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
