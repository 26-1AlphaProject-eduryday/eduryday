import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseMiddlewareClient } from '@/shared/lib/supabase/auth-middleware';

const PUBLIC_ROUTES = new Set(['/', '/login', '/signup', '/forgot-password', '/auth/callback', '/auth/role', '/pending']);
const PUBLIC_API_ROUTES = new Set(['/api/v1/health']);

const PROTECTED_PREFIXES = ['/student', '/professor', '/admin'];
const PROTECTED_API_PREFIX = '/api/v1';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedPage = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isProtectedApi = pathname.startsWith(PROTECTED_API_PREFIX) && !PUBLIC_API_ROUTES.has(pathname);

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  // Get Supabase client for middleware
  const { supabase, response } = getSupabaseMiddlewareClient(request);

  if (!supabase) {
    // Supabase not configured — allow through in development
    return response;
  }

  // Check session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Unauthenticated
    if (isProtectedApi) {
      return NextResponse.json(
        { ok: false, code: 'UNAUTHORIZED', message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check profile status for page routes (not API — API routes handle their own auth)
  if (isProtectedPage) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('status, role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      // Pending users can only access /pending
      if (profile.status === 'pending' && pathname !== '/pending') {
        const pendingUrl = request.nextUrl.clone();
        pendingUrl.pathname = '/pending';
        return NextResponse.redirect(pendingUrl);
      }

      // Suspended users get signed out
      if (profile.status === 'suspended') {
        await supabase.auth.signOut();
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('error', 'suspended');
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
