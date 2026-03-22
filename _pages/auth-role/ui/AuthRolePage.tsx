'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  getDashboardPath,
  isAdminEmail,
  normalizeRole,
  normalizeStatus,
} from '@/shared/lib/auth/profile';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

interface ProfileRow {
  email: string;
  role: string | null;
  status: string | null;
}

export function AuthRolePage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        if (!cancelled) router.replace('/signup');
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) router.replace('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('email, role, status')
        .eq('id', user.id)
        .maybeSingle<ProfileRow>();

      if (!cancelled) {
        const email = user.email ?? profile?.email ?? '';
        const role = isAdminEmail(email) ? 'admin' : normalizeRole(profile?.role);
        const status = isAdminEmail(email) ? 'active' : normalizeStatus(profile?.status);

        if (role && status === 'active') {
          router.replace(getDashboardPath(role));
          return;
        }

        if (role && status === 'pending') {
          router.replace('/pending');
          return;
        }

        router.replace('/signup');
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
      인증 정보를 확인하는 중입니다...
    </div>
  );
}

