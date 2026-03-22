import { StudentMyPage } from '@/_pages/student-my-page/ui/StudentMyPage';
import { getDbStudentProfile } from '@/shared/lib/supabase/db-queries';

export default async function StudentMyPageRoute() {
  const { student, learningStats, completedCourses } = await getDbStudentProfile();

  return (
    <StudentMyPage
      student={student}
      learningStats={learningStats}
      completedCourses={completedCourses}
    />
  );
}
