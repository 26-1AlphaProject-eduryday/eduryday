import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();

  if (!auth || auth.role !== 'admin') {
    return fail('UNAUTHORIZED', '관리자 권한이 필요합니다.', 401);
  }

  const adminClient = getServiceRoleClient();

  if (!adminClient) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);
  const action = body?.action as 'approve' | 'suspend' | 'activate' | undefined;

  if (!action) {
    return fail('VALIDATION_ERROR', 'action은 approve|suspend|activate 중 하나여야 합니다.');
  }

  const { id } = await params;
  const status = action === 'suspend' ? 'suspended' : 'active';

  const { error } = await adminClient.from('profiles').update({ status }).eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ id, status });
}
