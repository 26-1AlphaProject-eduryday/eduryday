'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';

type SubmissionStatus = 'complete' | 'reviewing' | 'unsubmitted';

interface SubmissionRow {
  id: string;
  name: string;
  studentId: string;
  submittedAt: string;
  autoScore: string;
  testsPassed: string;
  aiAnalysis: string;
  aiAnalysisVariant: 'green' | 'yellow' | 'red';
  aiSubNote?: string;
  finalScore: string;
  status: SubmissionStatus;
}

const STATUS_BADGE: Record<SubmissionStatus, { label: string; variant: 'green' | 'yellow' | 'red' }> = {
  complete: { label: '완료', variant: 'green' },
  reviewing: { label: '검토중', variant: 'yellow' },
  unsubmitted: { label: '미제출', variant: 'red' },
};

export function GradingStatusPage() {
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSubmissions() {
    setLoading(true);
    const res = await fetch('/api/v1/submissions', { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      setRows(json.data.submissions as SubmissionRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function updateScore(id: string, score: number) {
    const res = await fetch(`/api/v1/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalScore: score }),
    });

    const json = await res.json();

    if (json.ok) {
      await loadSubmissions();
    }
  }

  const submittedCount = useMemo(() => rows.filter((row) => row.status !== 'unsubmitted').length, [rows]);
  const completeCount = useMemo(() => rows.filter((row) => row.status === 'complete').length, [rows]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />
      <div className="flex flex-1">
        <ProfessorSidebar activeItem="채점 현황" />

        <main className="flex-1 p-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">채점 현황</h1>
              <p className="mt-1 text-sm text-gray-500">제출 상태를 확인하고 최종 점수를 확정하세요.</p>
            </div>
            <button
              type="button"
              onClick={loadSubmissions}
              className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white"
            >
              새로고침
            </button>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">전체 학생</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{rows.length}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">제출 완료</p>
              <p className="mt-1 text-3xl font-bold text-green-600">{submittedCount}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">채점 완료</p>
              <p className="mt-1 text-3xl font-bold text-blue-600">{completeCount}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
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
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">로딩 중...</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">제출 데이터가 없습니다.</td></tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className={row.status === 'unsubmitted' ? 'bg-red-50' : ''}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.studentId}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.submittedAt}</td>
                      <td className="px-4 py-3 text-gray-700">{row.autoScore}</td>
                      <td className="px-4 py-3 text-gray-700">{row.aiAnalysis}</td>
                      <td className="px-4 py-3 text-gray-700">{row.finalScore}</td>
                      <td className="px-4 py-3"><Badge variant={STATUS_BADGE[row.status].variant}>{STATUS_BADGE[row.status].label}</Badge></td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            const nextScore = window.prompt('최종 점수를 입력하세요', row.finalScore);
                            if (nextScore === null) {
                              return;
                            }
                            const value = Number(nextScore);
                            if (Number.isFinite(value)) {
                              updateScore(row.id, value);
                            }
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          점수저장
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
