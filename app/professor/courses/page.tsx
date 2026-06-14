import { ProfessorCoursesPage } from '@/_pages/professor-courses/ui/ProfessorCoursesPage';
import { demoProfessorCourses, isVideoDemoMode } from '@/entities/demo-video';

export default function ProfessorCoursesRoute() {
  if (isVideoDemoMode()) {
    return <ProfessorCoursesPage initialCourses={demoProfessorCourses} />;
  }

  return <ProfessorCoursesPage />;
}
