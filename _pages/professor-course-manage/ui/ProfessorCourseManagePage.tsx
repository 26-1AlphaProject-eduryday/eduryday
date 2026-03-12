'use client';

import { useEffect, useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';

interface ProfessorCourseManagePageProps {
  courseId: string;
}

interface CourseDetail {
  id: string;
  title: string;
  semester: string;
  section: string | null;
  status: 'active' | 'closed' | 'draft' | 'pending';
  student_count: number;
  current_week: number;
  total_weeks: number;
}

export function ProfessorCourseManagePage({ courseId }: ProfessorCourseManagePageProps) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCourse() {
    setLoading(true);
    const res = await fetch(`/api/v1/courses/${courseId}`, { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      setCourse(json.data as CourseDetail);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function saveChanges() {
    if (!course) {
      return;
    }

    await fetch(`/api/v1/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: course.title,
        semester: course.semester,
        section: course.section,
        status: course.status,
        studentCount: course.student_count,
        currentWeek: course.current_week,
        totalWeeks: course.total_weeks,
      }),
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />
      <div className="flex flex-1">
        <ProfessorSidebar activeItem="내 강좌" />
        <main className="flex-1 p-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">강좌 관리</h1>
          <p className="mb-6 text-sm text-gray-500">강좌 정보와 운영 상태를 수정합니다.</p>

          {loading || !course ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">강좌 정보를 불러오는 중...</div>
          ) : (
            <div className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6">
              <div>
                <label htmlFor="course-title" className="mb-1 block text-sm font-medium text-gray-700">강좌명</label>
                <input
                  id="course-title"
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course-semester" className="mb-1 block text-sm font-medium text-gray-700">학기</label>
                  <input
                    id="course-semester"
                    value={course.semester}
                    onChange={(e) => setCourse({ ...course, semester: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="course-status" className="mb-1 block text-sm font-medium text-gray-700">상태</label>
                  <select
                    id="course-status"
                    value={course.status}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        status: e.target.value as CourseDetail['status'],
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="active">진행중</option>
                    <option value="closed">종료</option>
                    <option value="draft">초안</option>
                    <option value="pending">대기</option>
                  </select>
                </div>
              </div>
              <button type="button" onClick={saveChanges} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
                변경 저장
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
