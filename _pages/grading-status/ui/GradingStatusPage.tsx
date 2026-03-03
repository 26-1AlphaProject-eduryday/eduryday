import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';
import type { SubmissionStatus } from '@/entities/submission';
import { MOCK_SUBMISSIONS } from '@/entities/submission';

const STATS = [
  { label: '전체 학생', value: '45', valueClassName: 'text-gray-900' },
  { label: '제출 완료', value: '38', valueClassName: 'text-green-600' },
  { label: '채점 완료', value: '35', valueClassName: 'text-blue-600' },
  { label: '검토 필요', value: '3', valueClassName: 'text-yellow-600' },
  { label: '평균 점수', value: '82.4', valueClassName: 'text-gray-900' },
];

const STATUS_BADGE: Record<SubmissionStatus, { label: string; variant: 'green' | 'yellow' | 'red' }> = {
  complete: { label: '완료', variant: 'green' },
  reviewing: { label: '검토중', variant: 'yellow' },
  unsubmitted: { label: '미제출', variant: 'red' },
};

const ROW_STYLE: Record<SubmissionStatus, { rowClassName: string; finalScoreClassName: string; actionLabel: string; actionClassName: string }> = {
  complete: { rowClassName: '', finalScoreClassName: 'border-gray-300 focus:ring-gray-300', actionLabel: '상세보기', actionClassName: 'text-gray-600 hover:text-gray-900' },
  reviewing: { rowClassName: 'bg-yellow-50', finalScoreClassName: 'border-yellow-400 focus:ring-yellow-300', actionLabel: '검토하기', actionClassName: 'text-blue-600 hover:text-blue-800 font-medium' },
  unsubmitted: { rowClassName: 'bg-red-50', finalScoreClassName: 'border-gray-300 focus:ring-gray-300', actionLabel: '알림보내기', actionClassName: 'text-red-600 hover:text-red-800 font-medium' },
};

export function GradingStatusPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar activeItem="채점 현황" />

        <main className="flex-1 p-8">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-gray-500">
              <li>EduRyday</li>
              <li aria-hidden="true" className="text-gray-300">›</li>
              <li>알고리즘 기초</li>
              <li aria-hidden="true" className="text-gray-300">›</li>
              <li className="font-medium text-gray-700">채점 현황</li>
            </ol>
          </nav>

          {/* Page header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">채점 현황</h1>
              <p className="mt-1 text-sm text-gray-500">실습 3: 정렬 알고리즘 구현</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                엑셀 내보내기
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                전체 채점 결과 확정
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mb-8 grid grid-cols-5 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`mt-1 text-3xl font-bold ${stat.valueClassName}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="filter-status" className="text-sm font-medium text-gray-600">
                  상태
                </label>
                <select
                  id="filter-status"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  defaultValue="all"
                >
                  <option value="all">전체</option>
                  <option value="complete">완료</option>
                  <option value="reviewing">검토중</option>
                  <option value="unsubmitted">미제출</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="filter-sort" className="text-sm font-medium text-gray-600">
                  정렬
                </label>
                <select
                  id="filter-sort"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  defaultValue="submitted-at"
                >
                  <option value="submitted-at">제출일 순</option>
                  <option value="score-asc">점수 낮은 순</option>
                  <option value="score-desc">점수 높은 순</option>
                  <option value="name">이름 순</option>
                </select>
              </div>

              <div className="ml-auto">
                <label htmlFor="filter-search" className="sr-only">학생 검색</label>
                <input
                  id="filter-search"
                  type="search"
                  placeholder="학생 이름 또는 학번 검색"
                  className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Submission table */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      aria-label="전체 선택"
                      className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-400"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">학생</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">제출일</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">자동 채점</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">AI 분석</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">최종 점수</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">상태</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_SUBMISSIONS.map((row) => {
                  const statusBadge = STATUS_BADGE[row.status];
                  const rowStyle = ROW_STYLE[row.status];
                  return (
                    <tr key={row.id} className={rowStyle.rowClassName}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={`${row.name} 선택`}
                          className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.studentId}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.submittedAt}</td>
                      <td className="px-4 py-3">
                        {row.autoScore !== '-' ? (
                          <>
                            <p className="font-medium text-gray-900">{row.autoScore}</p>
                            <p className="text-xs text-gray-500">{row.testsPassed}</p>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.aiAnalysis !== '-' ? (
                          <div className="flex flex-col gap-1">
                            <Badge variant={row.aiAnalysisVariant}>{row.aiAnalysis}</Badge>
                            {row.aiSubNote ? (
                              <Badge variant="yellow" size="sm">{row.aiSubNote}</Badge>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          defaultValue={row.finalScore}
                          aria-label={`${row.name} 최종 점수`}
                          className={`w-20 rounded-lg border bg-transparent px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 ${rowStyle.finalScoreClassName}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className={`text-sm transition-colors focus:outline-none focus:underline ${rowStyle.actionClassName}`}
                        >
                          {rowStyle.actionLabel}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
              <p className="text-sm text-gray-500">
                1-4 / <span className="font-medium">45명</span>
              </p>
              <nav aria-label="페이지 탐색">
                <ol className="flex items-center gap-1">
                  <li>
                    <button
                      type="button"
                      aria-label="이전 페이지"
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      disabled
                    >
                      이전
                    </button>
                  </li>
                  {[1, 2, 3].map((page) => (
                    <li key={page}>
                      <button
                        type="button"
                        aria-label={`${page}페이지`}
                        aria-current={page === 1 ? 'page' : undefined}
                        className={`rounded-lg px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                          page === 1
                            ? 'bg-gray-800 font-medium text-white'
                            : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      aria-label="다음 페이지"
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      다음
                    </button>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
