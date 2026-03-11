import Link from 'next/link';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';
import type { Deadline } from '@/entities/course';
import { getDeadlines, getStudentGrades } from '@/shared/lib/supabase/ui-seed';

type AssignmentStatus = 'pending' | 'submitted' | 'graded';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dday: string;
  ddayUrgent: boolean;
  date: string;
  status: AssignmentStatus;
  type: '코딩' | '주관식' | '파일제출';
  score?: number;
}

const STATUS_CONFIG: Record<
  AssignmentStatus,
  { label: string; variant: 'yellow' | 'blue' | 'green' }
> = {
  pending: { label: '제출대기', variant: 'yellow' },
  submitted: { label: '제출완료', variant: 'blue' },
  graded: { label: '채점완료', variant: 'green' },
};

const TYPE_ICON: Record<string, string> = {
  코딩: '</> ',
  주관식: 'T ',
  파일제출: '첨 ',
};

export async function StudentAssignmentsPage() {
  const [deadlines, grades] = await Promise.all([getDeadlines(), getStudentGrades()]);

  const assignments: Assignment[] = [
    ...deadlines.map(
      (d: Deadline): Assignment => ({
        id: d.id,
        title: d.title,
        course: d.course,
        dday: d.dday,
        ddayUrgent: d.ddayUrgent,
        date: d.date,
        status: 'pending',
        type: '코딩',
      }),
    ),
    ...grades.map((grade): Assignment => ({
      id: grade.id,
      title: grade.assignment,
      course: grade.course,
      dday: 'D+0',
      ddayUrgent: false,
      date: grade.submittedAt,
      status: grade.status === 'graded' ? 'graded' : 'submitted',
      type: grade.assignment.includes('퀴즈') ? '주관식' : grade.assignment.includes('보고서') ? '파일제출' : '코딩',
      score: grade.status === 'graded' ? grade.score : undefined,
    })),
  ];

  const pending = assignments.filter((a) => a.status === 'pending');
  const submitted = assignments.filter((a) => a.status === 'submitted');
  const graded = assignments.filter((a) => a.status === 'graded');

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar activeItem="과제" />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-700">과제</h1>
            <p className="mt-1 text-sm text-gray-500">
              마감임박순으로 정렬된 과제 목록입니다.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-6 flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-6 py-4">
            <div>
              <span className="text-sm text-gray-500">제출대기</span>
              <span className="ml-2 text-lg font-bold text-yellow-600">{pending.length}</span>
            </div>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <div>
              <span className="text-sm text-gray-500">제출완료</span>
              <span className="ml-2 text-lg font-bold text-blue-600">{submitted.length}</span>
            </div>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <div>
              <span className="text-sm text-gray-500">채점완료</span>
              <span className="ml-2 text-lg font-bold text-green-600">{graded.length}</span>
            </div>
          </div>

          {/* Assignments table */}
          <section aria-label="과제 목록">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <th className="px-6 py-3">과제명</th>
                    <th className="px-6 py-3">강좌</th>
                    <th className="px-6 py-3">유형</th>
                    <th className="px-6 py-3">마감일</th>
                    <th className="px-6 py-3">D-Day</th>
                    <th className="px-6 py-3">상태</th>
                    <th className="px-6 py-3">점수</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignments.map((assignment) => {
                    const statusCfg = STATUS_CONFIG[assignment.status];
                    return (
                      <tr
                        key={assignment.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/student/assignments/${assignment.id}`}
                            className="font-medium text-gray-800 hover:text-gray-600 hover:underline"
                          >
                            <span
                              className="mr-1 font-mono text-xs text-gray-400"
                              aria-hidden="true"
                            >
                              {TYPE_ICON[assignment.type]}
                            </span>
                            {assignment.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{assignment.course}</td>
                        <td className="px-6 py-4">
                          <Badge variant="default" size="sm">
                            {assignment.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{assignment.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`font-semibold ${
                              assignment.ddayUrgent
                                ? 'text-red-500'
                                : assignment.dday.startsWith('D+')
                                ? 'text-gray-500'
                                : 'text-gray-600'
                            }`}
                          >
                            {assignment.dday}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusCfg.variant} size="sm">
                            {statusCfg.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {assignment.score !== undefined ? (
                            <span className="font-semibold text-gray-700">
                              {assignment.score}점
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
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
