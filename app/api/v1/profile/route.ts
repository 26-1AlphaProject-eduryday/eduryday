import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET() {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const { data, error } = await client
    .from('profiles')
    .select('id, name, email, role, status')
    .eq('id', auth.userId)
    .maybeSingle();

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  if (!data) {
    return fail('NOT_FOUND', '프로필을 찾을 수 없습니다.', 404);
  }

  return ok({ profile: data });
}

export async function PATCH(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);

  if (typeof body?.name !== 'string' || body.name.trim().length < 1) {
    return fail('VALIDATION_ERROR', 'name은 필수입니다.');
  }

  const { error } = await client
    .from('profiles')
    .update({ name: body.name.trim() })
    .eq('id', auth.userId);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ name: body.name.trim() });
}
