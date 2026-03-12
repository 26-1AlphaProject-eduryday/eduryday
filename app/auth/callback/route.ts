import { NextResponse, type NextRequest } from 'next/server';
import {
  getDashboardPath,
  isAdminEmail,
  normalizeRole,
  normalizeStatus,
  type AppRole,
  type ProfileStatus,
} from '@/shared/lib/auth/profile';
import { getSupabaseAuthServerClient } from '@/shared/lib/supabase/auth-server';

interface ProfileRow {
  id: string;
  role: string | null;
  status: string;
}

function getRequestedRole(value: unknown): AppRole | null {
  if (value === 'student' || value === 'professor' || value === 'admin') {
    return value;
  }

  return null;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/';
  const roleFromQuery = getRequestedRole(url.searchParams.get('requested_role'));
  const supabase = await getSupabaseAuthServerClient();

  if (!supabase || !code) {
    return NextResponse.redirect(new URL('/login?error=oauth', request.url));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/login?error=oauth', request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login?error=oauth', request.url));
  }

  const email = user.email ?? '';
  const requestedRole = getRequestedRole(user.user_metadata?.requested_role) ?? roleFromQuery;
  const generatedName =
    typeof user.user_metadata?.name === 'string'
      ? user.user_metadata.name
      : email.split('@')[0] ?? '이름없음';

  const role: AppRole | null = isAdminEmail(email)
    ? 'admin'
    : requestedRole === 'admin'
      ? null
      : requestedRole;
  const status: ProfileStatus = isAdminEmail(email) ? 'active' : 'pending';

  await supabase.from('profiles').upsert(
    {
      id: user.id,
      email,
      name: generatedName,
      role,
      status,
    },
    {
      onConflict: 'id',
      ignoreDuplicates: true,
    },
  );

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>();

  const finalRole = isAdminEmail(email) ? 'admin' : normalizeRole(profile?.role);
  const finalStatus = isAdminEmail(email) ? 'active' : normalizeStatus(profile?.status);

  if (!finalRole) {
    return NextResponse.redirect(new URL('/auth/role', request.url));
  }

  if (finalStatus !== 'active') {
    return NextResponse.redirect(new URL('/pending', request.url));
  }

  const targetPath = next.startsWith('/') && !next.startsWith('//') ? next : getDashboardPath(finalRole);

  return NextResponse.redirect(new URL(targetPath, request.url));
}
