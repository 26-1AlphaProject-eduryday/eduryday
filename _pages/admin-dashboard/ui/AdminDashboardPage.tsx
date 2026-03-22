import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';
import {
  getDbAdminDashboardStats,
  getDbAdminActivityLogs,
} from '@/shared/lib/supabase/db-queries';

type LogType = 'login' | 'submit' | 'ai' | 'course';

const LOG_BADGE: Record<LogType, { label: string; variant: 'blue' | 'green' | 'purple' | 'yellow' }> = {
  login: { label: '로그인', variant: 'blue' },
  submit: { label: '과제제출', variant: 'green' },
  ai: { label: 'AI질문', variant: 'purple' },
  course: { label: '강좌생성', variant: 'yellow' },
};

export async function AdminDashboardPage() {
  const [stats, activityLogs] = await Promise.all([
    getDbAdminDashboardStats(),
    getDbAdminActivityLogs(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar activeItem="대시보드" />

        <main className="flex-1 bg-gray-50 p-8">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="mt-1 text-sm text-gray-500">시스템 전반 현황을 모니터링합니다</p>
          </div>

          {/* System status banner */}
          <div className="mb-8 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-3 w-3 items-center justify-center"
                aria-hidden="true"
              >
                <span className="block h-3 w-3 rounded-full bg-green-500" />
              </span>
              <span className="text-sm font-medium text-gray-700">
                시스템 상태:{' '}
                <span className="font-semibold text-green-600">정상</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">
              마지막 업데이트: 2026-03-03 15:30:00
            </p>
          </div>

          {/* Stats grid */}
          {stats.length > 0 ? (
            <div className="mb-8 grid grid-cols-5 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.trend ? (
                    <p className={`mt-1 text-xs font-medium ${stat.trendClassName}`}>
                      {stat.trend}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
              대시보드 통계 데이터가 없습니다.
            </div>
          )}

          {/* Activity log table */}
          <section aria-label="최근 활동 로그">
            <h2 className="mb-4 text-base font-semibold text-gray-900">최근 활동 로그</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">시간</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">유형</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">사용자</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">내용</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activityLogs.length > 0 ? activityLogs.map((log) => {
                    const badgeInfo = LOG_BADGE[log.type];
                    return (
                      <tr key={`${log.time}-${log.user}`} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-mono text-gray-600">{log.time}</td>
                        <td className="px-5 py-3">
                          <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{log.user}</p>
                          <p className="text-xs text-gray-500">{log.userRole}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-700">{log.content}</td>
                        <td className="px-5 py-3 font-mono text-gray-500">{log.ip}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                        최근 활동 로그가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
