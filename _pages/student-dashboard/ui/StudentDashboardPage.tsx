import Link from 'next/link';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { ProgressBar } from '@/shared/ui';
import { getSupabaseAuthServerClient } from '@/shared/lib/supabase/auth-server';
import { getServiceRoleClient } from '@/shared/lib/supabase/route';

interface EnrolledCourseRow {
  course_id: string;
  courses: {
    id: string;
    title: string;
    professor_name: string;
    current_week: number;
    total_weeks: number;
  } | null;
}

interface DeadlineRow {
  id: string;
  title: string;
  deadline: string | null;
  courses: { title: string } | null;
}

export async function StudentDashboardPage() {
  const authClient = await getSupabaseAuthServerClient();
  const client = getServiceRoleClient();

  let studentName = '학생';
  let enrolledCourses: Array<{ id: string; title: string; professor: string; progress: number }> = [];
  let upcomingDeadlines: Array<{ id: string; title: string; course: string; deadline: string }> = [];

  if (authClient) {
    const { data: { user } } = await authClient.auth.getUser();

    if (user && client) {
      const [profileRow, enrollmentRows, deadlineRows] = await Promise.all([
        client.from('profiles').select('name').eq('id', user.id).maybeSingle(),
        client
          .from('enrollments')
          .select('course_id, courses(id, title, professor_name, current_week, total_weeks)')
          .eq('student_id', user.id)
          .limit(6),
        client
          .from('assignments')
          .select('id, title, deadline, courses(title)')
          .eq('status', 'active')
          .not('deadline', 'is', null)
          .order('deadline', { ascending: true })
          .limit(5),
      ]);

      if (profileRow.data?.name) {
        studentName = profileRow.data.name;
      }

      const rawEnrollments = (enrollmentRows.data ?? []) as unknown as EnrolledCourseRow[];
      enrolledCourses = rawEnrollments
        .filter((e) => e.courses)
        .map((e) => ({
          id: e.courses!.id,
          title: e.courses!.title,
          professor: e.courses!.professor_name,
          progress: e.courses!.total_weeks > 0
            ? Math.round((e.courses!.current_week / e.courses!.total_weeks) * 100)
            : 0,
        }));

      const rawDeadlines = (deadlineRows.data ?? []) as unknown as DeadlineRow[];
      upcomingDeadlines = rawDeadlines.map((d) => ({
        id: d.id,
        title: d.title,
        course: Array.isArray(d.courses) ? d.courses[0]?.title ?? '-' : d.courses?.title ?? '-',
        deadline: d.deadline ? d.deadline.slice(0, 10) : '-',
      }));
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar activeItem="대시보드" />

        <main className="flex-1 p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-700">안녕하세요, {studentName}님!</h1>
            <p className="mt-1 text-sm text-gray-500">오늘도 열심히 학습해봐요</p>
          </div>

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

            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
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
              {upcomingDeadlines.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingDeadlines.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                        <span className="text-xs text-gray-500">{item.course}</span>
                      </div>
                      <span className="text-sm text-gray-500">{item.deadline}</span>
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
