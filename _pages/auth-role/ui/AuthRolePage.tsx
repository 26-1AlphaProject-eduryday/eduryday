'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getDashboardPath,
  isAdminEmail,
  normalizeRole,
  normalizeStatus,
  type AppRole,
  type ProfileStatus,
} from '@/shared/lib/auth/profile';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

function LogoMark() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
        <div className="h-5 w-5 rounded-sm bg-white" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">EduRyday</h1>
      <p className="mt-2 text-sm text-gray-600">AI 기반 통합 교육 플랫폼</p>
    </div>
  );
}

interface RoleCardProps {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  disabled?: boolean;
  onClick: () => void;
}

function RoleCard({ icon, iconBg, title, description, disabled = false, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}>
        <span className="text-3xl" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mb-2 text-lg font-bold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

interface ProfileRow {
  email: string;
  role: string | null;
  status: string | null;
}

export function AuthRolePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        if (!cancelled) {
          setErrorMessage('Supabase 환경변수가 누락되었습니다.');
          setIsLoading(false);
        }
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('email, role, status')
        .eq('id', user.id)
        .maybeSingle<ProfileRow>();

      const email = user.email ?? profile?.email ?? '';
      const role = isAdminEmail(email) ? 'admin' : normalizeRole(profile?.role);
      const status = isAdminEmail(email) ? 'active' : normalizeStatus(profile?.status);

      if (!cancelled) {
        setUserEmail(email);

        if (role && status === 'active') {
          router.replace(getDashboardPath(role));
          return;
        }

        if (status === 'pending' && role) {
          router.replace('/pending');
          return;
        }

        setIsLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function selectRole(selectedRole: AppRole) {
    setErrorMessage('');

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setErrorMessage('Supabase 환경변수가 누락되었습니다.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/login');
      return;
    }

    const isAdmin = isAdminEmail(user.email);
    const role = isAdmin ? 'admin' : selectedRole === 'admin' ? null : selectedRole;
    const status: ProfileStatus = isAdmin ? 'active' : 'pending';

    setIsSubmitting(true);

    try {
      const nameFromMeta = typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : null;
      const fallbackName = user.email?.split('@')[0] ?? '이름없음';

      const { error } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          email: user.email,
          name: nameFromMeta ?? fallbackName,
          role,
          status,
        },
        { onConflict: 'id' },
      );

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (!role || status !== 'active') {
        router.replace('/pending');
        return;
      }

      router.replace(getDashboardPath(role));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
        인증 정보를 확인하는 중입니다...
      </div>
    );
  }

  const canRequestAdminRole = isAdminEmail(userEmail);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg px-4">
        <LogoMark />

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-center text-xl font-bold text-gray-900">어떤 역할로 시작하시나요?</h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            역할에 맞는 기능과 UI를 제공합니다. 승인 후에는 관리자만 역할을 변경할 수 있습니다.
          </p>

          {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RoleCard
              icon="📚"
              iconBg="bg-blue-50"
              title="학생"
              description="강좌 수강, 과제 제출, AI 튜터 이용"
              onClick={() => selectRole('student')}
              disabled={isSubmitting}
            />
            <RoleCard
              icon="🎓"
              iconBg="bg-green-50"
              title="교수"
              description="강좌 관리, 과제 출제, AI 채점"
              onClick={() => selectRole('professor')}
              disabled={isSubmitting}
            />
            <RoleCard
              icon="🛠"
              iconBg="bg-red-50"
              title="관리자"
              description="운영 관리, 사용자 승인"
              onClick={() => selectRole('admin')}
              disabled={isSubmitting || !canRequestAdminRole}
            />
          </div>

          <p className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
            관리자 계정은 지정된 관리자 이메일에서만 활성화됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
