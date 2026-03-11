'use client';

import { useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';
import type { Submission } from '@/entities/submission';
import type { ProfessorCourse } from '@/entities/course';

function getGrade(score: number): { label: string; variant: 'green' | 'blue' | 'yellow' | 'red' | 'default' } {
  if (score >= 90) return { label: 'A', variant: 'green' };
  if (score >= 80) return { label: 'B', variant: 'blue' };
  if (score >= 70) return { label: 'C', variant: 'yellow' };
  if (score >= 60) return { label: 'D', variant: 'red' };
  return { label: 'F', variant: 'default' };
}

interface ProfessorGradesPageProps {
  submissions: Submission[];
  courses: ProfessorCourse[];
}

function buildGradeRows(submissions: Submission[]) {
  return submissions.map((s) => {
  const score = parseInt(s.finalScore, 10) || 0;
  return {
    id: s.id,
    name: s.name,
    studentId: s.studentId,
    assignment1: s.status === 'unsubmitted' ? null : Math.max(0, score - 5),
    assignment2: s.status === 'unsubmitted' ? null : score,
    assignment3: s.status === 'unsubmitted' ? null : Math.min(100, score + 3),
    total: s.status === 'unsubmitted' ? 0 : score,
    status: s.status,
  };
});
}

export function ProfessorGradesPage({ submissions, courses }: ProfessorGradesPageProps) {
  const gradeRows = buildGradeRows(submissions);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id ?? '');

  const selectedCourseName =
    courses.find((c) => c.id === selectedCourse)?.title ?? '';

  const scores = gradeRows
    .filter((r) => r.status !== 'unsubmitted')
    .map((r) => r.total);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const distributionBuckets = [
    { label: 'A (90~100)', count: scores.filter((score) => score >= 90).length, color: 'bg-green-500' },
    { label: 'B (80~89)', count: scores.filter((score) => score >= 80 && score < 90).length, color: 'bg-blue-500' },
    { label: 'C (70~79)', count: scores.filter((score) => score >= 70 && score < 80).length, color: 'bg-yellow-400' },
    { label: 'D (60~69)', count: scores.filter((score) => score >= 60 && score < 70).length, color: 'bg-orange-400' },
    { label: 'F (0~59)', count: scores.filter((score) => score < 60).length, color: 'bg-red-400' },
  ];
  const submissionRate =
    gradeRows.length > 0
      ? Math.round(
          (gradeRows.filter((r) => r.status !== 'unsubmitted').length / gradeRows.length) *
            100,
        )
      : 0;
  const maxBarCount = Math.max(...distributionBuckets.map((bucket) => bucket.count), 1);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar activeItem="성적 관리" />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-700">학생 성적 관리</h1>
              <p className="mt-1 text-sm text-gray-500">
                강좌를 선택하여 학생별 성적을 확인하세요
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              aria-label="엑셀 파일로 성적 내보내기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              엑셀 내보내기
            </button>
          </div>

          {/* Course selector */}
          <div className="mb-6">
            <label
              htmlFor="course-select"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              강좌 선택
            </label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.semester})
                </option>
              ))}
            </select>
          </div>

          {/* Summary stats */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">수강생 수</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                 {gradeRows.length}명
              </p>
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
              <p className="text-sm text-gray-500">미제출</p>
              <p className="mt-1 text-2xl font-bold text-red-500">
                 {gradeRows.filter((r) => r.status === 'unsubmitted').length}명
              </p>
            </div>
          </div>

          {/* Two-column: table + distribution */}
          <div className="grid grid-cols-3 gap-6">
            {/* Grades table */}
            <section className="col-span-2" aria-label="학생 성적 테이블">
              <h2 className="mb-3 text-base font-semibold text-gray-700">
                {selectedCourseName} &mdash; 성적 현황
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        학생명
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        학번
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        과제1
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        과제2
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        과제3
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        총점
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        등급
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {gradeRows.map((row) => {
                      const grade = getGrade(row.total);
                      return (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-gray-800">
                            {row.name}
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">
                            {row.studentId}
                          </td>
                          <td className="px-4 py-3.5 text-center text-gray-700">
                            {row.assignment1 !== null ? `${row.assignment1}점` : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center text-gray-700">
                            {row.assignment2 !== null ? `${row.assignment2}점` : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center text-gray-700">
                            {row.assignment3 !== null ? `${row.assignment3}점` : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center font-semibold text-gray-800">
                            {row.total}점
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <Badge variant={grade.variant}>{grade.label}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Grade distribution */}
            <section aria-label="성적 분포">
              <h2 className="mb-3 text-base font-semibold text-gray-700">성적 분포</h2>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-xs text-gray-500">학점별 학생 수</p>
                <div className="space-y-3">
                  {distributionBuckets.map((bucket) => (
                    <div key={bucket.label} className="flex items-center gap-3">
                      <span className="w-20 flex-shrink-0 text-xs text-gray-600">
                        {bucket.label}
                      </span>
                      <div className="flex-1 overflow-hidden rounded-full bg-gray-100 h-4">
                        <div
                          className={`h-full rounded-full ${bucket.color} transition-all duration-300`}
                          style={{
                            width: `${(bucket.count / maxBarCount) * 100}%`,
                            minWidth: bucket.count > 0 ? '8px' : '0',
                          }}
                          aria-label={`${bucket.label}: ${bucket.count}명`}
                        />
                      </div>
                      <span className="w-6 flex-shrink-0 text-right text-xs font-medium text-gray-700">
                        {bucket.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>평균</span>
                    <span className="font-semibold text-gray-700">{avgScore}점</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>최고</span>
                    <span className="font-semibold text-green-600">{maxScore}점</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>제출률</span>
                    <span className="font-semibold text-gray-700">
                      {submissionRate}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
