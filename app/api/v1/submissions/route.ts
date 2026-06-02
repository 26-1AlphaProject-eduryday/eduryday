import { fail, ok } from '@/shared/lib/api/response';
import { refreshAssignmentSubmissionCounts } from '@/shared/lib/grading/submission-counts';
import { canReadCourse, isStudentEnrolled } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface SubmissionRow {
  id: string;
  assignment_id: string;
  student_name: string;
  student_number: string | null;
  submitted_at: string;
  auto_score: number | null;
  tests_passed: string | null;
  ai_analysis: string | null;
  ai_analysis_variant: 'green' | 'yellow' | 'red';
  ai_sub_note: string | null;
  final_score: number | null;
  feedback: string | null;
  status: 'submitted' | 'grading' | 'graded' | 'unsubmitted';
}

interface AssignmentForSubmission {
  id: string;
  course_id: string;
  deadline: string | null;
  status: 'draft' | 'active' | 'closed';
  type: 'coding' | 'essay' | 'multiple-choice' | 'file';
}

interface ProfileRow {
  name: string;
  student_id: string | null;
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
  const courseId = url.searchParams.get('courseId');

  let dbQuery = client
    .from('submissions')
    .select('id, assignment_id, student_name, student_number, submitted_at, auto_score, tests_passed, ai_analysis, ai_analysis_variant, ai_sub_note, final_score, feedback, status')
    .order('submitted_at', { ascending: false });

  if (assignmentId) {
    dbQuery = dbQuery.eq('assignment_id', assignmentId);
  }

  if (courseId) {
    if (!(await canReadCourse(client, courseId, auth))) {
      return fail('FORBIDDEN', '접근 가능한 강좌가 아닙니다.', 403);
    }

    const { data: assignmentRows } = await client
      .from('assignments')
      .select('id')
      .eq('course_id', courseId);
    const assignmentIds = ((assignmentRows ?? []) as { id: string }[]).map((row) => row.id);

    if (assignmentIds.length === 0) {
      return ok({ submissions: [] });
    }

    dbQuery = dbQuery.in('assignment_id', assignmentIds);
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
      .or(`created_by.eq.${auth.userId},professor_id.eq.${auth.userId}`);
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
    assignmentId: row.assignment_id,
    name: row.student_name,
    studentId: row.student_number ?? '-',
    submittedAt: row.submitted_at.replace('T', ' ').slice(5, 16),
    autoScore: row.auto_score === null ? '-' : `${row.auto_score}/100`,
    testsPassed: row.tests_passed ?? '-',
    aiAnalysis: row.ai_analysis ?? '-',
    aiAnalysisVariant: row.ai_analysis_variant,
    aiSubNote: row.ai_sub_note ?? undefined,
    finalScore: row.final_score === null ? '' : String(row.final_score),
    feedback: row.feedback ?? undefined,
    status: row.status,
  }));

  return ok({ submissions });
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth || auth.role !== 'student') {
    return fail('UNAUTHORIZED', '학생 권한이 필요합니다.', 401);
  }

  if (auth.status !== 'active') {
    return fail('FORBIDDEN', '활성 계정만 과제를 제출할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);

  if (!body?.assignmentId) {
    return fail('VALIDATION_ERROR', 'assignmentId는 필수입니다.');
  }

  const assignmentId = String(body.assignmentId);
  const answer = typeof body?.answer === 'string' ? body.answer.trim() : '';
  const fileUrl = typeof body?.fileUrl === 'string' ? body.fileUrl : null;

  if (!answer && !fileUrl) {
    return fail('VALIDATION_ERROR', '답안 또는 파일은 필수입니다.');
  }

  const { data: assignment, error: assignmentError } = await client
    .from('assignments')
    .select('id, course_id, deadline, status, type')
    .eq('id', assignmentId)
    .maybeSingle<AssignmentForSubmission>();

  if (assignmentError) {
    return fail('DB_ERROR', assignmentError.message, 500);
  }

  if (!assignment) {
    return fail('NOT_FOUND', '과제를 찾을 수 없습니다.', 404);
  }

  if (assignment.status !== 'active') {
    return fail('FORBIDDEN', '게시된 과제만 제출할 수 있습니다.', 403);
  }

  if (!(await isStudentEnrolled(client, assignment.course_id, auth.userId))) {
    return fail('FORBIDDEN', '수강 중인 강좌의 과제만 제출할 수 있습니다.', 403);
  }

  if (assignment?.deadline) {
    const deadlineDate = new Date(assignment.deadline);
    if (new Date() > deadlineDate) {
      return fail('DEADLINE_PASSED', '제출 마감일이 지났습니다.', 400);
    }
  }

  const { data: profile } = await client
    .from('profiles')
    .select('name, student_id')
    .eq('id', auth.userId)
    .maybeSingle<ProfileRow>();

  const submissionPayload = {
    assignment_id: assignmentId,
    student_id: auth.userId,
    student_name: profile?.name ?? auth.email.split('@')[0],
    student_number: profile?.student_id ?? null,
    content: answer || null,
    file_url: fileUrl,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
    auto_score: null,
    final_score: null,
    tests_passed: null,
    ai_analysis: null,
    feedback: null,
  };

  const { data: existingRows } = await client
    .from('submissions')
    .select('id')
    .eq('assignment_id', assignmentId)
    .eq('student_id', auth.userId)
    .order('submitted_at', { ascending: false })
    .limit(1);

  const existingId = ((existingRows ?? []) as { id: string }[])[0]?.id;
  const writeResult = existingId
    ? await client
        .from('submissions')
        .update(submissionPayload)
        .eq('id', existingId)
        .select('id, assignment_id')
        .single()
    : await client
        .from('submissions')
        .insert(submissionPayload)
        .select('id, assignment_id')
        .single();

  const { data, error } = writeResult;

  if (error || !data) {
    return fail('DB_ERROR', error?.message ?? '제출에 실패했습니다.', 500);
  }

  await refreshAssignmentSubmissionCounts(client, data.assignment_id);

  // After successful submission insert, record activity log
  await client.from('activity_logs').insert({
    type: 'submit',
    user_name: profile?.name ?? auth.email.split('@')[0],
    user_role: 'student',
    user_id: auth.userId,
    message: `과제 제출: ${data.assignment_id}`,
  }); // Fire and forget; errors are intentionally ignored

  return ok({ id: data.id, status: 'submitted', assignmentId: data.assignment_id });
}
