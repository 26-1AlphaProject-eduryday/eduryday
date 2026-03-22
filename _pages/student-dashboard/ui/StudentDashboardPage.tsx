import Link from 'next/link';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { ProgressBar } from '@/shared/ui';
import {
  getDbCurrentStudent,
  getDbDeadlines,
  getDbStudentCourses,
  getDbStudentDashboardStats,
} from '@/shared/lib/supabase/db-queries';

export async function StudentDashboardPage() {
  const [student, courses, deadlines] = await Promise.all([
    getDbCurrentStudent(),
    getDbStudentCourses(),
    getDbDeadlines(),
  ]);
  const stats = await getDbStudentDashboardStats(courses.length, deadlines.length);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar activeItem="대시보드" />

        <main className="flex-1 p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-700">안녕하세요, {student.name}님!</h1>
            <p className="mt-1 text-sm text-gray-500">오늘도 열심히 학습해봐요</p>
          </div>

          {/* Stats grid */}
          {stats.length > 0 ? (
            <div className="mb-8 grid grid-cols-4 gap-6">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-700">{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
              학습 통계 데이터가 아직 없습니다.
            </div>
          )}

          {/* Courses section */}
          <section className="mb-8" aria-label="수강 중인 강좌">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">수강 중인 강좌</h2>
              <Link
                href="/student/courses"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                전체 보기 &rarr;
              </Link>
            </div>

            {courses.length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.id}`}
                    className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    aria-label={`${course.title} 강좌 상세 보기`}
                  >
                    <div
                      className="h-32 bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="text-xs text-gray-400">강좌 썸네일</span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-700">{course.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{course.professor}</p>
                      <ProgressBar value={course.progress} color="blue" className="mt-3" />
                      <p className="mt-1.5 text-xs text-gray-500">진행률 {course.progress}%</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                수강 중인 강좌가 없습니다.
              </div>
            )}
          </section>

          {/* Upcoming deadlines */}
          <section aria-label="다가오는 마감">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">다가오는 마감</h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {deadlines.length > 0 ? (
                <ul className="space-y-3">
                  {deadlines.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                        <span className="text-xs text-gray-500">{item.course}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-sm font-semibold ${
                            item.ddayUrgent ? 'text-red-500' : 'text-gray-600'
                          }`}
                        >
                          {item.dday}
                        </span>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">다가오는 마감 일정이 없습니다.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
