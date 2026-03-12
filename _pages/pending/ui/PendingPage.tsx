'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

export function PendingPage() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">승인 대기 중입니다</h1>
        <p className="mt-3 text-sm text-gray-600">
          관리자 승인 후 서비스 이용이 가능합니다.
          <br />
          승인 계정: <span className="font-medium text-gray-800">eduryday@gmail.com</span>
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-gray-800"
          >
            로그아웃
          </button>
          <Link
            href="/"
            className="block w-full rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
