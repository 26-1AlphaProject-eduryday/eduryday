import { StudentDashboardPage } from '@/_pages/student-dashboard/ui/StudentDashboardPage';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface EnrollmentRow {
  course_id: string;
}

interface CourseRow {
  id: string;
  title: string;
  professor_name: string;
  current_week: number;
  total_weeks: number;
}

interface AssignmentJoinRow {
  id: string;
  title: string;
  deadline: string | null;
  courses: { title: string } | { title: string }[] | null;
}

interface SubmissionCountRow {
  id: string;
}

export default async function StudentDashboardRoute() {
  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  if (!auth || !client || auth.role !== 'student') {
    return <StudentDashboardPage student={{ name: '학생' }} courses={[]} deadlines={[]} stats={[]} />;
  }

  const [{ data: profile }, { data: enrollments }, { data: submissionRows }] = await Promise.all([
    client.from('profiles').select('name').eq('id', auth.userId).maybeSingle(),
    client.from('enrollments').select('course_id').eq('student_id', auth.userId),
    client.from('submissions').select('id').eq('student_id', auth.userId),
  ]);

  const courseIds = ((enrollments ?? []) as EnrollmentRow[]).map((row) => row.course_id);

  if (courseIds.length === 0) {
    return <StudentDashboardPage student={{ name: profile?.name ?? '학생' }} courses={[]} deadlines={[]} stats={[]} />;
  }

  const [courseRowsResult, assignmentRowsResult] = await Promise.all([
    client
      .from('courses')
      .select('id, title, professor_name, current_week, total_weeks')
      .in('id', courseIds)
      .order('created_at', { ascending: false }),
    client
      .from('assignments')
      .select('id, title, deadline, courses(title)')
      .in('course_id', courseIds)
      .eq('status', 'active')
      .order('deadline', { ascending: true }),
  ]);

  const courses = ((courseRowsResult.data ?? []) as CourseRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    professor: row.professor_name,
    progress: row.total_weeks > 0 ? Math.min(100, Math.round((row.current_week / row.total_weeks) * 100)) : 0,
  }));

  const now = new Date();
  const deadlines = ((assignmentRowsResult.data ?? []) as AssignmentJoinRow[]).slice(0, 5).map((row) => {
    const courseValue = row.courses;
    const course = Array.isArray(courseValue) ? courseValue[0] : courseValue;
    const deadlineDate = row.deadline ? new Date(row.deadline) : null;
    const diffMs = deadlineDate ? deadlineDate.getTime() - now.getTime() : 0;
    const diffDays = deadlineDate ? Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24))) : 0;

    return {
      id: row.id,
      title: row.title,
      course: course?.title ?? '-',
      dday: deadlineDate ? `D-${diffDays}` : '일정 미정',
      ddayUrgent: diffDays <= 2,
      date: deadlineDate ? deadlineDate.toLocaleString('en-US', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
    };
  });

  const stats = [
    { label: '수강중인 강좌', value: `${courses.length}개` },
    { label: '제출대기 과제', value: `${deadlines.length}개` },
    { label: '제출 완료', value: `${((submissionRows ?? []) as SubmissionCountRow[]).length}개` },
    {
      label: '평균 진도',
      value: courses.length > 0 ? `${Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%` : '0%',
    },
  ];

  return <StudentDashboardPage student={{ name: profile?.name ?? '학생' }} courses={courses} deadlines={deadlines} stats={stats} />;
}
