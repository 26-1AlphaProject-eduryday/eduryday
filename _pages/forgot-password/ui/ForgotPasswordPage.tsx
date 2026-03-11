'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/shared/ui';

function LogoMark() {
  return (
    <div className="mb-8 text-center">
      <div
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200"
        aria-hidden="true"
      >
        <span className="text-xs text-gray-700">Logo</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">EduRyday</h1>
      <p className="mt-2 text-sm text-gray-500">AI 기반 통합 교육 플랫폼</p>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <LogoMark />

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {submitted ? (
            /* Success state */
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100"
                aria-hidden="true"
              >
                <svg
                  className="h-7 w-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
      <h2 className="mb-2 text-xl font-bold text-gray-900">인증 메일 발송 완료</h2>
              <p className="mb-6 text-sm text-gray-500">
                입력하신 이메일로 비밀번호 재설정 링크를 발송했습니다.
                <br />
                메일함을 확인해주세요.
              </p>
              <p className="text-xs text-gray-500">
                메일이 도착하지 않았나요?{' '}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                   className="font-medium text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline"
                >
                  다시 보내기
                </button>
              </p>
            </div>
          ) : (
            /* Form state */
            <>
               <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
                비밀번호 찾기
              </h2>
              <p className="mb-6 text-center text-sm text-gray-500">
                가입 시 사용한 이메일 주소를 입력하시면
                <br />
                비밀번호 재설정 링크를 보내드립니다.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                  <Input
                    label="이메일"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@kookmin.ac.kr"
                    autoComplete="email"
                    required
                    className="w-full"
                  />
                </div>

                <button
                  type="submit"
                   className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-gray-800 active:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  인증 코드 발송
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to login */}
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
