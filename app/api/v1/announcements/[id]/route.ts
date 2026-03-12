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

  const payload: { title?: string; content?: string; pinned?: boolean } = {};
  if (typeof body?.title === 'string') {
    payload.title = body.title;
  }
  if (typeof body?.content === 'string') {
    payload.content = body.content;
  }
  if (typeof body?.pinned === 'boolean') {
    payload.pinned = body.pinned;
  }

  const { error } = await client.from('announcements').update(payload).eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ id });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();

  if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
    return fail('UNAUTHORIZED', '교수 또는 관리자 권한이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const { id } = await params;
  const { error } = await client.from('announcements').delete().eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ id });
}
