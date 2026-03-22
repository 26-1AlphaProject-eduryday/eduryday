'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

function LogoMark() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200">
        <div className="h-5 w-5 rounded-sm bg-gray-500" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">EduRyday</h1>
      <p className="mt-2 text-sm text-gray-500">AI 기반 통합 교육 플랫폼</p>
    </div>
  );
}

type RequestedRole = 'student' | 'professor';

interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: RequestedRole | 'admin' | null;
  status: 'pending' | 'active' | 'suspended';
  student_id: string | null;
  department: string | null;
}

function SignupCard() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestedRole, setRequestedRole] = useState<RequestedRole>('student');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        if (!cancelled) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      const res = await fetch('/api/v1/profile', { cache: 'no-store' });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        if (!cancelled) {
          setErrorMessage(json?.message ?? '프로필 정보를 불러오지 못했습니다.');
          setIsLoading(false);
        }
        return;
      }

      const profile = json.data.profile as ProfileResponse;

      if (!cancelled) {
        setIsAuthenticated(true);
        setName(profile.name ?? '');
        setEmail(profile.email ?? user.email ?? '');
        setRequestedRole(profile.role === 'professor' ? 'professor' : 'student');
        setStudentId(profile.student_id ?? '');
        setDepartment(profile.department ?? '');
        setIsLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGoogleLogin() {
    setErrorMessage('');
    setSuccessMessage('');

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

  async function handleSignupApplication(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (name.trim().length < 1) {
      setErrorMessage('이름은 필수입니다.');
      return;
    }

    if (department.trim().length < 1) {
      setErrorMessage('소속은 필수입니다.');
      return;
    }

    if (requestedRole === 'student' && studentId.trim().length < 1) {
      setErrorMessage('학생 신청 시 학번은 필수입니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: requestedRole,
          studentId: requestedRole === 'student' ? studentId.trim() : '',
          department: department.trim(),
        }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setErrorMessage(json?.message ?? '가입 신청 저장에 실패했습니다.');
        return;
      }

      setSuccessMessage('가입 신청이 완료되었습니다. 관리자 승인 후 이용하실 수 있습니다.');
      router.replace('/pending');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
        가입 신청 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-center text-xl font-bold text-gray-900">가입 신청 전 Google 로그인</h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          먼저 Google 계정으로 로그인한 뒤 학생/교수 가입 신청서를 작성해주세요.
        </p>

        {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <div className="h-5 w-5 rounded-full border-2 border-dashed border-gray-300 bg-gray-200" />
          Google로 로그인하고 신청하기
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-center text-xl font-bold text-gray-900">가입 신청서</h2>
      <p className="mb-8 text-center text-sm text-gray-500">Google 로그인 완료 후 역할과 소속 정보를 제출해주세요</p>

      <form onSubmit={handleSignupApplication} className="space-y-3" noValidate>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          autoComplete="name"
          required
        />

        <input
          type="email"
          value={email}
          className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
          autoComplete="email"
          disabled
          readOnly
        />

        <input
          type="text"
          placeholder="소속 학과/전공"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          required
        />

        <select
          value={requestedRole}
          onChange={(e) => setRequestedRole(e.target.value as RequestedRole)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        >
          <option value="student">학생 신청</option>
          <option value="professor">교수 신청</option>
        </select>

        {requestedRole === 'student' ? (
          <input
            type="text"
            placeholder="학번"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            required
          />
        ) : null}

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 w-full rounded-lg bg-gray-900 py-3 font-medium !text-white transition-colors hover:bg-gray-800 active:bg-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? '처리 중...' : '가입 신청 제출'}
        </button>
      </form>
    </div>
  );
}

export function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <LogoMark />
        <SignupCard />

        <p className="mt-6 text-center text-gray-600">
          이미 로그인하셨나요?{' '}
          <Link
            href="/login"
            className="font-medium text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            로그인
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-500">
          가입 신청 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
