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

interface EnrolledStudent {
  enrollmentId: string;
  studentUserId: string;
  name: string;
  email: string;
  studentNumber: string | null;
  department: string | null;
  enrolledAt: string;
}

interface SearchResult {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  department: string | null;
  enrolled: boolean;
}

export function ProfessorCourseManagePage({ courseId }: ProfessorCourseManagePageProps) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Enrollment state
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState('');
  const [enrollMessageType, setEnrollMessageType] = useState<'success' | 'error'>('success');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  async function loadCourse() {
    setLoading(true);
    const res = await fetch(`/api/v1/courses/${courseId}`, { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      setCourse(json.data as CourseDetail);
    }

    setLoading(false);
  }

  async function loadEnrolledStudents() {
    setEnrollLoading(true);
    const res = await fetch(`/api/v1/enrollments?courseId=${courseId}`, { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      type EnrollmentRow = {
        id: string;
        student_id: string;
        enrolled_at: string;
        profiles: { name: string; email: string; student_id: string | null; department: string | null } | null;
      };
      const rows: EnrolledStudent[] = (json.data.enrollments as EnrollmentRow[]).map((e) => ({
        enrollmentId: e.id,
        studentUserId: e.student_id,
        name: e.profiles?.name ?? '알 수 없음',
        email: e.profiles?.email ?? '-',
        studentNumber: e.profiles?.student_id ?? null,
        department: e.profiles?.department ?? null,
        enrolledAt: e.enrolled_at,
      }));
      setEnrolledStudents(rows);
    }

    setEnrollLoading(false);
  }

  useEffect(() => {
    loadCourse();
    loadEnrolledStudents();
  }, [courseId]);

  async function saveChanges() {
    if (!course) {
      return;
    }

    const res = await fetch(`/api/v1/courses/${courseId}`, {
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
    const json = await res.json();

    if (json.ok) {
      setMessage('저장되었습니다.');
      setMessageType('success');
    } else {
      setMessage('저장에 실패했습니다.');
      setMessageType('error');
    }
  }

  async function handleSearch() {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const res = await fetch(
      `/api/v1/enrollments/search?q=${encodeURIComponent(searchQuery)}&courseId=${courseId}`,
      { cache: 'no-store' },
    );
    const json = await res.json();
    if (json.ok) {
      setSearchResults(json.data.students as SearchResult[]);
    }
    setSearchLoading(false);
  }

  async function handleEnroll(studentId: string) {
    setAddingId(studentId);
    const res = await fetch('/api/v1/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, studentId }),
    });
    const json = await res.json();
    if (json.ok) {
      setEnrollMessage('수강생이 추가되었습니다.');
      setEnrollMessageType('success');
      await loadEnrolledStudents();
      // Mark as enrolled in search results
      setSearchResults((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, enrolled: true } : s)),
      );
    } else {
      setEnrollMessage(json.message ?? '추가에 실패했습니다.');
      setEnrollMessageType('error');
    }
    setAddingId(null);
  }

  async function handleRemove(enrollmentId: string) {
    setRemovingId(enrollmentId);
    const res = await fetch(`/api/v1/enrollments/${enrollmentId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.ok) {
      setEnrollMessage('수강생이 삭제되었습니다.');
      setEnrollMessageType('success');
      setEnrolledStudents((prev) => prev.filter((s) => s.enrollmentId !== enrollmentId));
      // Refresh search results to unmark enrolled state
      if (searchResults.length > 0) {
        const removed = enrolledStudents.find((s) => s.enrollmentId === enrollmentId);
        if (removed) {
          setSearchResults((prev) =>
            prev.map((s) => (s.id === removed.studentUserId ? { ...s, enrolled: false } : s)),
          );
        }
      }
    } else {
      setEnrollMessage(json.message ?? '삭제에 실패했습니다.');
      setEnrollMessageType('error');
    }
    setRemovingId(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />
      <div className="flex flex-1">
        <ProfessorSidebar />
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              {message ? (
                <p className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
              ) : null}
            </div>
          )}

          {/* 수강생 관리 섹션 */}
          <div className="mt-8 max-w-3xl rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">수강생 관리</h2>

            {/* 현재 수강생 목록 */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-gray-700">
                현재 수강생{' '}
                <span className="text-gray-500">({enrollLoading ? '...' : `${enrolledStudents.length}명`})</span>
              </p>

              {enrollLoading ? (
                <p className="text-sm text-gray-400">불러오는 중...</p>
              ) : enrolledStudents.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
                  등록된 수강생이 없습니다.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                        <th className="pb-2 pr-4 font-medium">이름</th>
                        <th className="pb-2 pr-4 font-medium">이메일</th>
                        <th className="pb-2 pr-4 font-medium">학번</th>
                        <th className="pb-2 pr-4 font-medium">소속</th>
                        <th className="pb-2 pr-4 font-medium">등록일</th>
                        <th className="pb-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map((s) => (
                        <tr key={s.enrollmentId} className="border-b border-gray-50 last:border-0">
                          <td className="py-2 pr-4 font-medium text-gray-900">{s.name}</td>
                          <td className="py-2 pr-4 text-gray-600">{s.email}</td>
                          <td className="py-2 pr-4 text-gray-600">{s.studentNumber ?? '-'}</td>
                          <td className="py-2 pr-4 text-gray-600">{s.department ?? '-'}</td>
                          <td className="py-2 pr-4 text-gray-500">{new Date(s.enrolledAt).toLocaleDateString('ko-KR')}</td>
                          <td className="py-2">
                            <button
                              type="button"
                              disabled={removingId === s.enrollmentId}
                              onClick={() => handleRemove(s.enrollmentId)}
                              className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {removingId === s.enrollmentId ? '삭제 중...' : '삭제'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 구분선 */}
            <hr className="mb-6 border-gray-100" />

            {/* 학생 검색 및 추가 */}
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700">학생 검색 및 추가</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="학생 이름, 이메일 또는 학번으로 검색"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {searchLoading ? '검색 중...' : '검색'}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                        <th className="pb-2 pr-4 font-medium">이름</th>
                        <th className="pb-2 pr-4 font-medium">이메일</th>
                        <th className="pb-2 pr-4 font-medium">학번</th>
                        <th className="pb-2 pr-4 font-medium">소속</th>
                        <th className="pb-2 font-medium">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((s) => (
                        <tr key={s.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-2 pr-4 font-medium text-gray-900">{s.name}</td>
                          <td className="py-2 pr-4 text-gray-600">{s.email}</td>
                          <td className="py-2 pr-4 text-gray-600">{s.studentId ?? '-'}</td>
                          <td className="py-2 pr-4 text-gray-600">{s.department ?? '-'}</td>
                          <td className="py-2">
                            {s.enrolled ? (
                              <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">이미 등록</span>
                            ) : (
                              <button
                                type="button"
                                disabled={addingId === s.id}
                                onClick={() => handleEnroll(s.id)}
                                className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                              >
                                {addingId === s.id ? '추가 중...' : '추가'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <p className="mt-3 text-sm text-gray-400">검색 결과가 없습니다.</p>
              )}
            </div>

            {enrollMessage ? (
              <p className={`mt-4 text-sm ${enrollMessageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {enrollMessage}
              </p>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
