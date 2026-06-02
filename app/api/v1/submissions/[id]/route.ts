import { fail, ok } from '@/shared/lib/api/response';
import { refreshAssignmentSubmissionCounts } from '@/shared/lib/grading/submission-counts';
import { canManageSubmission } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();

  if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
    return fail('UNAUTHORIZED', '교수 또는 관리자 권한이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);
  const { id } = await params;

  if (!(await canManageSubmission(client, id, auth))) {
    return fail('FORBIDDEN', '본인 강좌의 제출물만 채점할 수 있습니다.', 403);
  }

  if (body?.finalScore === undefined && body?.feedback === undefined) {
    return fail('VALIDATION_ERROR', 'finalScore 또는 feedback 중 하나는 필수입니다.');
  }

  const updatePayload: Record<string, unknown> = {};

  if (typeof body?.finalScore === 'number') {
    if (body.finalScore < 0 || body.finalScore > 100) {
      return fail('VALIDATION_ERROR', 'finalScore는 0~100 사이여야 합니다.');
    }
    updatePayload.final_score = body.finalScore;
    updatePayload.status = 'graded';
    updatePayload.graded_at = new Date().toISOString();
  }

  if (typeof body?.feedback === 'string') {
    updatePayload.feedback = body.feedback;
  }

  const { error } = await client
    .from('submissions')
    .update(updatePayload)
    .eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  const { data: submission } = await client
    .from('submissions')
    .select('assignment_id')
    .eq('id', id)
    .maybeSingle<{ assignment_id: string }>();

  if (submission?.assignment_id) {
    await refreshAssignmentSubmissionCounts(client, submission.assignment_id);
  }

  // Record grading activity log
  await client.from('activity_logs').insert({
    type: 'grading',
    user_name: auth.email.split('@')[0],
    user_role: auth.role ?? 'professor',
    message: `채점 완료: submission ${id}`,
  }); // Fire and forget; errors are intentionally ignored

  return ok({ id, ...('finalScore' in updatePayload ? { finalScore: body.finalScore, status: updatePayload.status } : {}), ...('feedback' in updatePayload ? { feedback: body.feedback } : {}) });
}
