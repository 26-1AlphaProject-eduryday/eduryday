import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge, ProgressBar } from '@/shared/ui';
import {
  getCurrentProfessor,
  getProfessorActivities,
  getProfessorCourses,
  getProfessorDashboardStats,
} from '@/shared/lib/supabase/ui-seed';

export async function ProfessorDashboardPage() {
  const [professor, courses, stats, activities] = await Promise.all([
    getCurrentProfessor(),
    getProfessorCourses(),
    getProfessorDashboardStats(),
    getProfessorActivities(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar activeItem="대시보드" />

        <main className="flex-1 p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-700">
              안녕하세요, {professor.name} {professor.title}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              오늘의 강좌 현황을 확인하세요
            </p>
          </div>

          {/* Stats grid */}
          <div className="mb-8 grid grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    stat.valueClassName ?? 'text-gray-700'
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* 2-column layout (3:1) */}
          <div className="mb-8 grid grid-cols-3 gap-6">
            {/* Left col: courses (col-span-2) */}
            <section className="col-span-2" aria-label="내 강좌">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">내 강좌</h2>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  새 강좌 만들기
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <article
                    key={course.id}
                    className="rounded-xl border border-gray-200 bg-white p-6"
                    aria-label={`${course.title} 강좌 카드`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div
                        className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200 border border-dashed border-gray-300"
                        aria-hidden="true"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-800">
                            {course.title}
                          </h3>
                          <Badge variant="green">진행 중</Badge>
                          <Badge variant="default">{course.students}명</Badge>
                        </div>

                        <p className="mt-0.5 text-sm text-gray-500">
                          {course.semester}
                        </p>

                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-gray-500">진행률</span>
                            <span className="text-xs text-gray-500">
                              {course.currentWeek}/{course.totalWeeks}주차
                            </span>
                          </div>
                          <ProgressBar value={Math.round((course.currentWeek / course.totalWeeks) * 100)} color="blue" />
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                          >
                            강좌관리
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                          >
                            과제출제
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                          >
                            채점하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Right col: recent activity */}
            <section aria-label="최근 활동">
              <h2 className="mb-4 text-lg font-semibold text-gray-700">
                최근 활동
              </h2>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <ul className="space-y-4">
                  {activities.map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${item.color}`}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-700">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <a
                    href="/professor/activity"
                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    전체 활동 보기 &rarr;
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Submission summary chart placeholder */}
          <section aria-label="제출 현황 요약">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              제출 현황 요약
            </h2>
            <div
              className="flex h-48 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white"
              aria-label="제출 현황 차트 영역"
            >
              <span className="text-sm text-gray-400">차트 영역</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
