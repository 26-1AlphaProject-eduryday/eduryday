import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isAdminEmail, normalizeRole, normalizeStatus, type AppRole, type ProfileStatus } from '@/shared/lib/auth/profile';

export interface RouteAuthContext {
  supabase: SupabaseClient;
  userId: string;
  email: string;
  role: AppRole | null;
  status: ProfileStatus;
}

interface ProfileRow {
  email: string;
  role: string | null;
  status: string | null;
}

export async function getRouteSupabaseClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });
}

export async function getRouteAuthContext(): Promise<RouteAuthContext | null> {
  const supabase = await getRouteSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, role, status')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>();

  const email = user.email ?? profile?.email ?? '';
  const role = isAdminEmail(email) ? 'admin' : normalizeRole(profile?.role);
  const status = isAdminEmail(email) ? 'active' : normalizeStatus(profile?.status);

  return {
    supabase,
    userId: user.id,
    email,
    role,
    status,
  };
}

export function getServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
