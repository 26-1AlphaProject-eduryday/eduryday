'use client';

import { useEffect, useMemo, useState } from 'react';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { Badge, FileUpload, TableSkeleton } from '@/shared/ui';

type AssignmentStatus = 'pending' | 'submitted' | 'graded';

interface Assignment {
  id: string;
  title: string;
  course: string;
  date: string;
  status: AssignmentStatus;
  type: '코딩' | '주관식' | '객관식' | '파일제출';
  score?: number;
}

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; variant: 'yellow' | 'blue' | 'green' }> = {
  pending: { label: '제출대기', variant: 'yellow' },
  submitted: { label: '제출완료', variant: 'blue' },
  graded: { label: '채점완료', variant: 'green' },
};

export function StudentAssignmentsPage({
  initialAssignments,
}: {
  initialAssignments?: Assignment[];
}) {
  const hasInitialAssignments = initialAssignments !== undefined;
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments ?? []);
  const [loading, setLoading] = useState(!hasInitialAssignments);
  const [submitModalId, setSubmitModalId] = useState<string | null>(null);
  const [submitAnswer, setSubmitAnswer] = useState('');
  const [submitFileUrl, setSubmitFileUrl] = useState<string>('');
  const [submitFileName, setSubmitFileName] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState(false);

  async function loadAssignments() {
    if (hasInitialAssignments) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const [asgRes, subRes] = await Promise.all([
      fetch('/api/v1/assignments', { cache: 'no-store' }),
      fetch('/api/v1/submissions', { cache: 'no-store' }),
    ]);
    const asgJson = await asgRes.json();
    const subJson = await subRes.json();

    if (asgJson.ok) {
      const submissionByAssignment = new Map<string, { status: AssignmentStatus; score?: number }>();

      if (subJson.ok) {
        const submissions = (subJson.data.submissions ?? []) as {
          assignmentId: string;
          status: 'submitted' | 'grading' | 'graded' | 'unsubmitted';
          finalScore: string;
        }[];
        for (const submission of submissions) {
          const mappedStatus: AssignmentStatus = submission.status === 'graded'
            ? 'graded'
            : submission.status === 'unsubmitted'
              ? 'pending'
              : 'submitted';
          submissionByAssignment.set(submission.assignmentId, {
            status: mappedStatus,
            score: submission.status === 'graded' ? Number(submission.finalScore) : undefined,
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
          status: submissionByAssignment.get(row.id)?.status ?? 'pending',
          type: row.type === 'coding' ? '코딩' : row.type === 'essay' ? '주관식' : row.type === 'multiple-choice' ? '객관식' : '파일제출',
          score: submissionByAssignment.get(row.id)?.score,
        })),
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!hasInitialAssignments) {
      loadAssignments();
    }
  }, [hasInitialAssignments]);

  async function handleSubmit() {
    const currentAssignment = assignments.find((a) => a.id === submitModalId);
    const isFileType = currentAssignment?.type === '파일제출';
    if (!submitModalId) return;
    if (isFileType ? !submitFileUrl : !submitAnswer.trim()) return;

    if (hasInitialAssignments) {
      setAssignments((items) =>
        items.map((item) =>
          item.id === submitModalId ? { ...item, status: 'submitted' } : item,
        ),
      );
      setSubmitModalId(null);
      setSubmitAnswer('');
      setSubmitFileUrl('');
      setSubmitFileName('');
      return;
    }

    setSubmitLoading(true);
    const res = await fetch('/api/v1/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignmentId: submitModalId,
        answer: submitAnswer.trim() || submitFileName,
        fileUrl: submitFileUrl || undefined,
      }),
    });
    const json = await res.json();
    setSubmitLoading(false);
    if (json.ok) {
      setSubmitModalId(null);
      setSubmitAnswer('');
      setSubmitFileUrl('');
      setSubmitFileName('');
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
                              <button type="button" onClick={() => setSubmitModalId(assignment.id)} className="text-sm font-medium text-blue-600 hover:text-blue-800">제출</button>
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

      {submitModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            {(() => {
              const currentAssignment = assignments.find((a) => a.id === submitModalId);
              const isFileType = currentAssignment?.type === '파일제출';
              const canSubmit = isFileType ? !!submitFileUrl : !!submitAnswer.trim();
              return (
                <>
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    {currentAssignment?.title}
                  </h3>
                  {isFileType ? (
                    <FileUpload
                      bucket="submission-files"
                      onUploaded={(filePath, filename) => {
                        setSubmitFileUrl(filePath);
                        setSubmitFileName(filename);
                      }}
                    />
                  ) : (
                    <textarea
                      value={submitAnswer}
                      onChange={(e) => setSubmitAnswer(e.target.value)}
                      placeholder="답안을 입력하세요"
                      rows={8}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  )}
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => { setSubmitModalId(null); setSubmitAnswer(''); setSubmitFileUrl(''); setSubmitFileName(''); }}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      disabled={submitLoading || !canSubmit}
                      onClick={handleSubmit}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      {submitLoading ? '제출 중...' : '제출'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
