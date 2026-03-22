'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/shared/ui';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

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
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setErrorMessage('Supabase 환경변수가 누락되었습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectTo = `${window.location.origin}/login`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <LogoMark />

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {submitted ? (
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
            <>
              <h2 className="mb-2 text-center text-xl font-bold text-gray-900">비밀번호 찾기</h2>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>

                {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-gray-800 active:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? '전송 중...' : '인증 코드 발송'}
                </button>
              </form>
            </>
          )}
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
