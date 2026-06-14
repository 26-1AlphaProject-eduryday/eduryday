import { StudentGradesPage } from '@/_pages/student-grades/ui/StudentGradesPage';
import { demoStudentGrades, isVideoDemoMode } from '@/entities/demo-video';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface SubmissionJoinRow {
  id: string;
  final_score: number | null;
  feedback: string | null;
  submitted_at: string;
  assignments:
    | {
        title: string;
        max_score: number;
        courses: { title: string } | { title: string }[] | null;
      }
    | {
        title: string;
        max_score: number;
        courses: { title: string } | { title: string }[] | null;
      }[]
    | null;
}

export default async function StudentGradesRoute() {
  if (isVideoDemoMode()) {
    return <StudentGradesPage grades={demoStudentGrades} />;
  }

  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  if (!auth || !client || auth.role !== 'student') {
    return <StudentGradesPage grades={[]} />;
  }

  const { data } = await client
    .from('submissions')
    .select('id, final_score, feedback, submitted_at, assignments(title, max_score, courses(title))')
    .eq('student_id', auth.userId)
    .order('submitted_at', { ascending: false });

  const grades = ((data ?? []) as SubmissionJoinRow[]).map((row) => {
    const assignment = Array.isArray(row.assignments) ? row.assignments[0] : row.assignments;
    const courseValue = assignment?.courses;
    const course = Array.isArray(courseValue) ? courseValue[0] : courseValue;

    return {
      id: row.id,
      course: course?.title ?? '-',
      assignment: assignment?.title ?? '-',
      score: row.final_score ?? 0,
      maxScore: assignment?.max_score ?? 100,
      feedback: row.feedback ?? '',
      submittedAt: row.submitted_at.slice(0, 10),
      status: row.final_score === null ? ('pending' as const) : ('graded' as const),
    };
  });

  return <StudentGradesPage grades={grades} />;
}
