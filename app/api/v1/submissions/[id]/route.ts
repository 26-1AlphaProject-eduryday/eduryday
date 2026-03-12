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

  if (typeof body?.finalScore !== 'number') {
    return fail('VALIDATION_ERROR', 'finalScore(number)는 필수입니다.');
  }

  const status = body.finalScore > 0 ? 'complete' : 'reviewing';

  const { error } = await client
    .from('submissions')
    .update({
      final_score: body.finalScore,
      status,
      graded_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ id, finalScore: body.finalScore, status });
}
