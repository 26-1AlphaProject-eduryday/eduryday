import { CourseDetailPage } from '@/_pages/course-detail/ui/CourseDetailPage';
import type { CourseResource, StudentCourse, Week } from '@/entities/course';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface CourseRow {
  id: string;
  title: string;
  professor_name: string;
  current_week: number;
  total_weeks: number;
}

interface CourseWeekRow {
  id: string;
  number: number;
  title: string;
  status: 'locked' | 'in-progress' | 'done';
}

interface LessonRow {
  id: string;
  week_id: string;
  title: string;
  type: 'lecture' | 'practice' | 'quiz';
  order_num: number;
}

export default async function CourseDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();
  const { id } = await params;

  if (!auth || !client || auth.role !== 'student') {
    return <CourseDetailPage currentCourse={null} courseWeeks={[]} courseResources={[]} />;
  }

  const { data: enrollment } = await client
    .from('enrollments')
    .select('id')
    .eq('course_id', id)
    .eq('student_id', auth.userId)
    .maybeSingle();

  if (!enrollment) {
    return <CourseDetailPage currentCourse={null} courseWeeks={[]} courseResources={[]} />;
  }

  const [{ data: courseRow }, { data: weekRows }, { data: lessonRows }] = await Promise.all([
    client.from('courses').select('id, title, professor_name, current_week, total_weeks').eq('id', id).maybeSingle(),
    client.from('course_weeks').select('id, number, title, status').eq('course_id', id).order('number', { ascending: true }),
    client
      .from('lessons')
      .select('id, week_id, title, type, order_num')
      .order('order_num', { ascending: true }),
  ]);

  const currentCourse: StudentCourse | null = courseRow
    ? {
        id: courseRow.id,
        title: courseRow.title,
        professor: courseRow.professor_name,
        progress:
          courseRow.total_weeks > 0 ? Math.min(100, Math.round((courseRow.current_week / courseRow.total_weeks) * 100)) : 0,
      }
    : null;

  const lessonsByWeek = new Map<string, LessonRow[]>();

  for (const lesson of (lessonRows ?? []) as LessonRow[]) {
    if (!lessonsByWeek.has(lesson.week_id)) {
      lessonsByWeek.set(lesson.week_id, []);
    }

    lessonsByWeek.get(lesson.week_id)?.push(lesson);
  }

  const courseWeeks: Week[] = ((weekRows ?? []) as CourseWeekRow[]).map((week) => ({
    id: week.id,
    number: week.number,
    title: week.title,
    status: week.status,
    lessons: (lessonsByWeek.get(week.id) ?? []).map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      completed: false,
      active: week.status === 'in-progress' && index === 0,
    })),
  }));

  const courseResources: CourseResource[] = [];

  return <CourseDetailPage currentCourse={currentCourse} courseWeeks={courseWeeks} courseResources={courseResources} />;
}
