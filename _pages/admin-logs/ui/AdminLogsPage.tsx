'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge, Button, TableSkeleton } from '@/shared/ui';

type LogType = 'error' | 'access' | 'grading' | 'ai' | 'login' | 'submit' | 'course';

interface LogRecord {
  id: number;
  timestamp: string;
  type: LogType;
  user: string;
  message: string;
}

interface LogResponse {
  logs: LogRecord[];
  total: number;
  page: number;
  pageSize: number;
}

const LOG_BADGE: Record<LogType, { label: string; variant: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'default' }> = {
  error: { label: '오류', variant: 'red' },
  access: { label: '접속', variant: 'blue' },
  grading: { label: '채점', variant: 'green' },
  ai: { label: 'AI', variant: 'purple' },
  login: { label: '로그인', variant: 'blue' },
  submit: { label: '제출', variant: 'yellow' },
  course: { label: '강좌', variant: 'default' },
};

export function AdminLogsPage({
  initialData,
}: {
  initialData?: LogResponse;
}) {
  const hasInitialData = initialData !== undefined;
  const [logs, setLogs] = useState<LogRecord[]>(initialData?.logs ?? []);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(!hasInitialData);
  const pageSize = 10;

  async function loadLogs() {
    if (hasInitialData) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      type: typeFilter,
    });

    const res = await fetch(`/api/v1/logs?${params.toString()}`, { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      const data = json.data as LogResponse;
      setLogs(data.logs);
      setTotal(data.total);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!hasInitialData) {
      loadLogs();
    }
  }, [page, typeFilter, hasInitialData]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">로그 / 모니터링</h1>
            <p className="mt-1 text-sm text-gray-500">시스템 활동 로그와 오류를 모니터링합니다</p>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <select
              aria-label="로그 타입 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">전체 타입</option>
              <option value="error">오류</option>
              <option value="access">접속</option>
              <option value="grading">채점</option>
              <option value="ai">AI</option>
              <option value="login">로그인</option>
              <option value="submit">제출</option>
              <option value="course">강좌</option>
            </select>
            <div className="ml-auto"><Button variant="secondary" size="sm">CSV 내보내기</Button></div>
          </div>

          <section aria-label="로그 목록">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">타임스탬프</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">타입</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">사용자</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">메시지</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton columns={4} rows={3} />
                  ) :logs.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-500">로그가 없습니다.</td></tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className={log.type === 'error' ? 'bg-red-50' : ''}>
                        <td className="px-5 py-3 font-mono text-xs text-gray-600">{log.timestamp}</td>
                        <td className="px-5 py-3"><Badge variant={LOG_BADGE[log.type].variant}>{LOG_BADGE[log.type].label}</Badge></td>
                        <td className="px-5 py-3 font-medium text-gray-900">{log.user}</td>
                        <td className="px-5 py-3 text-gray-700">{log.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>전체 {total}건 중 {(page - 1) * pageSize + 1}-{Math.min(total, page * pageSize)} 표시</p>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  이전
                </button>
                <span className="px-2">{page}/{totalPages}</span>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  다음
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
