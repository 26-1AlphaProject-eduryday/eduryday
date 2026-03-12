import { StudentMyPage } from '@/_pages/student-my-page/ui/StudentMyPage';
import { getCompletedCourses, getCurrentStudent, getLearningStats } from '@/shared/lib/supabase/ui-seed';

export default async function StudentMyPageRoute() {
  const [student, learningStats, completedCourses] = await Promise.all([
    getCurrentStudent(),
    getLearningStats(),
    getCompletedCourses(),
  ]);

  return (
    <StudentMyPage
      student={student}
      learningStats={learningStats}
      completedCourses={completedCourses}
    />
  );
}
