import { ProfessorDashboardPage } from '@/_pages/professor-dashboard/ui/ProfessorDashboardPage';
import {
  demoProfessor,
  demoProfessorActivities,
  demoProfessorCourses,
  demoProfessorStats,
  demoSubmissionSummary,
  isVideoDemoMode,
} from '@/entities/demo-video';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface CourseRow {
  id: string;
  title: string;
  semester: string;
  student_count: number;
  current_week: number;
  total_weeks: number;
}

interface SubmissionRow {
  id: string;
  status: 'submitted' | 'grading' | 'graded' | 'unsubmitted';
}

interface ProfileRow {
  name: string;
}

export default async function ProfessorDashboardRoute() {
  if (isVideoDemoMode()) {
    return (
      <ProfessorDashboardPage
        professor={demoProfessor}
        courses={demoProfessorCourses}
        stats={demoProfessorStats}
        activities={demoProfessorActivities}
        submissionSummary={demoSubmissionSummary}
      />
    );
  }

  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  if (!auth || !client || auth.role !== 'professor') {
    return <ProfessorDashboardPage professor={{ name: '교수', title: '님' }} courses={[]} stats={[]} activities={[]} />;
  }

  const [{ data: profile }, { data: courseRows }] = await Promise.all([
    client.from('profiles').select('name').eq('id', auth.userId).maybeSingle(),
    client
      .from('courses')
      .select('id, title, semester, student_count, current_week, total_weeks')
      .or(`created_by.eq.${auth.userId},professor_id.eq.${auth.userId}`)
      .order('created_at', { ascending: false }),
  ]);

  const courses = ((courseRows ?? []) as CourseRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    semester: row.semester,
    students: row.student_count,
    currentWeek: row.current_week,
    totalWeeks: row.total_weeks,
  }));

  const courseIds = courses.map((course) => course.id);
  let submissionRows: SubmissionRow[] = [];

  if (courseIds.length > 0) {
    const { data: assignmentRows } = await client
      .from('assignments')
      .select('id')
      .in('course_id', courseIds);
    const assignmentIds = ((assignmentRows ?? []) as { id: string }[]).map((row) => row.id);

    if (assignmentIds.length > 0) {
      const { data } = await client
        .from('submissions')
        .select('id, status')
        .in('assignment_id', assignmentIds)
        .order('submitted_at', { ascending: false })
        .limit(20);
      submissionRows = (data ?? []) as SubmissionRow[];
    }
  }

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const pendingReviews = submissionRows.filter((row) => row.status === 'submitted' || row.status === 'grading').length;
  const completedReviews = submissionRows.filter((row) => row.status === 'graded').length;

  const stats = [
    { label: '운영중인 강좌', value: `${courses.length}개` },
    { label: '전체 수강생', value: `${totalStudents}명` },
    { label: '검토중 제출', value: `${pendingReviews}건`, valueClassName: pendingReviews > 0 ? 'text-red-500' : 'text-gray-700' },
    { label: '채점 완료', value: `${completedReviews}건` },
  ];

  const activities = [
    { color: 'bg-blue-500', text: `운영 강좌 ${courses.length}개` },
    { color: pendingReviews > 0 ? 'bg-red-500' : 'bg-green-500', text: `검토중 제출 ${pendingReviews}건` },
    { color: 'bg-yellow-400', text: `전체 수강생 ${totalStudents}명` },
    { color: 'bg-green-500', text: `채점 완료 ${completedReviews}건` },
  ];

  return <ProfessorDashboardPage professor={{ name: (profile as ProfileRow | null)?.name ?? '교수', title: '님' }} courses={courses} stats={stats} activities={activities} />;
}
