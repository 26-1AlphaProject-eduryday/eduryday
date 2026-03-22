import { ProfessorAnnouncementsPage } from '@/_pages/professor-announcements/ui/ProfessorAnnouncementsPage';
import { getDbProfessorAnnouncements, getDbProfessorCourses } from '@/shared/lib/supabase/db-queries';

export default async function ProfessorAnnouncementsRoute() {
  const [courses, announcements] = await Promise.all([
    getDbProfessorCourses(),
    getDbProfessorAnnouncements(),
  ]);

  return (
    <ProfessorAnnouncementsPage
      courses={courses}
      announcements={announcements}
    />
  );
}
