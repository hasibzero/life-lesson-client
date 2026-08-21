import { NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthRoute = pathname === '/signin' || pathname === '/signup';

  // Condition 1: Redirect logged-in users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Condition 2: Redirect unauthenticated users away from protected routes
  if (!session && !isAuthRoute) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If there is no session and they are on an auth route, let them proceed to log in
  if (!session) {
    return NextResponse.next();
  }

  const user = session.user;

  // Condition 3: Protect Admin-only routes
  if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard/user/overview', request.url));
  }

  // Condition 4: Protect User-only routes from Admins (Optional)
  if (pathname.startsWith('/dashboard/user') && user.role === 'admin') {
    return NextResponse.redirect(new URL('/dashboard/admin/overview', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/profile/:path*",
    "/pricing", 
    "/success",
    "/cancel",
    "/signin", // Added to intercept logged-in users
    "/signup"  // Added to intercept logged-in users
  ],
};