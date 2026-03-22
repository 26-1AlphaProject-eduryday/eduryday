import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';

interface AdminStat {
  label: string;
  value: string;
  trend?: string | null;
  trendClassName?: string;
}

interface AdminDistribution {
  role: string;
  count: string;
  percent: number;
  barClassName: string;
}

interface AdminResource {
  label: string;
  value: number;
  displayValue?: string;
  barClassName: string;
}

interface AdminAlert {
  icon: string;
  bgClassName: string;
  message: string;
  time: string;
}

interface AdminActivityLog {
  time: string;
  type: LogType;
  user: string;
  userRole: string;
  content: string;
  ip: string;
}

type LogType = 'login' | 'submit' | 'ai' | 'course';

const LOG_BADGE: Record<LogType, { label: string; variant: 'blue' | 'green' | 'purple' | 'yellow' }> = {
  login: { label: '로그인', variant: 'blue' },
  submit: { label: '과제제출', variant: 'green' },
  ai: { label: 'AI질문', variant: 'purple' },
  course: { label: '강좌생성', variant: 'yellow' },
};

export async function AdminDashboardPage({
  stats,
  userDistribution,
  serverResources,
  alerts,
  activityLogs,
}: {
  stats: AdminStat[];
  userDistribution: AdminDistribution[];
  serverResources: AdminResource[];
  alerts: AdminAlert[];
  activityLogs: AdminActivityLog[];
}) {

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />

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
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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

          {/* 3-column section */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* User distribution */}
            <section
              aria-label="사용자 분포"
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <h2 className="mb-5 text-base font-semibold text-gray-900">사용자 분포</h2>
              {userDistribution.length > 0 ? (
                <ul className="space-y-5">
                  {userDistribution.map((item) => (
                    <li key={item.role}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{item.role}</span>
                        <span className="text-gray-500">{item.count}</span>
                      </div>
                      <div
                        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
                        role="progressbar"
                        aria-valuenow={item.percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${item.role} ${item.percent}%`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${item.barClassName}`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-xs text-gray-400">{item.percent}%</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">사용자 분포 데이터가 없습니다.</p>
              )}
            </section>

            {/* Server resources */}
            <section
              aria-label="서버 리소스"
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <h2 className="mb-5 text-base font-semibold text-gray-900">서버 리소스</h2>
              {serverResources.length > 0 ? (
                <ul className="space-y-5">
                  {serverResources.map((item) => (
                    <li key={item.label}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{item.label}</span>
                        <span className="text-gray-500">
                          {item.displayValue ?? `${item.value}%`}
                        </span>
                      </div>
                      <div
                        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
                        role="progressbar"
                        aria-valuenow={item.value}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${item.label} ${item.value}%`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${item.barClassName}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">서버 리소스 데이터가 없습니다.</p>
              )}
            </section>

            {/* Recent alerts */}
            <section
              aria-label="최근 알림"
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <h2 className="mb-5 text-base font-semibold text-gray-900">최근 알림</h2>
              {alerts.length > 0 ? (
                <ul className="space-y-3">
                  {alerts.map((alert) => (
                    <li
                      key={alert.message}
                      className={`flex items-start gap-3 rounded-lg border p-3 ${alert.bgClassName}`}
                    >
                      <span
                        className="mt-px flex-shrink-0 text-sm"
                        aria-hidden="true"
                      >
                        {alert.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">최근 알림이 없습니다.</p>
              )}
            </section>
          </div>

          {/* Daily activity chart placeholder */}
          <section
            aria-label="일별 활동 현황"
            className="mb-8 rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">일별 활동 현황</h2>
              <select
                aria-label="기간 필터"
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                defaultValue="7d"
              >
                <option value="7d">최근 7일</option>
                <option value="30d">최근 30일</option>
                <option value="90d">최근 90일</option>
              </select>
            </div>
            <div className="flex h-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">차트 데이터 준비 중</p>
                <p className="mt-1 text-xs text-gray-400">추후 업데이트 예정입니다</p>
              </div>
            </div>
          </section>

          {/* Activity log table */}
          <section aria-label="최근 활동 로그">
            <h2 className="mb-4 text-base font-semibold text-gray-900">최근 활동 로그</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
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
