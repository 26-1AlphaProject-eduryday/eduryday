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

  if (!user) {
    if (needRole) {
      return NextResponse.redirect(new URL('/login', request.url));
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

  if (status === 'pending' && pathname !== '/pending' && !pathname.startsWith('/auth/role')) {
    return NextResponse.redirect(new URL('/pending', request.url));
  }

  if (status === 'suspended') {
    return NextResponse.redirect(new URL('/login?error=suspended', request.url));
  }

  if (!role && pathname !== '/auth/role' && pathname !== '/pending') {
    return NextResponse.redirect(new URL('/auth/role', request.url));
  }

  if (needRole && role && needRole !== role) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  if ((pathname === '/login' || pathname === '/signup') && role && status === 'active') {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  if (!isPublicPath(pathname) && !needRole) {
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
