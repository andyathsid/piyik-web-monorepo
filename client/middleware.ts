import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Protected and auth routes
  const isAuthRoute = ["/login", "/register"].includes(pathname);
  const isProtectedRoute = [
    '/dashboard',
    // '/settings',
    // '/profile',
    // '/admin',
    // '/api/protected'
  ].some(path => pathname.startsWith(path));

  // Get existing callbackUrl from the URL if it exists
  const callbackUrl = searchParams.get('callbackUrl');

  // If user has a session cookie
  if (session) {
    // Redirect from auth pages to dashboard if already authenticated
    if (isAuthRoute) {
      // If there's a callbackUrl, redirect there, otherwise go to dashboard
      if (callbackUrl) {
        return NextResponse.redirect(new URL(callbackUrl, request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // No session cookie present
  if (isProtectedRoute) {
    // Construct the login URL with the current path as the callback URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    // '/settings/:path*',
    // '/profile/:path*',
    // '/admin/:path*',  
    // '/api/protected/:path*', 
  ]
} 