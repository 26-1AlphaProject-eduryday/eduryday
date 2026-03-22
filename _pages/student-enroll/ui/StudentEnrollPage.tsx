'use client';

import { useEffect, useState } from 'react';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';

interface EnrolledCourse {
  id: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
}

export function StudentEnrollPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEnrollments() {
    setLoading(true);
    const res = await fetch('/api/v1/enrollments', { cache: 'no-store' });
    const json = await res.json();
    if (json.ok) {
      setEnrolledCourses(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (json.data.enrollments ?? []).map((e: any) => ({
          id: e.id,
          courseId: e.course_id,
          courseTitle: e.courses?.title ?? '-',
          enrolledAt: e.enrolled_at?.replace('T', ' ').slice(0, 16) ?? '-',
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    loadEnrollments();
  }, []);

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    if (!code.trim()) {
      setMessage('수강신청 코드를 입력해주세요.');
      setMessageType('error');
      return;
    }

    setSubmitting(true);
    const res = await fetch('/api/v1/enrollments/self', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim() }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (json.ok) {
      setMessage(`"${json.data.courseTitle}" 강좌에 수강신청 완료!`);
      setMessageType('success');
      setCode('');
      await loadEnrollments();
    } else {
      setMessage(json.message ?? '수강신청에 실패했습니다.');
      setMessageType('error');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">수강신청</h1>
              <p className="mt-1 text-sm text-gray-500">
                교수님이 제공한 수강신청 코드를 입력하여 강좌에 등록하세요.
              </p>
            </div>

            {/* Enrollment Code Form */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">수강신청 코드 입력</h2>
              <form onSubmit={handleEnroll} className="space-y-4">
                <div>
                  <label htmlFor="enrollment-code" className="block text-sm font-medium text-gray-700 mb-1.5">
                    수강신청 코드
                  </label>
                  <input
                    id="enrollment-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="예: ALG2026"
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    disabled={submitting}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                {message && (
                  <div
                    className={`rounded-lg px-4 py-3 text-sm font-medium ${
                      messageType === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? '처리 중...' : '수강신청'}
                </button>
              </form>
            </div>

            {/* Enrolled Courses List */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">내 수강 목록</h2>
              {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">불러오는 중...</p>
              ) : enrolledCourses.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">수강 중인 강좌가 없습니다.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {enrolledCourses.map((course) => (
                    <li key={course.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.courseTitle}</p>
                        <p className="text-xs text-gray-400 mt-0.5">등록일: {course.enrolledAt}</p>
                      </div>
                      <a
                        href={`/student/courses/${course.courseId}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        강좌 보기 →
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
