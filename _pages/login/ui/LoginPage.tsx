'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------

function LogoMark() {
  return (
    <div className="mb-8 text-center">
      {/* Logo placeholder */}
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200">
        <span className="text-xs text-gray-700">Logo</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-700">EduRyday</h1>
      <p className="mt-2 text-sm text-gray-700">AI 기반 통합 교육 플랫폼</p>
    </div>
  );
}

function Divider() {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-sm text-gray-700">또는</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login card
// ---------------------------------------------------------------------------

function LoginCard() {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-700">로그인</h2>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="example@kookmin.ac.kr"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            비밀번호
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-gray-700 hover:underline"
          >
            비밀번호 찾기
          </Link>
        </div>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          autoComplete="current-password"
        />
      </div>

      {/* Primary login button */}
      <button
        type="button"
        onClick={() => router.push('/student/dashboard')}
        className="mb-6 w-full rounded-lg bg-gray-800 py-3 font-medium text-white transition-colors hover:bg-gray-700 active:bg-gray-900"
      >
        로그인
      </button>

      <Divider />

      {/* Social login buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.push('/auth/role')}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 text-gray-700 transition-colors hover:bg-gray-50"
        >
          {/* Google icon placeholder */}
          <div className="h-5 w-5 rounded border-2 border-dashed border-gray-300 bg-gray-200" />
          Google로 계속하기
        </button>

        <button
          type="button"
          onClick={() => router.push('/student/dashboard')}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 text-gray-700 transition-colors hover:bg-gray-50"
        >
          {/* School icon placeholder */}
          <div className="h-5 w-5 rounded border-2 border-dashed border-gray-300 bg-gray-200" />
          학교 계정으로 로그인
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <LogoMark />
        <LoginCard />

        {/* Sign-up link */}
        <p className="mt-6 text-center text-gray-700">
          계정이 없으신가요?{' '}
          <Link
            href="/signup"
            className="font-medium text-gray-800 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
