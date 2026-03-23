'use client';

import Link from 'next/link';

function LogoMark() {
  return (
    <div className="mb-8 text-center">
      <div
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800"
        aria-hidden="true"
      >
        <div className="h-5 w-5 rounded-sm bg-white" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">EduRyday</h1>
      <p className="mt-2 text-sm text-gray-500">AI 기반 통합 교육 플랫폼</p>
    </div>
  );
}

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <LogoMark />

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-center text-xl font-bold text-gray-900">비밀번호 찾기</h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            EduRyday는 Google 계정 로그인만 지원합니다.
            <br />
            Google 계정 비밀번호는 Google 계정 설정에서 변경하세요.
          </p>

          <a
            href="https://myaccount.google.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg bg-gray-900 py-3 text-center font-medium text-white transition-colors hover:bg-gray-800 active:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Google 계정 설정으로 이동
          </a>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link
            href="/login"
            className="font-medium text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            &larr; 로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
