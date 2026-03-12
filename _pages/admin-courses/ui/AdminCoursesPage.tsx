'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge, Button } from '@/shared/ui';

type CourseStatus = '진행중' | '종료' | '대기';

interface CourseRecord {
  id: string;
  name: string;
  professor: string;
  semester: string;
  studentCount: number;
  status: CourseStatus;
  createdAt: string;
}

interface CourseResponse {
  courses: CourseRecord[];
  total: number;
  page: number;
  pageSize: number;
}

const STATUS_BADGE: Record<CourseStatus, 'green' | 'default' | 'yellow'> = {
  진행중: 'green',
  종료: 'default',
  대기: 'yellow',
};

export function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  async function loadCourses() {
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      status: statusFilter,
      semester: semesterFilter,
      q: query,
    });

    const res = await fetch(`/api/v1/courses?${params.toString()}`, { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      const data = json.data as CourseResponse;
      setCourses(data.courses);
      setTotal(data.total);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCourses();
  }, [page, statusFilter, semesterFilter]);

  async function handleDelete(courseId: string) {
    const res = await fetch(`/api/v1/courses/${courseId}`, { method: 'DELETE' });
    const json = await res.json();

    if (json.ok) {
      await loadCourses();
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    await loadCourses();
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar activeItem="강좌 관리" />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">강좌 관리</h1>
            <p className="mt-1 text-sm text-gray-500">전체 강좌 현황을 관리합니다</p>
          </div>

          <form onSubmit={handleSearch} className="mb-4 flex items-center gap-3">
            <select
              aria-label="상태 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="active">진행중</option>
              <option value="closed">종료</option>
              <option value="pending">대기</option>
            </select>

            <input
              type="text"
              placeholder="학기 (예: 2026-1)"
              className="w-44 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
              value={semesterFilter === 'all' ? '' : semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value.trim() || 'all')}
            />

            <input
              type="search"
              placeholder="강좌명 또는 교수명 검색"
              aria-label="강좌 검색"
              className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="sm" variant="secondary">검색</Button>
          </form>

          <section aria-label="강좌 목록">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">강좌명</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">교수</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">학기</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">수강생</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">상태</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">생성일</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">로딩 중...</td></tr>
                  ) : courses.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">강좌가 없습니다.</td></tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-900">{course.name}</td>
                        <td className="px-5 py-3 text-gray-600">{course.professor}</td>
                        <td className="px-5 py-3 text-gray-600">{course.semester}</td>
                        <td className="px-5 py-3 text-gray-600">{course.studentCount}명</td>
                        <td className="px-5 py-3"><Badge variant={STATUS_BADGE[course.status]}>{course.status}</Badge></td>
                        <td className="px-5 py-3 text-gray-600">{course.createdAt}</td>
                        <td className="px-5 py-3">
                          <Button variant="danger" size="sm" onClick={() => handleDelete(course.id)}>삭제</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>전체 {total}개 중 {(page - 1) * pageSize + 1}-{Math.min(total, page * pageSize)} 표시</p>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  이전
                </button>
                <span className="px-2">{page}/{totalPages}</span>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  다음
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
