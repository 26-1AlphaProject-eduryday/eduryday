import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge, ProgressBar } from '@/shared/ui';
import { MOCK_PROFESSOR_COURSES } from '@/entities/course';

export function ProfessorCoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar activeItem="내 강좌" />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-700">내 강좌</h1>
              <p className="mt-1 text-sm text-gray-500">
                운영 중인 강좌를 관리하세요
              </p>
            </div>
            <a
              href="/professor/courses/create"
              className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              새 강좌 만들기
            </a>
          </div>

          {/* Summary stats */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">운영 중인 강좌</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {MOCK_PROFESSOR_COURSES.length}개
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">전체 수강생</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {MOCK_PROFESSOR_COURSES.reduce((sum, c) => sum + c.students, 0)}명
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">평균 진행률</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {Math.round(
                  MOCK_PROFESSOR_COURSES.reduce(
                    (sum, c) => sum + (c.currentWeek / c.totalWeeks) * 100,
                    0,
                  ) / MOCK_PROFESSOR_COURSES.length,
                )}
                %
              </p>
            </div>
          </div>

          {/* Course cards */}
          <section aria-label="강좌 목록">
            <div className="space-y-4">
              {MOCK_PROFESSOR_COURSES.map((course) => {
                const progress = Math.round(
                  (course.currentWeek / course.totalWeeks) * 100,
                );
                return (
                  <article
                    key={course.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    aria-label={`${course.title} 강좌 카드`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Thumbnail placeholder */}
                      <div
                        className="h-20 w-20 flex-shrink-0 rounded-lg border border-dashed border-gray-300 bg-gray-100"
                        aria-hidden="true"
                      />

                      <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base font-bold text-gray-800">
                            {course.title}
                          </h2>
                          <Badge variant="green">진행 중</Badge>
                          <Badge variant="default">{course.students}명</Badge>
                        </div>

                        <p className="mt-0.5 text-sm text-gray-500">
                          {course.semester}
                        </p>

                        {/* Progress */}
                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-gray-500">강좌 진행률</span>
                            <span className="text-xs font-medium text-gray-600">
                              {course.currentWeek}/{course.totalWeeks}주차 &middot; {progress}%
                            </span>
                          </div>
                          <ProgressBar value={progress} color="blue" />
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex items-center gap-2">
                          <a
                            href={`/professor/courses/${course.id}/manage`}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                          >
                            강좌관리
                          </a>
                          <a
                            href={`/professor/courses/${course.id}/assignments/create`}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                          >
                            과제출제
                          </a>
                          <a
                            href={`/professor/courses/${course.id}/grading`}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                          >
                            채점하기
                          </a>

                          <span className="ml-auto text-xs text-gray-500">
                            마지막 수정: 3일 전
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Empty state hint */}
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              새 강좌를 개설하려면 오른쪽 상단의{' '}
              <strong className="font-medium text-gray-600">새 강좌 만들기</strong>{' '}
              버튼을 클릭하세요.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
