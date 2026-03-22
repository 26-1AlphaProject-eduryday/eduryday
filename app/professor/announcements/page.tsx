import { ProfessorAnnouncementsPage } from '@/_pages/professor-announcements/ui/ProfessorAnnouncementsPage';
import { getServiceRoleClient } from '@/shared/lib/supabase/route';

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
  const client = getServiceRoleClient();

  if (!client) {
    return <ProfessorAnnouncementsPage courses={[]} announcements={[]} />;
  }

  const [courseRows, announcementRows] = await Promise.all([
    client
      .from('courses')
      .select('id, title, semester, student_count, current_week, total_weeks')
      .order('created_at', { ascending: false }),
    client
      .from('announcements')
      .select('id, title, content, course_id, pinned, views, created_at, courses(title)')
      .order('created_at', { ascending: false }),
  ]);

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
