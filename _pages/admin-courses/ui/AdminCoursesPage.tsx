import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge, Button } from '@/shared/ui';
import { getAdminCourseStats, getAdminCourses } from '@/shared/lib/supabase/ui-seed';

type CourseStatus = '진행중' | '종료' | '대기';

const STATUS_BADGE: Record<CourseStatus, 'green' | 'default' | 'yellow'> = {
  진행중: 'green',
  종료: 'default',
  대기: 'yellow',
};

export async function AdminCoursesPage() {
  const [stats, courses] = await Promise.all([getAdminCourseStats(), getAdminCourses()]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar activeItem="강좌 관리" />

        <main className="flex-1 bg-gray-50 p-8">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">강좌 관리</h1>
            <p className="mt-1 text-sm text-gray-500">전체 강좌 현황을 관리합니다</p>
          </div>

          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="mb-4 flex items-center gap-3">
            <select
              aria-label="상태 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue="all"
            >
              <option value="all">전체 상태</option>
              <option value="active">진행중</option>
              <option value="ended">종료</option>
              <option value="pending">대기</option>
            </select>

            <select
              aria-label="학기 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue="2026-1"
            >
              <option value="2026-1">2026년 1학기</option>
              <option value="2025-2">2025년 2학기</option>
            </select>

            <input
              type="search"
              placeholder="강좌명 또는 교수명으로 검색"
              aria-label="강좌 검색"
              className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Courses table */}
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
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{course.name}</td>
                      <td className="px-5 py-3 text-gray-600">{course.professor}</td>
                      <td className="px-5 py-3 text-gray-600">{course.semester}</td>
                      <td className="px-5 py-3 text-gray-600">{course.studentCount}명</td>
                      <td className="px-5 py-3">
                        <Badge variant={STATUS_BADGE[course.status]}>{course.status}</Badge>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{course.createdAt}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="sm">상세</Button>
                          <Button variant="danger" size="sm">삭제</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>전체 12개 중 1-5 표시</p>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled
                  aria-label="이전 페이지"
                >
                  이전
                </button>
                <button
                  className="rounded-lg border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-white"
                  aria-current="page"
                >
                  1
                </button>
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                  2
                </button>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                  aria-label="다음 페이지"
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
