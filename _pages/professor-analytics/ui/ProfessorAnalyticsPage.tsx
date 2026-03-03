import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { StatCard, Badge } from '@/shared/ui';

const STAT_CARDS = [
  { label: '평균 점수', value: '76.2점', trend: '지난 학기 대비 +3.1점', trendColor: 'green' as const },
  { label: '출석률', value: '91%', trend: '지난 주 대비 -1%', trendColor: 'red' as const },
  { label: 'AI 질문 수', value: '287건', trend: '이번 주 누적', trendColor: 'green' as const },
  { label: '과제 완료율', value: '84%', trend: '전체 과제 기준', trendColor: 'green' as const },
];

const TOP_MISCONCEPTIONS = [
  { rank: 1, concept: '재귀 함수의 기저 조건(base case) 설정', count: 24, course: '알고리즘 기초', severity: 'high' as const },
  { rank: 2, concept: '시간 복잡도 Big-O 계산 방법', count: 19, course: '알고리즘 기초', severity: 'high' as const },
  { rank: 3, concept: '스택과 큐의 동작 차이', count: 15, course: '자료구조', severity: 'medium' as const },
  { rank: 4, concept: '포인터와 참조 개념', count: 11, course: '자료구조', severity: 'medium' as const },
  { rank: 5, concept: '동적 프로그래밍 메모이제이션', count: 8, course: '알고리즘 기초', severity: 'low' as const },
];

const WEEKLY_PARTICIPATION = [
  { week: '1주', rate: 95, questions: 12 },
  { week: '2주', rate: 92, questions: 18 },
  { week: '3주', rate: 89, questions: 34 },
  { week: '4주', rate: 91, questions: 28 },
  { week: '5주', rate: 88, questions: 41 },
];

const QUESTION_PATTERNS = [
  { category: '개념 이해', count: 98, percentage: 34, variant: 'blue' as const },
  { category: '코드 디버깅', count: 87, percentage: 30, variant: 'red' as const },
  { category: '과제 힌트 요청', count: 65, percentage: 23, variant: 'yellow' as const },
  { category: '기타', count: 37, percentage: 13, variant: 'default' as const },
];

const SEVERITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const SEVERITY_LABELS = { high: '높음', medium: '보통', low: '낮음' };

export function ProfessorAnalyticsPage() {
  const maxWeeklyRate = Math.max(...WEEKLY_PARTICIPATION.map((w) => w.rate));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar activeItem="학습 분석" />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-700">학습 분석</h1>
            <p className="mt-1 text-sm text-gray-500">
              수강생의 학습 패턴과 취약점을 분석합니다 &mdash; 2026-1학기 기준
            </p>
          </div>

          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-4 gap-5">
            {STAT_CARDS.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                trend={stat.trend}
                trendColor={stat.trendColor}
              />
            ))}
          </div>

          {/* Top misconceptions + weekly chart */}
          <div className="mb-8 grid grid-cols-3 gap-6">
            {/* Misconceptions list */}
            <section className="col-span-2" aria-label="자주 틀리는 개념 Top 5">
              <h2 className="mb-3 text-base font-semibold text-gray-700">
                자주 틀리는 개념 Top 5
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th
                        scope="col"
                        className="w-12 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        순위
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        개념
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        강좌
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        질문 수
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        심각도
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {TOP_MISCONCEPTIONS.map((item) => (
                      <tr key={item.rank} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                              item.rank === 1
                                ? 'bg-red-100 text-red-700'
                                : item.rank === 2
                                  ? 'bg-orange-100 text-orange-700'
                                  : item.rank === 3
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {item.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-gray-800">
                          {item.concept}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-xs">
                          {item.course}
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-gray-700">
                          {item.count}건
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[item.severity]}`}
                          >
                            {SEVERITY_LABELS[item.severity]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Question patterns */}
            <section aria-label="질문 패턴 분석">
              <h2 className="mb-3 text-base font-semibold text-gray-700">
                질문 패턴 분석
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-xs text-gray-400">전체 287건 기준</p>
                <div className="space-y-4">
                  {QUESTION_PATTERNS.map((p) => (
                    <div key={p.category}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={p.variant}>{p.category}</Badge>
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                          {p.count}건
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            p.variant === 'blue'
                              ? 'bg-blue-400'
                              : p.variant === 'red'
                                ? 'bg-red-400'
                                : p.variant === 'yellow'
                                  ? 'bg-yellow-400'
                                  : 'bg-gray-400'
                          }`}
                          style={{ width: `${p.percentage}%` }}
                          aria-label={`${p.category}: ${p.percentage}%`}
                        />
                      </div>
                      <p className="mt-0.5 text-right text-xs text-gray-400">
                        {p.percentage}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Weekly participation chart placeholder */}
          <section aria-label="주차별 참여율">
            <h2 className="mb-3 text-base font-semibold text-gray-700">
              주차별 참여율 &amp; AI 질문 수
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-end justify-around gap-4" aria-hidden="true">
                {WEEKLY_PARTICIPATION.map((w) => (
                  <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
                    {/* Questions bar */}
                    <div className="flex w-full flex-col items-center gap-1">
                      <span className="text-xs text-gray-400">{w.questions}건</span>
                      <div
                        className="w-6 rounded-t bg-purple-200"
                        style={{ height: `${(w.questions / 50) * 80}px` }}
                      />
                    </div>
                    {/* Participation bar */}
                    <div className="flex w-full flex-col items-center gap-1">
                      <span className="text-xs font-medium text-blue-600">{w.rate}%</span>
                      <div
                        className="w-6 rounded-t bg-blue-400"
                        style={{ height: `${(w.rate / maxWeeklyRate) * 60}px` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{w.week}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-blue-400" aria-hidden="true" />
                  <span className="text-xs text-gray-500">출석률</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-purple-200" aria-hidden="true" />
                  <span className="text-xs text-gray-500">AI 질문 수</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
