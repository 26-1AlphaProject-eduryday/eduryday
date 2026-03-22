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
  status: 'submitted' | 'reviewing' | 'complete' | 'unsubmitted';
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
    coursesQuery = coursesQuery.eq('created_by', auth.userId);
  }
  const courseRows = await coursesQuery;
  const courseIds = ((courseRows.data ?? []) as CourseRow[]).map((c) => c.id);

  // Get submissions only for those courses' assignments
  let submissionsQuery = client
    .from('submissions')
    .select('id, student_name, student_number, submitted_at, auto_score, final_score, status, assignments(title, course_id, courses(title))')
    .order('submitted_at', { ascending: false });

  if (auth.role === 'professor' && courseIds.length > 0) {
    // Filter by assignment's course_id being in professor's courses
    submissionsQuery = submissionsQuery.in('assignments.course_id', courseIds);
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
