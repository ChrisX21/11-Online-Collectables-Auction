import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be protected
const protectedPaths = ['/protected/dashboard', '/protected/profile', '/protected/settings'];
// Add paths that should be accessible only to non-authenticated users
const authPaths = ['/auth/sign-in', '/auth/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if JWT token exists
  const hasJwtToken = request.cookies.has('jwt');

  // Redirect authenticated users away from auth pages
  if (authPaths.some(path => pathname.startsWith(path)) && hasJwtToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect routes that require authentication
  if (protectedPaths.some(path => pathname.startsWith(path)) && !hasJwtToken) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedPaths, ...authPaths],
}; 