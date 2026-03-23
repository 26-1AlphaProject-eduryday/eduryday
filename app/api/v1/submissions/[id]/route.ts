import { fail, ok } from '@/shared/lib/api/response';
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

  if (body?.finalScore === undefined && body?.feedback === undefined) {
    return fail('VALIDATION_ERROR', 'finalScore 또는 feedback 중 하나는 필수입니다.');
  }

  const updatePayload: Record<string, unknown> = {};

  if (typeof body?.finalScore === 'number') {
    updatePayload.final_score = body.finalScore;
    updatePayload.status = body.finalScore > 0 ? 'complete' : 'reviewing';
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

  // Record grading activity log
  await client.from('activity_logs').insert({
    type: 'grading',
    user_name: auth.email.split('@')[0],
    user_role: auth.role ?? 'professor',
    message: `채점 완료: submission ${id}`,
  }); // Fire and forget; errors are intentionally ignored

  return ok({ id, ...('finalScore' in updatePayload ? { finalScore: body.finalScore, status: updatePayload.status } : {}), ...('feedback' in updatePayload ? { feedback: body.feedback } : {}) });
}
