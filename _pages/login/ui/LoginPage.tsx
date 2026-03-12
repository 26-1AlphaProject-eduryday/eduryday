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
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200">
        <span className="text-xs text-gray-700">Logo</span>
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
      <span className="text-sm text-gray-600">또는</span>
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setErrorMessage('Supabase 환경변수가 누락되었습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.user) {
        setErrorMessage(error?.message ?? '로그인에 실패했습니다.');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status, email')
        .eq('id', data.user.id)
        .maybeSingle<ProfileRow>();

      const profileEmail = data.user.email ?? profile?.email ?? '';
      const role: AppRole | null = isAdminEmail(profileEmail) ? 'admin' : normalizeRole(profile?.role);
      const status = isAdminEmail(profileEmail) ? 'active' : normalizeStatus(profile?.status);

      if (!role) {
        router.replace('/auth/role');
        return;
      }

      if (status === 'pending') {
        router.replace('/pending');
        return;
      }

      if (status === 'suspended') {
        setErrorMessage('정지된 계정입니다. 관리자에게 문의해주세요.');
        await supabase.auth.signOut();
        return;
      }

      router.replace(getDashboardPath(role));
    } finally {
      setIsSubmitting(false);
    }
  }

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

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@kookmin.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            autoComplete="current-password"
            required
          />
        </div>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-gray-800 active:bg-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? '처리 중...' : '로그인'}
        </button>
      </form>

      <Divider />

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <div className="h-5 w-5 rounded border-2 border-dashed border-gray-300 bg-gray-200" />
        Google로 계속하기
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
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
