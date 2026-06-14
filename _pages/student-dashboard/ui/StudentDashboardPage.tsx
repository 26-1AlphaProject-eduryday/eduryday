import Link from 'next/link';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { ProgressBar } from '@/shared/ui';

interface DashboardStudent {
  name: string;
}

interface DashboardCourse {
  id: string;
  title: string;
  professor: string;
  progress: number;
}

interface DashboardDeadline {
  id: string;
  title: string;
  course: string;
  dday: string;
  ddayUrgent: boolean;
  date: string;
}

interface DashboardStat {
  label: string;
  value: string;
}

const COURSE_VISUALS = [
  {
    accent: 'from-blue-600 to-cyan-500',
    eyebrow: 'Graph',
    marks: ['BFS', 'DFS', 'Queue'],
  },
  {
    accent: 'from-violet-600 to-fuchsia-500',
    eyebrow: 'Data',
    marks: ['Stack', 'Tree', 'Hash'],
  },
  {
    accent: 'from-emerald-600 to-teal-500',
    eyebrow: 'Web',
    marks: ['React', 'API', 'State'],
  },
];

function CourseVisual({ index, title }: { index: number; title: string }) {
  const visual = COURSE_VISUALS[index % COURSE_VISUALS.length];

  return (
    <div
      className={`relative h-32 overflow-hidden bg-gradient-to-br ${visual.accent}`}
      aria-hidden="true"
    >
      <div className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
        {visual.eyebrow}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-lg font-bold text-white">{title}</p>
        <div className="mt-3 flex gap-2">
          {visual.marks.map((mark) => (
            <span
              key={mark}
              className="rounded-md bg-white/18 px-2 py-1 text-[11px] font-medium text-white"
            >
              {mark}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
      <div className="absolute bottom-6 right-6 h-12 w-12 rounded-xl border border-white/25 bg-white/10" />
    </div>
  );
}

export async function StudentDashboardPage({
  student,
  courses,
  deadlines,
  stats,
}: {
  student: DashboardStudent;
  courses: DashboardCourse[];
  deadlines: DashboardDeadline[];
  stats: DashboardStat[];
}) {

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar />

        <main className="flex-1 p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">안녕하세요, {student.name}님!</h1>
            <p className="mt-1 text-sm text-gray-500">오늘도 열심히 학습해봐요</p>
          </div>

          {/* Stats grid */}
          {stats.length > 0 ? (
            <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.id}`}
                    className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    aria-label={`${course.title} 강좌 상세 보기`}
                  >
                    <CourseVisual index={index} title={course.title} />

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
