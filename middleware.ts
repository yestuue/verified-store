import { NextRequest, NextResponse } from 'next/server';

/**
 * Route Guard Rules
 * ─────────────────────────────────────────────────────────────────
 * /login          → already logged in?  → redirect to correct dest
 * /admin          → not admin?          → redirect to /dashboard (or /login)
 * /dashboard      → not logged in?      → redirect to /login
 *                   is admin?           → redirect to /admin
 * ─────────────────────────────────────────────────────────────────
 */

function getSession(request: NextRequest): { id: string; email: string; is_admin: boolean } | null {
  const cookie = request.cookies.get('session_user')?.value;
  if (!cookie) return null;
  try {
    return JSON.parse(cookie);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSession(request);
  const isLoggedIn = !!session;
  const isAdmin   = session?.is_admin === true;

  // ── /login ────────────────────────────────────────────────────
  // Logged-in users who visit /login get sent to their destination
  if (pathname === '/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(isAdmin ? '/admin' : '/dashboard', request.url)
      );
    }
    return NextResponse.next();
  }

  // ── /admin ────────────────────────────────────────────────────
  // Requires: logged in AND is_admin === true
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname); // optional: preserve return path
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      // Regular user trying to access admin → send to their own dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ── /dashboard ───────────────────────────────────────────────
  // Requires: logged in
  // Admins get a gentle nudge to their own panel (but are NOT hard-blocked)
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin) {
      // Admin landed on /dashboard — send them home to /admin
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Only run middleware on these paths — skip static files and API routes
export const config = {
  matcher: ['/login', '/admin/:path*', '/dashboard/:path*'],
};
