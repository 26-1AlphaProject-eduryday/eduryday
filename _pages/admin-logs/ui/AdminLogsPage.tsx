import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge, Button } from '@/shared/ui';

const STATS = [
  {
    label: '오늘 오류',
    value: '3건',
    valueClassName: 'text-red-600',
  },
  {
    label: '채점 완료',
    value: '47건',
    valueClassName: 'text-green-600',
  },
  {
    label: 'API 호출',
    value: '1,234건',
    valueClassName: 'text-gray-900',
  },
  {
    label: '활성 세션',
    value: '89명',
    valueClassName: 'text-gray-900',
  },
];

type LogType = 'error' | 'access' | 'grading' | 'ai';

interface LogEntry {
  id: number;
  timestamp: string;
  type: LogType;
  user: string;
  message: string;
}

const LOG_BADGE: Record<LogType, { label: string; variant: 'red' | 'blue' | 'green' | 'purple' }> = {
  error: { label: '오류', variant: 'red' },
  access: { label: '접속', variant: 'blue' },
  grading: { label: '채점', variant: 'green' },
  ai: { label: 'AI', variant: 'purple' },
};

const LOGS: LogEntry[] = [
  {
    id: 1,
    timestamp: '2026-03-04 15:28:42',
    type: 'error',
    user: '시스템',
    message: 'Docker 채점 컨테이너 타임아웃 (과제 ID: 204)',
  },
  {
    id: 2,
    timestamp: '2026-03-04 15:26:18',
    type: 'access',
    user: '김철수',
    message: '로그인 성공 — 192.168.1.42',
  },
  {
    id: 3,
    timestamp: '2026-03-04 15:24:55',
    type: 'ai',
    user: '이영희',
    message: 'AI 튜터 질문 — 피보나치 수열 힌트 요청',
  },
  {
    id: 4,
    timestamp: '2026-03-04 15:22:30',
    type: 'grading',
    user: '박민수',
    message: '알고리즘 기초 실습3 자동 채점 완료 — 85점',
  },
  {
    id: 5,
    timestamp: '2026-03-04 15:18:11',
    type: 'error',
    user: '시스템',
    message: 'Claude API 응답 지연 (3,200ms) — 재시도 성공',
  },
  {
    id: 6,
    timestamp: '2026-03-04 15:15:04',
    type: 'access',
    user: '이현기',
    message: '교수 로그인 — 강좌 관리 페이지 접근',
  },
  {
    id: 7,
    timestamp: '2026-03-04 15:10:47',
    type: 'grading',
    user: '최지훈',
    message: '웹 프로그래밍 과제1 자동 채점 완료 — 92점',
  },
  {
    id: 8,
    timestamp: '2026-03-04 15:05:33',
    type: 'error',
    user: '시스템',
    message: 'DB 쿼리 응답 지연 (2,800ms) — 슬로우 쿼리 감지',
  },
];

export function AdminLogsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar activeItem="로그/모니터링" />

        <main className="flex-1 bg-gray-50 p-8">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">로그 / 모니터링</h1>
            <p className="mt-1 text-sm text-gray-500">시스템 활동 로그와 오류를 모니터링합니다</p>
          </div>

          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`mt-1 text-3xl font-bold ${stat.valueClassName}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="mb-4 flex items-center gap-3">
            <select
              aria-label="로그 타입 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue="all"
            >
              <option value="all">전체 타입</option>
              <option value="error">오류</option>
              <option value="access">접속</option>
              <option value="grading">채점</option>
              <option value="ai">AI</option>
            </select>

            <div className="flex items-center gap-2">
              <label htmlFor="date-from" className="text-sm font-medium text-gray-700">
                기간
              </label>
              <input
                id="date-from"
                type="date"
                defaultValue="2026-03-04"
                aria-label="시작 날짜"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <span className="text-sm text-gray-500">-</span>
              <input
                id="date-to"
                type="date"
                defaultValue="2026-03-04"
                aria-label="종료 날짜"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div className="ml-auto">
              <Button variant="secondary" size="sm">CSV 내보내기</Button>
            </div>
          </div>

          {/* Logs table */}
          <section aria-label="로그 목록">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">타임스탬프</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">타입</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">사용자</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">메시지</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {LOGS.map((log) => {
                    const badgeInfo = LOG_BADGE[log.type];
                    const isError = log.type === 'error';
                    return (
                      <tr
                        key={log.id}
                        className={`hover:bg-gray-50 ${isError ? 'bg-red-50 hover:bg-red-50' : ''}`}
                      >
                        <td className="px-5 py-3 font-mono text-xs text-gray-600">
                          {log.timestamp}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-900">{log.user}</td>
                        <td className="px-5 py-3 text-gray-700">{log.message}</td>
                        <td className="px-5 py-3">
                          <Button variant="secondary" size="sm">상세보기</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>오늘 로그 총 312건 중 최신 8건 표시</p>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled
                  aria-label="이전 페이지"
                >
                  이전
                </button>
                <button
                  className="rounded-lg border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-white"
                  aria-current="page"
                >
                  1
                </button>
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                  2
                </button>
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                  3
                </button>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                  aria-label="다음 페이지"
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
