import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';
import { getProfessorAssignments, type ProfessorAssignmentRecord } from '@/shared/lib/supabase/ui-seed';

type AssignmentType = 'coding' | 'essay' | 'multiple-choice' | 'file';
type AssignmentStatus = 'active' | 'closed' | 'draft';

const TYPE_LABELS: Record<AssignmentType, string> = {
  coding: '코딩',
  essay: '주관식',
  'multiple-choice': '객관식',
  file: '파일 제출',
};

const TYPE_BADGE_VARIANTS: Record<AssignmentType, 'blue' | 'purple' | 'yellow' | 'default'> = {
  coding: 'blue',
  essay: 'purple',
  'multiple-choice': 'yellow',
  file: 'default',
};

const STATUS_LABELS: Record<AssignmentStatus, string> = {
  active: '진행 중',
  closed: '마감',
  draft: '초안',
};

const STATUS_BADGE_VARIANTS: Record<AssignmentStatus, 'green' | 'default' | 'yellow'> = {
  active: 'green',
  closed: 'default',
  draft: 'yellow',
};

export async function ProfessorAssignmentsPage() {
  const assignments = await getProfessorAssignments();
  const activeCount = assignments.filter((a) => a.status === 'active').length;
  const totalSubmitted = assignments.reduce((sum, a) => sum + a.submitted, 0);
  const totalGraded = assignments.reduce((sum, a) => sum + a.graded, 0);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar activeItem="과제 관리" />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-700">과제 관리</h1>
              <p className="mt-1 text-sm text-gray-500">
                강좌별 과제를 출제하고 현황을 확인하세요
              </p>
            </div>
            <a
              href="/professor/courses/1/assignments/create"
              className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              과제 출제하기
            </a>
          </div>

          {/* Summary stats */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">전체 과제</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{assignments.length}개</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">진행 중</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{activeCount}개</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">총 제출 건수</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{totalSubmitted}건</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">채점 완료</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{totalGraded}건</p>
            </div>
          </div>

          {/* Assignments table */}
          <section aria-label="과제 목록">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      과제명
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      강좌
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      유형
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      마감일
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      제출 현황
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      채점 현황
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      상태
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">액션</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignments.map((assignment: ProfessorAssignmentRecord) => {
                    const submissionRate = Math.round(
                      (assignment.submitted / assignment.total) * 100,
                    );
                    const gradingRate =
                      assignment.submitted > 0
                        ? Math.round((assignment.graded / assignment.submitted) * 100)
                        : 0;

                    return (
                      <tr
                        key={assignment.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">
                            {assignment.title}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {assignment.course}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={TYPE_BADGE_VARIANTS[assignment.type]}>
                            {TYPE_LABELS[assignment.type]}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {assignment.deadline}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-800">
                            {assignment.submitted}/{assignment.total}명
                          </span>
                          <span
                            className={`ml-1.5 text-xs ${
                              submissionRate >= 80
                                ? 'text-green-600'
                                : submissionRate >= 50
                                  ? 'text-yellow-600'
                                  : 'text-red-500'
                            }`}
                          >
                            ({submissionRate}%)
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-800">
                            {assignment.graded}/{assignment.submitted}건
                          </span>
                          {assignment.submitted > 0 && (
                            <span
                              className={`ml-1.5 text-xs ${
                                gradingRate === 100
                                  ? 'text-green-600'
                                  : 'text-yellow-600'
                              }`}
                            >
                              ({gradingRate}%)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={STATUS_BADGE_VARIANTS[assignment.status]}>
                            {STATUS_LABELS[assignment.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`/professor/courses/1/grading`}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              채점하기
                            </a>
                            <span className="text-gray-300">|</span>
                            <button
                              type="button"
                              className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
                            >
                              수정
                            </button>
                          </div>
                        </td>
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
