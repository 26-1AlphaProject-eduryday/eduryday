import Link from 'next/link';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge, ProgressBar } from '@/shared/ui';

interface ProfessorSummary {
  name: string;
  title: string;
}

interface ProfessorCourseCard {
  id: string;
  title: string;
  semester: string;
  students: number;
  currentWeek: number;
  totalWeeks: number;
}

interface ProfessorStat {
  label: string;
  value: string;
  valueClassName?: string;
}

interface ProfessorActivity {
  color: string;
  text: string;
}

interface SubmissionSummary {
  label: string;
  submitted: number;
  graded: number;
  pending: number;
}

const COURSE_ACCENTS = [
  'from-blue-500 to-cyan-400',
  'from-violet-500 to-fuchsia-400',
  'from-emerald-500 to-teal-400',
];

function CourseIcon({ index }: { index: number }) {
  return (
    <div
      className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${COURSE_ACCENTS[index % COURSE_ACCENTS.length]} text-lg font-bold text-white`}
      aria-hidden="true"
    >
      {index + 1}
    </div>
  );
}

export async function ProfessorDashboardPage({
  professor,
  courses,
  stats,
  activities,
  submissionSummary = [],
}: {
  professor: ProfessorSummary;
  courses: ProfessorCourseCard[];
  stats: ProfessorStat[];
  activities: ProfessorActivity[];
  submissionSummary?: SubmissionSummary[];
}) {

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar />

        <main className="flex-1 p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              안녕하세요, {professor.name} {professor.title}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              오늘의 강좌 현황을 확인하세요
            </p>
          </div>

          {/* Stats grid */}
          {stats.length > 0 ? (
            <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
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
          ) : (
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
              강의 통계 데이터가 아직 없습니다.
            </div>
          )}

          {/* 2-column layout (3:1) */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left col: courses (col-span-2) */}
            <section className="col-span-2" aria-label="내 강좌">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">내 강좌</h2>
                <Link
                  href="/professor/courses/create"
                  className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  새 강좌 만들기
                </Link>
              </div>

              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <article
                      key={course.id}
                      className="rounded-xl border border-gray-200 bg-white p-6"
                      aria-label={`${course.title} 강좌 카드`}
                    >
                      <div className="flex items-start gap-4">
                        <CourseIcon index={index} />

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
                            <Link
                              href={`/professor/courses/${course.id}/manage`}
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                            >
                              강좌관리
                            </Link>
                            <Link
                              href={`/professor/courses/${course.id}/assignments/create`}
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                            >
                              과제출제
                            </Link>
                            <Link
                              href={`/professor/courses/${course.id}/grading`}
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                            >
                              채점하기
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                  운영 중인 강좌가 없습니다.
                </div>
              )}
            </section>

            {/* Right col: recent activity */}
            <section aria-label="최근 활동">
              <h2 className="mb-4 text-lg font-semibold text-gray-700">
                최근 활동
              </h2>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                {activities.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-gray-500">최근 활동이 없습니다.</p>
                )}

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <a
                    href="/professor/analytics"
                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    전체 활동 보기 &rarr;
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Submission summary chart */}
          <section aria-label="제출 현황 요약">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              제출 현황 요약
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              {submissionSummary.length > 0 ? (
                <div className="space-y-5">
                  {submissionSummary.map((item) => {
                    const total = Math.max(item.submitted, item.graded + item.pending, 1);
                    const gradedPercent = Math.round((item.graded / total) * 100);
                    const pendingPercent = Math.round((item.pending / total) * 100);

                    return (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-800">{item.label}</span>
                          <span className="text-gray-500">
                            제출 {item.submitted}건 · 채점 {item.graded}건 · 검토 {item.pending}건
                          </span>
                        </div>
                        <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="bg-blue-500"
                            style={{ width: `${gradedPercent}%` }}
                            aria-label={`${item.label} 채점 완료 ${gradedPercent}%`}
                          />
                          <div
                            className="bg-yellow-400"
                            style={{ width: `${pendingPercent}%` }}
                            aria-label={`${item.label} 검토 대기 ${pendingPercent}%`}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      채점 완료
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      검토 대기
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">제출 현황 데이터가 아직 없습니다.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
