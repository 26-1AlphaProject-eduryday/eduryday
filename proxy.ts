import { NextResponse, type NextRequest } from 'next/server';
import {
  getDashboardPath,
  isAdminEmail,
  normalizeRole,
  normalizeStatus,
  type AppRole,
} from '@/shared/lib/auth/profile';
import { getSupabaseMiddlewareClient } from '@/shared/lib/supabase/auth-middleware';

interface ProfileRow {
  email: string;
  role: string | null;
  status: string | null;
}

const PUBLIC_API_ROUTES = new Set(['/api/v1/health']);

function isPublicPath(pathname: string) {
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/auth/callback',
    '/auth/role',
    '/pending',
  ];

  return publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function requiredRole(pathname: string): AppRole | null {
  if (pathname.startsWith('/admin')) {
    return 'admin';
  }

  if (pathname.startsWith('/professor')) {
    return 'professor';
  }

  if (pathname.startsWith('/student')) {
    return 'student';
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, response } = getSupabaseMiddlewareClient(request);

  if (!supabase) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const needRole = requiredRole(pathname);
  const isProtectedApi = pathname.startsWith('/api/v1') && !PUBLIC_API_ROUTES.has(pathname);

  if (!user) {
    if (isProtectedApi) {
      return NextResponse.json(
        { ok: false, code: 'UNAUTHORIZED', message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    if (needRole) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, role, status')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>();

  const email = user.email ?? profile?.email ?? '';
  const role = isAdminEmail(email) ? 'admin' : normalizeRole(profile?.role);
  const status = isAdminEmail(email) ? 'active' : normalizeStatus(profile?.status);

  // Legacy auth/role → signup
  if (pathname === '/auth/role') {
    return NextResponse.redirect(new URL('/signup', request.url));
  }

  // API routes handle their own auth — skip all role/status redirects
  if (pathname.startsWith('/api/')) {
    return response;
  }

  // Public paths: only redirect active users away from login/signup
  if (isPublicPath(pathname)) {
    if (role && status === 'active' && (pathname === '/login' || pathname === '/signup' || pathname === '/pending')) {
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
    }
    return response;
  }

  // --- Protected page routes below ---

  if (!role) {
    return NextResponse.redirect(new URL('/signup', request.url));
  }

  if (status === 'suspended') {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login?error=suspended', request.url));
  }

  if (status === 'pending') {
    return NextResponse.redirect(new URL('/pending', request.url));
  }

  if (needRole && needRole !== role) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
