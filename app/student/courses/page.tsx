import { StudentCoursesPage } from '@/_pages/student-courses/ui/StudentCoursesPage';
import { demoStudentCourses, isVideoDemoMode } from '@/entities/demo-video';
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

export default async function StudentCoursesRoute() {
  if (isVideoDemoMode()) {
    return <StudentCoursesPage courses={demoStudentCourses} />;
  }

  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  if (!auth || !client || auth.role !== 'student') {
    return <StudentCoursesPage courses={[]} />;
  }

  const { data: enrollments } = await client
    .from('enrollments')
    .select('course_id')
    .eq('student_id', auth.userId);

  const courseIds = ((enrollments ?? []) as EnrollmentRow[]).map((row) => row.course_id);

  if (courseIds.length === 0) {
    return <StudentCoursesPage courses={[]} />;
  }

  const { data: courseRows } = await client
    .from('courses')
    .select('id, title, professor_name, current_week, total_weeks')
    .in('id', courseIds)
    .order('created_at', { ascending: false });

  const courses = ((courseRows ?? []) as CourseRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    professor: row.professor_name,
    progress: row.total_weeks > 0 ? Math.min(100, Math.round((row.current_week / row.total_weeks) * 100)) : 0,
  }));

  return <StudentCoursesPage courses={courses} />;
}
