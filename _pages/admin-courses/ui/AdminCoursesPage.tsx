'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge, Button, TableSkeleton } from '@/shared/ui';

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

interface EnrolledStudentProfile {
  name: string;
  email: string;
  student_id: string;
  department: string;
}

interface EnrolledStudent {
  id: string;
  course_id: string;
  student_id: string;
  enrolled_at: string;
  profiles: EnrolledStudentProfile;
}

interface SearchStudent {
  id: string;
  name: string;
  email: string;
  student_id: string;
  department: string;
  already_enrolled: boolean;
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

  // Enrollment panel state
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchStudent[]>([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

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

  async function loadEnrolledStudents(courseId: string) {
    setEnrollmentLoading(true);
    const res = await fetch(`/api/v1/enrollments?courseId=${courseId}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.ok) {
      setEnrolledStudents(json.data?.enrollments ?? []);
    }
    setEnrollmentLoading(false);
  }

  function handleSelectCourse(course: CourseRecord) {
    setSelectedCourse(course.id);
    setSelectedCourseName(course.name);
    setSearchQuery('');
    setSearchResults([]);
    loadEnrolledStudents(course.id);
  }

  function handleBackToCourses() {
    setSelectedCourse(null);
    setSelectedCourseName('');
    setEnrolledStudents([]);
    setSearchQuery('');
    setSearchResults([]);
  }

  async function handleSearchStudents(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim() || !selectedCourse) return;
    setSearchLoading(true);
    const params = new URLSearchParams({ q: searchQuery, courseId: selectedCourse });
    const res = await fetch(`/api/v1/enrollments/search?${params.toString()}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.ok) {
      setSearchResults(json.data?.students ?? []);
    }
    setSearchLoading(false);
  }

  async function handleAddStudent(studentId: string) {
    if (!selectedCourse) return;
    setAddingId(studentId);
    const res = await fetch('/api/v1/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: selectedCourse, studentId }),
    });
    const json = await res.json();
    if (json.ok) {
      await loadEnrolledStudents(selectedCourse);
      // Mark student as enrolled in search results
      setSearchResults((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, already_enrolled: true } : s))
      );
    }
    setAddingId(null);
  }

  async function handleRemoveStudent(enrollmentId: string) {
    if (!selectedCourse) return;
    setRemovingId(enrollmentId);
    const res = await fetch(`/api/v1/enrollments/${enrollmentId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.ok) {
      await loadEnrolledStudents(selectedCourse);
      // If the removed student is in search results, unmark them
      const removed = enrolledStudents.find((e) => e.id === enrollmentId);
      if (removed) {
        setSearchResults((prev) =>
          prev.map((s) => (s.id === removed.student_id ? { ...s, already_enrolled: false } : s))
        );
      }
    }
    setRemovingId(null);
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 bg-gray-50 p-8">
          {selectedCourse ? (
            // ── Enrollment Management Panel ──────────────────────────────
            <div>
              <button
                className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
                onClick={handleBackToCourses}
              >
                ← 강좌 목록으로 돌아가기
              </button>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{selectedCourseName} 수강생 관리</h1>
              </div>

              {/* Enrolled students table */}
              <section aria-label="현재 수강생" className="mb-8">
                <h2 className="mb-3 text-base font-semibold text-gray-700">
                  현재 수강생 ({enrolledStudents.length}명)
                </h2>
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold text-gray-700">이름</th>
                        <th className="px-5 py-3 text-left font-semibold text-gray-700">이메일</th>
                        <th className="px-5 py-3 text-left font-semibold text-gray-700">학번</th>
                        <th className="px-5 py-3 text-left font-semibold text-gray-700">등록일</th>
                        <th className="px-5 py-3 text-left font-semibold text-gray-700">액션</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {enrollmentLoading ? (
                        <TableSkeleton columns={5} rows={3} />
                      ) : enrolledStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                            등록된 수강생이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        enrolledStudents.map((enrollment) => (
                          <tr key={enrollment.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium text-gray-900">
                              {enrollment.profiles?.name ?? '-'}
                            </td>
                            <td className="px-5 py-3 text-gray-600">
                              {enrollment.profiles?.email ?? '-'}
                            </td>
                            <td className="px-5 py-3 text-gray-600">
                              {enrollment.profiles?.student_id ?? '-'}
                            </td>
                            <td className="px-5 py-3 text-gray-600">
                              {enrollment.enrolled_at
                                ? new Date(enrollment.enrolled_at).toLocaleDateString('ko-KR')
                                : '-'}
                            </td>
                            <td className="px-5 py-3">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRemoveStudent(enrollment.id)}
                              >
                                {removingId === enrollment.id ? '삭제 중...' : '삭제'}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Student search + add */}
              <section aria-label="학생 추가">
                <h2 className="mb-3 text-base font-semibold text-gray-700">학생 추가</h2>
                <form onSubmit={handleSearchStudents} className="mb-4 flex items-center gap-3">
                  <input
                    type="search"
                    placeholder="이름, 이메일 또는 학번으로 검색"
                    aria-label="학생 검색"
                    className="w-80 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="sm" variant="secondary">
                    {searchLoading ? '검색 중...' : '검색'}
                  </Button>
                </form>

                {searchResults.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left font-semibold text-gray-700">이름</th>
                          <th className="px-5 py-3 text-left font-semibold text-gray-700">이메일</th>
                          <th className="px-5 py-3 text-left font-semibold text-gray-700">학번</th>
                          <th className="px-5 py-3 text-left font-semibold text-gray-700">액션</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {searchResults.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium text-gray-900">{student.name}</td>
                            <td className="px-5 py-3 text-gray-600">{student.email}</td>
                            <td className="px-5 py-3 text-gray-600">{student.student_id}</td>
                            <td className="px-5 py-3">
                              {student.already_enrolled ? (
                                <Badge variant="green">이미 등록</Badge>
                              ) : (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleAddStudent(student.id)}
                                >
                                  {addingId === student.id ? '추가 중...' : '추가'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          ) : (
            // ── Courses List ─────────────────────────────────────────────
            <>
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
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
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
                        <TableSkeleton columns={7} rows={3} />
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
                            <td className="px-5 py-3 flex items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => handleSelectCourse(course)}>상세</Button>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
