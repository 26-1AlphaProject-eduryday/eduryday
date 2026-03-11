import { ProfessorAnnouncementsPage } from '@/_pages/professor-announcements/ui/ProfessorAnnouncementsPage';
import { getProfessorAnnouncements, getProfessorCourses } from '@/shared/lib/supabase/ui-seed';

export default async function ProfessorAnnouncementsRoute() {
  const [courses, announcements] = await Promise.all([
    getProfessorCourses(),
    getProfessorAnnouncements(),
  ]);

  return (
    <ProfessorAnnouncementsPage
      courses={courses}
      announcements={announcements}
    />
  );
}
