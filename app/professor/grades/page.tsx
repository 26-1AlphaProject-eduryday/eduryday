import { redirect } from 'next/navigation';
import { ProfessorGradesPage } from '@/_pages/professor-grades/ui/ProfessorGradesPage';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface CourseRow {
  id: string;
  title: string;
  semester: string;
}

interface SubmissionJoinRow {
  id: string;
  student_name: string;
  student_number: string | null;
  submitted_at: string;
  auto_score: number | null;
  final_score: number | null;
  status: 'submitted' | 'grading' | 'graded' | 'unsubmitted';
  assignments:
    | {
        title: string;
        course_id: string;
        courses: { title: string } | { title: string }[] | null;
      }
    | {
        title: string;
        course_id: string;
        courses: { title: string } | { title: string }[] | null;
      }[]
    | null;
}

export default async function ProfessorGradesRoute() {
  const auth = await getRouteAuthContext();

  if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
    redirect('/login');
  }

  const client = getServiceRoleClient();

  if (!client) {
    return <ProfessorGradesPage rows={[]} courses={[]} />;
  }

  // Scope courses to professor's own (admin sees all)
  let coursesQuery = client.from('courses').select('id, title, semester').order('created_at', { ascending: false });
  if (auth.role === 'professor') {
    coursesQuery = coursesQuery.or(`created_by.eq.${auth.userId},professor_id.eq.${auth.userId}`);
  }
  const courseRows = await coursesQuery;
  const courseIds = ((courseRows.data ?? []) as CourseRow[]).map((c) => c.id);

  const { data: assignmentIdRows } = courseIds.length > 0
    ? await client.from('assignments').select('id').in('course_id', courseIds)
    : { data: [] };
  const assignmentIds = ((assignmentIdRows ?? []) as { id: string }[]).map((row) => row.id);

  // Get submissions only for those courses' assignments
  let submissionsQuery = client
    .from('submissions')
    .select('id, student_name, student_number, submitted_at, auto_score, final_score, status, assignments(title, course_id, courses(title))')
    .order('submitted_at', { ascending: false });

  if (auth.role === 'professor') {
    if (assignmentIds.length === 0) {
      return <ProfessorGradesPage rows={[]} courses={((courseRows.data ?? []) as CourseRow[]).map((row) => ({ id: row.id, title: row.title, semester: row.semester }))} />;
    }

    submissionsQuery = submissionsQuery.in('assignment_id', assignmentIds);
  }

  const submissionRows = await submissionsQuery;

  const courses = ((courseRows.data ?? []) as CourseRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    semester: row.semester,
  }));

  const rows = ((submissionRows.data ?? []) as SubmissionJoinRow[]).map((row) => {
    const assignment = Array.isArray(row.assignments) ? row.assignments[0] : row.assignments;
    const courseValue = assignment?.courses;
    const course = Array.isArray(courseValue) ? courseValue[0] : courseValue;

    return {
      id: row.id,
      courseId: assignment?.course_id ?? 'unknown',
      courseTitle: course?.title ?? '-',
      assignmentTitle: assignment?.title ?? '-',
      name: row.student_name,
      studentId: row.student_number ?? '-',
      submittedAt: row.submitted_at.replace('T', ' ').slice(0, 16),
      autoScore: row.auto_score,
      finalScore: row.final_score,
      status: row.status,
    };
  });

  return <ProfessorGradesPage rows={rows} courses={courses} />;
}
