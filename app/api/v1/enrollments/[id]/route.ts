import { fail, ok } from '@/shared/lib/api/response';
import { canManageEnrollment } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'professor' && auth.role !== 'admin') {
    return fail('FORBIDDEN', '교수 또는 관리자만 수강 취소할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const { id } = await params;

  if (!(await canManageEnrollment(client, id, auth))) {
    return fail('FORBIDDEN', '본인 강좌의 수강 등록만 취소할 수 있습니다.', 403);
  }

  const { error } = await client.from('enrollments').delete().eq('id', id);
  if (error) return fail('DB_ERROR', error.message, 500);

  return ok({ id });
}
