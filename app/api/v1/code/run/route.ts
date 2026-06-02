import { fail, ok } from '@/shared/lib/api/response';
import { canReadAssignment } from '@/shared/lib/supabase/access';
import { runTestCases } from '@/shared/lib/grading/judge0';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface AssignmentRow {
  test_cases: { input: string; expectedOutput: string; weight: number }[] | null;
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth || auth.role !== 'student') {
    return fail('UNAUTHORIZED', '학생 권한이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();
  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);
  const assignmentId = typeof body?.assignmentId === 'string' ? body.assignmentId : '';
  const code = typeof body?.code === 'string' ? body.code : '';
  const language = typeof body?.language === 'string' ? body.language : 'python';

  if (!assignmentId || !code.trim()) {
    return fail('VALIDATION_ERROR', 'assignmentId와 code는 필수입니다.');
  }

  if (!(await canReadAssignment(client, assignmentId, auth))) {
    return fail('FORBIDDEN', '수강 중인 과제만 실행할 수 있습니다.', 403);
  }

  const { data, error } = await client
    .from('assignments')
    .select('test_cases')
    .eq('id', assignmentId)
    .maybeSingle<AssignmentRow>();

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  const testCases = Array.isArray(data?.test_cases) ? data.test_cases : [];

  if (testCases.length === 0) {
    return fail('NO_TEST_CASES', '등록된 테스트 케이스가 없습니다.', 400);
  }

  const result = await runTestCases(code, language, testCases);
  return ok(result);
}
