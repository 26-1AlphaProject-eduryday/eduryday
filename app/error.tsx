'use client';

import { useEffect } from 'react';
import { reportError } from '@/shared/lib/monitoring/error-reporter';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { route: 'app/error.tsx', tags: { digest: error.digest ?? 'unknown' } });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">오류가 발생했습니다</h1>
        <p className="mb-6 text-sm text-gray-600">
          잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의하세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
