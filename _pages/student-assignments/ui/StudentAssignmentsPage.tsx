'use client';

import { useEffect, useMemo, useState } from 'react';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { Badge, TableSkeleton } from '@/shared/ui';

type AssignmentStatus = 'pending' | 'submitted' | 'graded';

interface Assignment {
  id: string;
  title: string;
  course: string;
  date: string;
  status: AssignmentStatus;
  type: '코딩' | '주관식' | '파일제출';
  score?: number;
}

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; variant: 'yellow' | 'blue' | 'green' }> = {
  pending: { label: '제출대기', variant: 'yellow' },
  submitted: { label: '제출완료', variant: 'blue' },
  graded: { label: '채점완료', variant: 'green' },
};

export function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAssignments() {
    setLoading(true);

    const [asgRes, subRes] = await Promise.all([
      fetch('/api/v1/assignments', { cache: 'no-store' }),
      fetch('/api/v1/submissions', { cache: 'no-store' }),
    ]);
    const asgJson = await asgRes.json();
    const subJson = await subRes.json();

    if (asgJson.ok) {
      const submissionByTitle = new Map<string, { status: AssignmentStatus; score?: number }>();

      if (subJson.ok) {
        const submissions = (subJson.data.submissions ?? []) as { status: 'complete' | 'reviewing' | 'unsubmitted'; finalScore: string; name: string }[];
        for (const submission of submissions) {
          const mappedStatus: AssignmentStatus = submission.status === 'complete' ? 'graded' : submission.status === 'reviewing' ? 'submitted' : 'pending';
          submissionByTitle.set(submission.name, {
            status: mappedStatus,
            score: submission.finalScore !== '0' ? Number(submission.finalScore) : undefined,
          });
        }
      }

      const rows = (asgJson.data.assignments ?? []) as { id: string; title: string; course: string; type: 'coding' | 'essay' | 'multiple-choice' | 'file'; deadline: string | null }[];
      setAssignments(
        rows.map((row) => ({
          id: row.id,
          title: row.title,
          course: row.course,
          date: row.deadline ? row.deadline.replace('T', ' ').slice(0, 16) : '-',
          status: submissionByTitle.get(row.title)?.status ?? 'pending',
          type: row.type === 'coding' ? '코딩' : row.type === 'essay' ? '주관식' : '파일제출',
          score: submissionByTitle.get(row.title)?.score,
        })),
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  async function submitAssignment(assignmentId: string) {
    const res = await fetch('/api/v1/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignmentId,
        answer: '학생 제출 답안',
      }),
    });
    const json = await res.json();

    if (json.ok) {
      await loadAssignments();
    }
  }

  const pending = useMemo(() => assignments.filter((a) => a.status === 'pending').length, [assignments]);
  const submitted = useMemo(() => assignments.filter((a) => a.status === 'submitted').length, [assignments]);
  const graded = useMemo(() => assignments.filter((a) => a.status === 'graded').length, [assignments]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">과제</h1>
            <p className="mt-1 text-sm text-gray-500">실제 데이터 기반 과제 목록입니다.</p>
          </div>

          <div className="mb-6 flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-6 py-4">
            <div><span className="text-sm text-gray-500">제출대기</span><span className="ml-2 text-lg font-bold text-yellow-600">{pending}</span></div>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <div><span className="text-sm text-gray-500">제출완료</span><span className="ml-2 text-lg font-bold text-blue-600">{submitted}</span></div>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <div><span className="text-sm text-gray-500">채점완료</span><span className="ml-2 text-lg font-bold text-green-600">{graded}</span></div>
          </div>

          <section aria-label="과제 목록">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <th className="px-6 py-3">과제명</th>
                    <th className="px-6 py-3">강좌</th>
                    <th className="px-6 py-3">유형</th>
                    <th className="px-6 py-3">마감일</th>
                    <th className="px-6 py-3">상태</th>
                    <th className="px-6 py-3">점수</th>
                    <th className="px-6 py-3">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton columns={7} rows={3} />
                  ) :assignments.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">과제가 없습니다.</td></tr>
                  ) : (
                    assignments.map((assignment) => {
                      const statusCfg = STATUS_CONFIG[assignment.status];
                      return (
                        <tr key={assignment.id} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-800">{assignment.title}</td>
                          <td className="px-6 py-4 text-gray-600">{assignment.course}</td>
                          <td className="px-6 py-4"><Badge variant="default" size="sm">{assignment.type}</Badge></td>
                          <td className="px-6 py-4 text-gray-600">{assignment.date}</td>
                          <td className="px-6 py-4"><Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge></td>
                          <td className="px-6 py-4">{assignment.score !== undefined ? <span className="font-semibold text-gray-700">{assignment.score}점</span> : <span className="text-gray-300">—</span>}</td>
                          <td className="px-6 py-4">
                            {assignment.status === 'pending' ? (
                              <button type="button" onClick={() => submitAssignment(assignment.id)} className="text-sm font-medium text-blue-600 hover:text-blue-800">제출</button>
                            ) : (
                              <span className="text-xs text-gray-400">완료</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
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
