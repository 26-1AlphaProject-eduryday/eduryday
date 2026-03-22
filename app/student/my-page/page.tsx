import { StudentMyPage } from '@/_pages/student-my-page/ui/StudentMyPage';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export default async function StudentMyPageRoute() {
  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  if (!auth || !client || auth.role !== 'student') {
    return <StudentMyPage student={{ id: '', name: '학생', email: '', studentId: '', department: '' }} learningStats={[]} completedCourses={[]} />;
  }

  const [{ data: profile }, { data: enrollments }, { data: submissions }] = await Promise.all([
    client.from('profiles').select('id, name, email, student_id, department').eq('id', auth.userId).maybeSingle(),
    client.from('enrollments').select('course_id').eq('student_id', auth.userId),
    client.from('submissions').select('id, final_score').eq('student_id', auth.userId),
  ]);

  const courseIds = (enrollments ?? []).map((row) => row.course_id);
  const { data: closedCourses } = courseIds.length
    ? await client.from('courses').select('id, title, semester').in('id', courseIds).eq('status', 'closed')
    : { data: [] };

  const scoredSubmissions = (submissions ?? []).filter((row) => row.final_score !== null);
  const avgScore = scoredSubmissions.length > 0
    ? Math.round(scoredSubmissions.reduce((sum, row) => sum + (row.final_score ?? 0), 0) / scoredSubmissions.length)
    : 0;

  const learningStats = [
    { label: '수강 강좌', value: `${courseIds.length}개`, trend: '현재 수강 기준', trendColor: 'green' as const },
    { label: '완료 강좌', value: `${(closedCourses ?? []).length}개`, trend: '종료 강좌 기준', trendColor: 'green' as const },
    { label: '평균 점수', value: `${avgScore}점`, trend: '채점 완료 과제 기준', trendColor: 'green' as const },
  ];

  const completedCourses = (closedCourses ?? []).map((course) => ({
    id: course.id,
    title: course.title,
    semester: course.semester,
    grade: avgScore >= 90 ? 'A' : avgScore >= 80 ? 'B' : avgScore >= 70 ? 'C' : avgScore >= 60 ? 'D' : 'F',
  }));

  return (
    <StudentMyPage
      student={{
        id: profile?.id ?? '',
        name: profile?.name ?? '학생',
        email: profile?.email ?? auth.email,
        studentId: profile?.student_id ?? '',
        department: profile?.department ?? '',
      }}
      learningStats={learningStats}
      completedCourses={completedCourses}
    />
  );
}
