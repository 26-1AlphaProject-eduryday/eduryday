'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

function LogoMark() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200">
        <div className="h-5 w-5 rounded-sm bg-gray-500" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">EduRyday</h1>
      <p className="mt-2 text-sm text-gray-600">AI 기반 통합 교육 플랫폼</p>
    </div>
  );
}

function LoginCard() {
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
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-900">로그인</h2>

      {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <div className="h-5 w-5 rounded border-2 border-dashed border-gray-300 bg-gray-200" />
        {isSubmitting ? '처리 중...' : 'Google로 계속하기'}
      </button>
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
          계정이 없으신가요?{' '}
          <Link
            href="/signup"
            className="font-medium text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            신청하기
          </Link>
        </p>
      </div>
    </div>
  );
}
