import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface SubmissionRow {
  id: string;
  student_name: string;
  student_number: string | null;
  submitted_at: string;
  auto_score: number | null;
  tests_passed: string | null;
  ai_analysis: string | null;
  ai_analysis_variant: 'green' | 'yellow' | 'red';
  ai_sub_note: string | null;
  final_score: number | null;
  status: 'submitted' | 'reviewing' | 'complete' | 'unsubmitted';
}

function mapStatus(status: SubmissionRow['status']) {
  if (status === 'complete') {
    return 'complete';
  }

  if (status === 'unsubmitted') {
    return 'unsubmitted';
  }

  return 'reviewing';
}

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const url = new URL(req.url);
  const assignmentId = url.searchParams.get('assignmentId');

  let dbQuery = client
    .from('submissions')
    .select('id, student_name, student_number, submitted_at, auto_score, tests_passed, ai_analysis, ai_analysis_variant, ai_sub_note, final_score, status')
    .order('submitted_at', { ascending: false });

  if (assignmentId) {
    dbQuery = dbQuery.eq('assignment_id', assignmentId);
  }

  // Scope results by role
  if (auth.role === 'student') {
    // Students only see their own submissions
    dbQuery = dbQuery.eq('student_id', auth.userId);
  } else if (auth.role === 'professor') {
    // Professors only see submissions for assignments in their own courses
    const { data: profCourses } = await client
      .from('courses')
      .select('id')
      .eq('created_by', auth.userId);
    const profCourseIds = (profCourses ?? []).map((c: { id: string }) => c.id);

    if (profCourseIds.length === 0) {
      return ok({ submissions: [] });
    }

    const { data: profAssignments } = await client
      .from('assignments')
      .select('id')
      .in('course_id', profCourseIds);
    const profAssignmentIds = (profAssignments ?? []).map((a: { id: string }) => a.id);

    if (profAssignmentIds.length === 0) {
      return ok({ submissions: [] });
    }

    dbQuery = dbQuery.in('assignment_id', profAssignmentIds);
  }
  // admin: no additional filter

  const { data, error } = await dbQuery;

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  const rows = (data ?? []) as unknown as SubmissionRow[];
  const submissions = rows.map((row) => ({
    id: row.id,
    name: row.student_name,
    studentId: row.student_number ?? '-',
    submittedAt: row.submitted_at.replace('T', ' ').slice(5, 16),
    autoScore: row.auto_score === null ? '-' : `${row.auto_score}/100`,
    testsPassed: row.tests_passed ?? '-',
    aiAnalysis: row.ai_analysis ?? '-',
    aiAnalysisVariant: row.ai_analysis_variant,
    aiSubNote: row.ai_sub_note ?? undefined,
    finalScore: row.final_score === null ? '0' : String(row.final_score),
    status: mapStatus(row.status),
  }));

  return ok({ submissions });
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);

  if (!body?.assignmentId) {
    return fail('VALIDATION_ERROR', 'assignmentId는 필수입니다.');
  }

  const { data, error } = await client
    .from('submissions')
    .insert({
      assignment_id: String(body.assignmentId),
      student_id: auth.userId,
      student_name: String(body.studentName ?? auth.email.split('@')[0]),
      student_number: body.studentNumber ? String(body.studentNumber) : null,
      content: body.answer ? String(body.answer) : null,
      status: 'submitted',
    })
    .select('id, assignment_id')
    .single();

  if (error || !data) {
    return fail('DB_ERROR', error?.message ?? '제출에 실패했습니다.', 500);
  }

  return ok({ id: data.id, status: 'queued', assignmentId: data.assignment_id });
}
