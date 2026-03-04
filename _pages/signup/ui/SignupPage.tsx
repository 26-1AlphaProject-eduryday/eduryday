'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------

function LogoMark() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200">
        <span className="text-xs text-gray-700">Logo</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-700">EduRyday</h1>
      <p className="mt-2 text-sm text-gray-500">AI 기반 통합 교육 플랫폼</p>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-sm text-gray-500">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Signup card
// ---------------------------------------------------------------------------

function SignupCard() {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-center text-xl font-bold text-gray-700">회원가입</h2>
      <p className="mb-8 text-center text-sm text-gray-500">
        국민대학교 구성원이라면 무료로 시작하세요
      </p>

      {/* OAuth buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.push('/auth/role')}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <div className="h-5 w-5 rounded-full border-2 border-dashed border-gray-300 bg-gray-200" />
          Google 계정으로 시작하기
        </button>

        <button
          type="button"
          onClick={() => router.push('/auth/role')}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <div className="h-5 w-5 rounded-full border-2 border-dashed border-gray-300 bg-gray-200" />
          학교 계정(@kookmin.ac.kr)으로 시작하기
        </button>
      </div>

      <Divider label="또는 직접 입력" />

      {/* Email / password form */}
      <div className="space-y-3">
        <input
          type="email"
          placeholder="이메일"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="비밀번호 (8자 이상)"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          autoComplete="new-password"
        />
      </div>

      <button
        type="button"
        onClick={() => router.push('/auth/role')}
        className="mt-6 w-full rounded-lg bg-gray-800 py-3 font-medium text-white transition-colors hover:bg-gray-700 active:bg-gray-900"
      >
        회원가입
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <LogoMark />
        <SignupCard />

        {/* Login link */}
        <p className="mt-6 text-center text-gray-700">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="font-medium text-gray-800 hover:underline"
          >
            로그인
          </Link>
        </p>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-gray-500">
          회원가입 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
