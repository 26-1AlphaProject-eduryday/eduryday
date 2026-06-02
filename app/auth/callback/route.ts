import { NextResponse, type NextRequest } from 'next/server';
import {
  getDashboardPath,
  isAdminEmail,
  normalizeRole,
  normalizeStatus,
  type ProfileStatus,
} from '@/shared/lib/auth/profile';
import { getSupabaseAuthServerClient } from '@/shared/lib/supabase/auth-server';

interface ProfileRow {
  id: string;
  role: string | null;
  status: string;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next');
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
  const generatedName =
    typeof user.user_metadata?.name === 'string'
      ? user.user_metadata.name
      : email.split('@')[0] ?? '이름없음';
  const status: ProfileStatus = isAdminEmail(email) ? 'active' : 'pending';

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>();

  // Only upsert for new users or admin email updates
  if (!existingProfile || isAdminEmail(email)) {
    const { error: upsertError } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email,
        name: generatedName,
        role: isAdminEmail(email) ? 'admin' : existingProfile?.role ?? null,
        status: isAdminEmail(email) ? 'active' : existingProfile?.status ?? status,
      },
      { onConflict: 'id' },
    );

    if (upsertError) {
      return NextResponse.redirect(new URL('/login?error=profile', request.url));
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    return NextResponse.redirect(new URL('/login?error=profile', request.url));
  }

  const finalRole = isAdminEmail(email) ? 'admin' : normalizeRole(profile?.role);
  const finalStatus = isAdminEmail(email) ? 'active' : normalizeStatus(profile?.status);

  if (!finalRole) {
    return NextResponse.redirect(new URL('/signup', request.url));
  }

  if (finalStatus !== 'active') {
    return NextResponse.redirect(new URL('/pending', request.url));
  }

  const targetPath = next?.startsWith('/') && !next.startsWith('//') ? next : getDashboardPath(finalRole);

  return NextResponse.redirect(new URL(targetPath, request.url));
}
