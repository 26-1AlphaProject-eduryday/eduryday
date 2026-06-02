import { ProfessorAnnouncementsPage } from '@/_pages/professor-announcements/ui/ProfessorAnnouncementsPage';
import { getAccessibleCourseIds } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface AnnouncementJoinRow {
  id: string;
  title: string;
  content: string;
  course_id: string;
  pinned: boolean;
  views: number;
  created_at: string;
  courses: { title: string } | { title: string }[] | null;
}

export default async function ProfessorAnnouncementsRoute() {
  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  if (!auth || !client || (auth.role !== 'professor' && auth.role !== 'admin')) {
    return <ProfessorAnnouncementsPage courses={[]} announcements={[]} />;
  }

  const accessibleCourseIds = await getAccessibleCourseIds(client, auth);

  if (accessibleCourseIds !== null && accessibleCourseIds.length === 0) {
    return <ProfessorAnnouncementsPage courses={[]} announcements={[]} />;
  }

  let coursesQuery = client
    .from('courses')
    .select('id, title, semester, student_count, current_week, total_weeks')
    .order('created_at', { ascending: false });
  let announcementsQuery = client
    .from('announcements')
    .select('id, title, content, course_id, pinned, views, created_at, courses(title)')
    .order('created_at', { ascending: false });

  if (accessibleCourseIds !== null) {
    coursesQuery = coursesQuery.in('id', accessibleCourseIds);
    announcementsQuery = announcementsQuery.in('course_id', accessibleCourseIds);
  }

  const [courseRows, announcementRows] = await Promise.all([coursesQuery, announcementsQuery]);

  const courses = (courseRows.data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    semester: `${row.semester} ${''}`.trim(),
    students: row.student_count,
    currentWeek: row.current_week,
    totalWeeks: row.total_weeks,
  }));

  const announcementData = (announcementRows.data ?? []) as unknown as AnnouncementJoinRow[];
  const announcements = announcementData.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    courseId: row.course_id,
    course: Array.isArray(row.courses) ? row.courses[0]?.title ?? '-' : row.courses?.title ?? '-',
    createdAt: row.created_at.slice(0, 10),
    views: row.views,
    pinned: row.pinned,
  }));

  return (
    <ProfessorAnnouncementsPage
      courses={courses}
      announcements={announcements}
    />
  );
}
