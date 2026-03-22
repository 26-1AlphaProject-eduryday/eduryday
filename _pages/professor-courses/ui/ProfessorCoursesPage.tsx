'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge, ProgressBar, Skeleton } from '@/shared/ui';

interface CourseItem {
  id: string;
  title: string;
  semester: string;
  students: number;
  currentWeek: number;
  totalWeeks: number;
}

export function ProfessorCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCourses() {
    setLoading(true);
    const res = await fetch('/api/v1/courses?page=1&pageSize=50', { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      const items = (json.data.courses ?? []) as {
        id: string;
        title?: string;
        name?: string;
        semester: string;
        students?: number;
        studentCount?: number;
        currentWeek?: number;
        totalWeeks?: number;
      }[];
      setCourses(
        items.map((item) => ({
          id: item.id,
          title: item.title ?? item.name ?? '-',
          semester: item.semester,
          students: item.students ?? item.studentCount ?? 0,
          currentWeek: item.currentWeek ?? 1,
          totalWeeks: item.totalWeeks ?? 15,
        })),
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  const avgProgress = useMemo(() => {
    if (courses.length === 0) {
      return 0;
    }

    return Math.round(
      courses.reduce((sum, course) => sum + (course.currentWeek / Math.max(course.totalWeeks, 1)) * 100, 0) / courses.length,
    );
  }, [courses]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">내 강좌</h1>
              <p className="mt-1 text-sm text-gray-500">운영 중인 강좌를 관리하세요</p>
            </div>
            <a href="/professor/courses/create" className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
              새 강좌 만들기
            </a>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">운영 중인 강좌</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{courses.length}개</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">전체 수강생</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{courses.reduce((sum, c) => sum + c.students, 0)}명</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">평균 진행률</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{avgProgress}%</p>
            </div>
          </div>

          <section aria-label="강좌 목록">
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3 p-6">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ) : courses.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">강좌가 없습니다.</div>
              ) : (
                courses.map((course) => {
                  const progress = Math.round((course.currentWeek / Math.max(course.totalWeeks, 1)) * 100);
                  return (
                    <article key={course.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="h-20 w-20 flex-shrink-0 rounded-lg border border-dashed border-gray-300 bg-gray-100" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-bold text-gray-800">{course.title}</h2>
                            <Badge variant="green">진행 중</Badge>
                            <Badge variant="default">{course.students}명</Badge>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">{course.semester}</p>
                          <div className="mt-3">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-xs text-gray-500">강좌 진행률</span>
                              <span className="text-xs font-medium text-gray-600">{course.currentWeek}/{course.totalWeeks}주차 · {progress}%</span>
                            </div>
                            <ProgressBar value={progress} color="blue" />
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <a href={`/professor/courses/${course.id}/manage`} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">강좌관리</a>
                            <a href={`/professor/courses/${course.id}/assignments/create`} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">과제출제</a>
                            <a href={`/professor/courses/${course.id}/grading`} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">채점하기</a>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
