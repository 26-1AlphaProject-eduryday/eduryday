import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';

const STATS = [
  {
    label: '전체 사용자',
    value: '1,245',
    trend: '+12% 이번 주',
    trendClassName: 'text-green-600',
  },
  {
    label: '활성 강좌',
    value: '47',
    trend: null,
    trendClassName: '',
  },
  {
    label: '오늘 접속자',
    value: '382',
    trend: '+8%',
    trendClassName: 'text-green-600',
  },
  {
    label: 'AI 요청 수',
    value: '2,847',
    trend: null,
    trendClassName: '',
  },
  {
    label: '서버 응답',
    value: '142ms',
    trend: null,
    trendClassName: '',
  },
];

const USER_DISTRIBUTION = [
  { role: '학생', count: '1,180명', percent: 95, barClassName: 'bg-blue-500' },
  { role: '교수', count: '52명', percent: 4, barClassName: 'bg-green-500' },
  { role: '관리자', count: '13명', percent: 1, barClassName: 'bg-red-500' },
];

const SERVER_RESOURCES = [
  { label: 'CPU', value: 34, barClassName: 'bg-green-500' },
  { label: '메모리', value: 62, barClassName: 'bg-yellow-400' },
  { label: '저장공간', value: 45, barClassName: 'bg-green-500' },
  { label: 'DB 연결', value: 28, displayValue: '28/100', barClassName: 'bg-green-500' },
];

interface AlertItem {
  icon: string;
  bgClassName: string;
  message: string;
  time: string;
}

const ALERTS: AlertItem[] = [
  {
    icon: '⚠',
    bgClassName: 'bg-yellow-50 border-yellow-200',
    message: 'AI API 응답 지연',
    time: '10분 전',
  },
  {
    icon: '✓',
    bgClassName: 'bg-green-50 border-green-200',
    message: '백업 완료',
    time: '1시간 전',
  },
  {
    icon: 'ℹ',
    bgClassName: 'bg-blue-50 border-blue-200',
    message: '신규 강좌 생성 요청',
    time: '2시간 전',
  },
  {
    icon: '✓',
    bgClassName: 'bg-green-50 border-green-200',
    message: '시스템 업데이트 완료',
    time: '어제',
  },
];

type LogType = 'login' | 'submit' | 'ai' | 'course';

interface ActivityLog {
  time: string;
  type: LogType;
  user: string;
  userRole: string;
  content: string;
  ip: string;
}

const LOG_BADGE: Record<LogType, { label: string; variant: 'blue' | 'green' | 'purple' | 'yellow' }> = {
  login: { label: '로그인', variant: 'blue' },
  submit: { label: '과제제출', variant: 'green' },
  ai: { label: 'AI질문', variant: 'purple' },
  course: { label: '강좌생성', variant: 'yellow' },
};

const ACTIVITY_LOGS: ActivityLog[] = [
  {
    time: '15:28:42',
    type: 'login',
    user: '김철수',
    userRole: '학생',
    content: '로그인 성공',
    ip: '192.168.1.42',
  },
  {
    time: '15:26:18',
    type: 'submit',
    user: '이영희',
    userRole: '학생',
    content: '알고리즘 기초 실습3 제출',
    ip: '192.168.1.87',
  },
  {
    time: '15:24:55',
    type: 'ai',
    user: '박민수',
    userRole: '학생',
    content: 'AI튜터 질문 (자료구조)',
    ip: '192.168.1.31',
  },
  {
    time: '15:20:33',
    type: 'course',
    user: '이현기',
    userRole: '교수',
    content: '새 강좌 생성: 고급 알고리즘',
    ip: '192.168.1.15',
  },
];

export function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
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
          <div className="mb-8 grid grid-cols-5 gap-4">
            {STATS.map((stat) => (
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

          {/* 3-column section */}
          <div className="mb-8 grid grid-cols-3 gap-6">
            {/* User distribution */}
            <section
              aria-label="사용자 분포"
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <h2 className="mb-5 text-base font-semibold text-gray-900">사용자 분포</h2>
              <ul className="space-y-5">
                {USER_DISTRIBUTION.map((item) => (
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
            </section>

            {/* Server resources */}
            <section
              aria-label="서버 리소스"
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <h2 className="mb-5 text-base font-semibold text-gray-900">서버 리소스</h2>
              <ul className="space-y-5">
                {SERVER_RESOURCES.map((item) => (
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
            </section>

            {/* Recent alerts */}
            <section
              aria-label="최근 알림"
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <h2 className="mb-5 text-base font-semibold text-gray-900">최근 알림</h2>
              <ul className="space-y-3">
                {ALERTS.map((alert) => (
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
            <div
              className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50"
              aria-label="일별 활동 차트 영역"
            >
              <span className="text-sm text-gray-400">차트 영역</span>
            </div>
          </section>

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
                  {ACTIVITY_LOGS.map((log) => {
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
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
