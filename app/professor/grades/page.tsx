import { ProfessorGradesPage } from '@/_pages/professor-grades/ui/ProfessorGradesPage';
import { getProfessorCourses, getSubmissions } from '@/shared/lib/supabase/ui-seed';

export default async function ProfessorGradesRoute() {
  const [submissions, courses] = await Promise.all([
    getSubmissions(),
    getProfessorCourses(),
  ]);

  return <ProfessorGradesPage submissions={submissions} courses={courses} />;
}
