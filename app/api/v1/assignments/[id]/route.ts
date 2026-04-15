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

  const { id } = await params;
  const body = await req.json().catch(() => null);

  const payload: {
    title?: string;
    description?: string | null;
    type?: 'coding' | 'essay' | 'multiple-choice' | 'file';
    deadline?: string | null;
    status?: 'draft' | 'active' | 'closed';
    rubric?: unknown[];
  } = {};

  if (typeof body?.title === 'string') {
    payload.title = body.title;
  }
  if (typeof body?.description === 'string' || body?.description === null) {
    payload.description = body.description;
  }
  if (body?.type === 'coding' || body?.type === 'essay' || body?.type === 'multiple-choice' || body?.type === 'file') {
    payload.type = body.type;
  }
  if (typeof body?.deadline === 'string' || body?.deadline === null) {
    payload.deadline = body.deadline;
  }
  if (body?.status === 'draft' || body?.status === 'active' || body?.status === 'closed') {
    payload.status = body.status;
  }
  if (Array.isArray(body?.rubric)) {
    payload.rubric = body.rubric;
  }

  const { error } = await client.from('assignments').update(payload).eq('id', id);

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
  const { error } = await client.from('assignments').delete().eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  try {
    await client.from('activity_logs').insert({
      type: 'assignment_delete',
      user_name: auth.email.split('@')[0],
      user_role: auth.role ?? 'professor',
      user_id: auth.userId,
      message: `과제 삭제: ${id}`,
    });
  } catch {}

  return ok({ id });
}
