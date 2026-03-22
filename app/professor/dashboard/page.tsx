import { ProfessorDashboardPage } from '@/_pages/professor-dashboard/ui/ProfessorDashboardPage';
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
  status: 'submitted' | 'reviewing' | 'complete' | 'unsubmitted';
}

interface ProfileRow {
  name: string;
}

export default async function ProfessorDashboardRoute() {
  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  if (!auth || !client || auth.role !== 'professor') {
    return <ProfessorDashboardPage professor={{ name: '교수', title: '님' }} courses={[]} stats={[]} activities={[]} />;
  }

  const [{ data: profile }, { data: courseRows }, { data: submissionRows }] = await Promise.all([
    client.from('profiles').select('name').eq('id', auth.userId).maybeSingle(),
    client
      .from('courses')
      .select('id, title, semester, student_count, current_week, total_weeks')
      .eq('created_by', auth.userId)
      .order('created_at', { ascending: false }),
    client.from('submissions').select('id, status').order('submitted_at', { ascending: false }).limit(20),
  ]);

  const courses = ((courseRows ?? []) as CourseRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    semester: row.semester,
    students: row.student_count,
    currentWeek: row.current_week,
    totalWeeks: row.total_weeks,
  }));

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const pendingReviews = ((submissionRows ?? []) as SubmissionRow[]).filter((row) => row.status === 'reviewing').length;
  const completedReviews = ((submissionRows ?? []) as SubmissionRow[]).filter((row) => row.status === 'complete').length;

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
