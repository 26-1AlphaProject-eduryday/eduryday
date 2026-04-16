'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge, TableSkeleton } from '@/shared/ui';

type AssignmentType = 'coding' | 'essay' | 'multiple-choice' | 'file';
type AssignmentStatus = 'active' | 'closed' | 'draft';

interface AssignmentRecord {
  id: string;
  title: string;
  course: string;
  courseId: string;
  type: AssignmentType;
  deadline: string;
  submitted: number;
  total: number;
  graded: number;
  status: AssignmentStatus;
}

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

export function ProfessorAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAssignments() {
    setLoading(true);
    const res = await fetch('/api/v1/assignments', { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      setAssignments((json.data.assignments ?? []) as AssignmentRecord[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  const activeCount = useMemo(() => assignments.filter((a) => a.status === 'active').length, [assignments]);
  const totalSubmitted = useMemo(() => assignments.reduce((sum, a) => sum + a.submitted, 0), [assignments]);
  const totalGraded = useMemo(() => assignments.reduce((sum, a) => sum + a.graded, 0), [assignments]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">과제 관리</h1>
              <p className="mt-1 text-sm text-gray-500">강좌별 과제를 출제하고 현황을 확인하세요</p>
            </div>
            <a href="/professor/courses" className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">과제 출제하기</a>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">전체 과제</p><p className="mt-1 text-2xl font-bold text-gray-800">{assignments.length}개</p></div>
            <div className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">진행 중</p><p className="mt-1 text-2xl font-bold text-blue-600">{activeCount}개</p></div>
            <div className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">총 제출 건수</p><p className="mt-1 text-2xl font-bold text-gray-800">{totalSubmitted}건</p></div>
            <div className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">채점 완료</p><p className="mt-1 text-2xl font-bold text-green-600">{totalGraded}건</p></div>
          </div>

          <section aria-label="과제 목록">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">과제명</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">강좌</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">유형</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">마감일</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">제출 현황</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">채점 현황</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">상태</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton columns={8} rows={3} />
                  ) :assignments.length === 0 ? (
                    <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">과제가 없습니다.</td></tr>
                  ) : (
                    assignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4"><span className="font-medium text-gray-800">{assignment.title}</span></td>
                        <td className="px-4 py-4 text-gray-600">{assignment.course}</td>
                        <td className="px-4 py-4"><Badge variant={TYPE_BADGE_VARIANTS[assignment.type]}>{TYPE_LABELS[assignment.type]}</Badge></td>
                        <td className="px-4 py-4 text-gray-600">{assignment.deadline ?? '-'}</td>
                        <td className="px-4 py-4 text-gray-800">{assignment.submitted}/{assignment.total}명</td>
                        <td className="px-4 py-4 text-gray-800">{assignment.graded}/{assignment.submitted}건</td>
                        <td className="px-4 py-4"><Badge variant={STATUS_BADGE_VARIANTS[assignment.status]}>{STATUS_LABELS[assignment.status]}</Badge></td>
                        <td className="px-4 py-4"><a href={`/professor/courses/${assignment.courseId}/grading`} className="text-xs font-medium text-blue-600 hover:text-blue-800">채점하기</a></td>
                      </tr>
                    ))
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
