'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';

export function ProfessorCourseCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('2026-1');
  const [section, setSection] = useState('01분반');
  const [studentCount, setStudentCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/v1/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        semester,
        section,
        studentCount,
      }),
    });

    const json = await res.json();
    setSubmitting(false);

    if (json.ok) {
      router.push('/professor/courses');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />
      <div className="flex flex-1">
        <ProfessorSidebar />
        <main className="flex-1 p-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">새 강좌 만들기</h1>
          <p className="mb-6 text-sm text-gray-500">강좌 기본 정보를 입력해 개설하세요.</p>

          <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <div>
              <label htmlFor="course-title" className="mb-1 block text-sm font-medium text-gray-700">강좌명</label>
              <input
                id="course-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="semester" className="mb-1 block text-sm font-medium text-gray-700">학기</label>
                <input
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="section" className="mb-1 block text-sm font-medium text-gray-700">분반</label>
                <input
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="student-count" className="mb-1 block text-sm font-medium text-gray-700">예상 수강생 수</label>
              <input
                id="student-count"
                type="number"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                min={0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <button type="submit" disabled={submitting} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
              {submitting ? '생성 중...' : '강좌 생성'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
