'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '28rem', padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
              치명적 오류
            </h1>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              페이지를 새로고침하거나 홈으로 돌아가세요.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{ padding: '0.5rem 1.5rem', background: '#111827', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
