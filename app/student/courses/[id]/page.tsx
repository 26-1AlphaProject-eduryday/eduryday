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
  type: 'lecture' | 'practice' | 'quiz' | 'document';
  file_url: string | null;
  order_num: number;
  completed_by: string[] | null;
}

interface AssignmentRow {
  id: string;
  title: string;
  description: string | null;
  type: 'coding' | 'essay' | 'multiple-choice' | 'file';
  deadline: string | null;
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

  const [{ data: courseRow }, { data: weekRows }, { data: assignmentRows }] = await Promise.all([
    client.from('courses').select('id, title, professor_name, current_week, total_weeks').eq('id', id).maybeSingle(),
    client.from('course_weeks').select('id, number, title, status').eq('course_id', id).order('number', { ascending: true }),
    client
      .from('assignments')
      .select('id, title, description, type, deadline')
      .eq('course_id', id)
      .eq('status', 'active')
      .order('deadline', { ascending: true })
      .limit(1),
  ]);

  const weekIds = ((weekRows ?? []) as CourseWeekRow[]).map((week) => week.id);
  const { data: lessonRows } = weekIds.length > 0
    ? await client
        .from('lessons')
        .select('id, week_id, title, type, file_url, order_num, completed_by')
        .in('week_id', weekIds)
        .order('order_num', { ascending: true })
    : { data: [] };

  const allLessons = (lessonRows ?? []) as LessonRow[];
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) =>
    Array.isArray(l.completed_by) && l.completed_by.includes(auth.userId),
  ).length;
  const progress = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;

  const currentCourse: StudentCourse | null = courseRow
    ? {
        id: courseRow.id,
        title: courseRow.title,
        professor: courseRow.professor_name,
        progress,
      }
    : null;

  const lessonsByWeek = new Map<string, LessonRow[]>();

  for (const lesson of allLessons) {
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
      completed: Array.isArray(lesson.completed_by) && lesson.completed_by.includes(auth.userId),
      active: week.status === 'in-progress' && index === 0,
    })),
  }));

  const courseResources: CourseResource[] = allLessons
    .filter((lesson) => Boolean(lesson.file_url))
    .map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      completed: Array.isArray(lesson.completed_by) && lesson.completed_by.includes(auth.userId),
      isPdf: lesson.file_url?.toLowerCase().endsWith('.pdf'),
      file_url: lesson.file_url ?? undefined,
    }));

  const activeAssignment = ((assignmentRows ?? []) as AssignmentRow[])[0] ?? null;

  return (
    <CourseDetailPage
      currentCourse={currentCourse}
      courseWeeks={courseWeeks}
      courseResources={courseResources}
      activeAssignment={activeAssignment}
    />
  );
}
