import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Allow login page to be accessed without authentication
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // For other routes, check if token exists in cookies or header
  const token = request.cookies.get('authToken')?.value;

  // If no token and trying to access protected routes, redirect to login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/bills/:path*']
};
