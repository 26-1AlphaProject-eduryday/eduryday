'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  getDashboardPath,
  isAdminEmail,
  normalizeRole,
  normalizeStatus,
  type AppRole,
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

function Divider() {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-sm text-gray-600">Google 계정 사용</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

interface ProfileRow {
  role: string | null;
  status: string | null;
  email: string;
}

function LoginCard() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleGoogleLogin() {
    setErrorMessage('');

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setErrorMessage('Supabase 환경변수가 누락되었습니다.');
      return;
    }

    setIsSubmitting(true);

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status, email')
      .eq('id', user.id)
      .maybeSingle<ProfileRow>();

    const profileEmail = user.email ?? profile?.email ?? '';
    const role: AppRole | null = isAdminEmail(profileEmail) ? 'admin' : normalizeRole(profile?.role);
    const status = isAdminEmail(profileEmail) ? 'active' : normalizeStatus(profile?.status);

    if (status === 'suspended') {
      setErrorMessage('정지된 계정입니다. 관리자에게 문의해주세요.');
      await supabase.auth.signOut();
      setIsSubmitting(false);
      return;
    }

    if (!role) {
      router.replace('/signup');
      return;
    }

    if (status === 'pending') {
      router.replace('/pending');
      return;
    }

    router.replace(getDashboardPath(role));
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-center text-xl font-bold text-gray-900">Google로 로그인</h2>
      <p className="mb-6 text-center text-sm text-gray-500">
        Google 계정으로 로그인한 뒤 가입 신청서를 작성하고 관리자 승인을 받아 서비스를 이용합니다.
      </p>

      {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}

      <Divider />

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <div className="h-5 w-5 rounded bg-gray-300" />
        Google로 계속하기
      </button>

      <p className="mt-6 text-center text-xs text-gray-500">
        최초 로그인 시 가입 신청서에서 역할과 소속 정보를 입력해야 합니다.
      </p>
    </div>
  );
}

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <LogoMark />
        <LoginCard />

        <p className="mt-6 text-center text-gray-600">
          아직 신청하지 않으셨나요?{' '}
          <Link
            href="/signup"
            className="font-medium text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            가입 신청
          </Link>
        </p>
      </div>
    </div>
  );
}
