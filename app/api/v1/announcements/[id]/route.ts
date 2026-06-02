import { fail, ok } from '@/shared/lib/api/response';
import { canManageCourse } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

async function canManageAnnouncement(client: ReturnType<typeof getServiceRoleClient>, id: string, auth: NonNullable<Awaited<ReturnType<typeof getRouteAuthContext>>>) {
  if (!client) return false;

  const { data, error } = await client
    .from('announcements')
    .select('course_id')
    .eq('id', id)
    .maybeSingle<{ course_id: string }>();

  if (error || !data) return false;
  return canManageCourse(client, data.course_id, auth);
}

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

  if (!(await canManageAnnouncement(client, id, auth))) {
    return fail('FORBIDDEN', '본인 강좌의 공지만 수정할 수 있습니다.', 403);
  }

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

  if (!(await canManageAnnouncement(client, id, auth))) {
    return fail('FORBIDDEN', '본인 강좌의 공지만 삭제할 수 있습니다.', 403);
  }

  const { error } = await client.from('announcements').delete().eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ id });
}
