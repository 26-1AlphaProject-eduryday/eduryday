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

function ApplicationForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<RequestedRole>('student');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function prefill() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        if (!cancelled) setIsLoadingUser(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!cancelled) {
        if (user?.user_metadata?.name) {
          setName(String(user.user_metadata.name));
        }
        setIsLoadingUser(false);
      }
    }

    prefill();
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');

    if (name.trim().length < 1) {
      setErrorMessage('이름은 필수입니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role,
          student_id: studentId.trim() || null,
          department: department.trim() || null,
        }),
      });

      const json = await res.json() as { ok: boolean; code?: string; message?: string };

      if (!json.ok) {
        setErrorMessage(json.message ?? '신청에 실패했습니다.');
        return;
      }

      router.replace('/pending');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingUser) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        사용자 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-center text-xl font-bold text-gray-900">서비스 신청</h2>
      <p className="mb-8 text-center text-sm text-gray-500">
        아래 정보를 입력하면 관리자 승인 후 서비스를 이용하실 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <input
          type="text"
          placeholder="이름 *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          autoComplete="name"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as RequestedRole)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        >
          <option value="student">학생 신청</option>
          <option value="professor">교수 신청</option>
        </select>

        <input
          type="text"
          placeholder="학번 (선택)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />

        <input
          type="text"
          placeholder="학과/부서 (선택)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 w-full rounded-lg bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-gray-800 active:bg-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? '처리 중...' : '신청하기'}
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
        <ApplicationForm />

        <p className="mt-6 text-center text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="font-medium text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
