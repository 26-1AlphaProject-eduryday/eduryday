'use client';

import { useMemo, useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';

function getGrade(score: number): { label: string; variant: 'green' | 'blue' | 'yellow' | 'red' | 'default' } {
  if (score >= 90) return { label: 'A', variant: 'green' };
  if (score >= 80) return { label: 'B', variant: 'blue' };
  if (score >= 70) return { label: 'C', variant: 'yellow' };
  if (score >= 60) return { label: 'D', variant: 'red' };
  return { label: 'F', variant: 'default' };
}

interface ProfessorCourseOption {
  id: string;
  title: string;
  semester: string;
}

interface ProfessorGradeRow {
  id: string;
  courseId: string;
  courseTitle: string;
  assignmentTitle: string;
  name: string;
  studentId: string;
  submittedAt: string;
  autoScore: number | null;
  finalScore: number | null;
  status: 'submitted' | 'reviewing' | 'complete' | 'unsubmitted';
}

interface ProfessorGradesPageProps {
  rows: ProfessorGradeRow[];
  courses: ProfessorCourseOption[];
}

export function ProfessorGradesPage({ rows, courses }: ProfessorGradesPageProps) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id ?? 'all');

  const filteredRows = useMemo(
    () => (selectedCourse === 'all' ? rows : rows.filter((row) => row.courseId === selectedCourse)),
    [rows, selectedCourse],
  );

  const scoredRows = filteredRows.filter((row) => row.finalScore !== null && row.status !== 'unsubmitted');
  const scores = scoredRows.map((row) => row.finalScore ?? 0);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const submissionRate =
    filteredRows.length > 0
      ? Math.round((filteredRows.filter((row) => row.status !== 'unsubmitted').length / filteredRows.length) * 100)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">학생 성적 관리</h1>
            <p className="mt-1 text-sm text-gray-500">실제 제출 데이터 기준으로 학생별 성적을 확인합니다.</p>
          </div>

          <div className="mb-6">
            <label htmlFor="course-select" className="mb-1.5 block text-sm font-medium text-gray-700">
              강좌 선택
            </label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-80 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="all">전체 강좌</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.semester})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">행 수</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{filteredRows.length}건</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">평균 점수</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{avgScore}점</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">최고 점수</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{maxScore}점</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">제출률</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{submissionRate}%</p>
            </div>
          </div>

          <section aria-label="학생 성적 테이블">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">학생명</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">학번</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">강좌</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">과제</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">자동 점수</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">최종 점수</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">등급</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                        제출 데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => {
                      const score = row.finalScore ?? 0;
                      const grade = getGrade(score);

                      return (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-gray-800">{row.name}</td>
                          <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{row.studentId}</td>
                          <td className="px-4 py-3.5 text-gray-700">{row.courseTitle}</td>
                          <td className="px-4 py-3.5 text-gray-700">{row.assignmentTitle}</td>
                          <td className="px-4 py-3.5 text-center text-gray-700">
                            {row.autoScore === null ? <span className="text-gray-300">-</span> : `${row.autoScore}점`}
                          </td>
                          <td className="px-4 py-3.5 text-center font-semibold text-gray-800">
                            {row.finalScore === null ? <span className="text-gray-300">-</span> : `${row.finalScore}점`}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {row.finalScore === null ? <Badge variant="default">-</Badge> : <Badge variant={grade.variant}>{grade.label}</Badge>}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <Badge variant={row.status === 'complete' ? 'green' : row.status === 'unsubmitted' ? 'red' : 'yellow'}>
                              {row.status === 'complete' ? '완료' : row.status === 'unsubmitted' ? '미제출' : '검토중'}
                            </Badge>
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
