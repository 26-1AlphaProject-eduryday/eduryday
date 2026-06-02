import { fail, ok } from '@/shared/lib/api/response';
import { canManageLesson } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

const LESSON_TYPES = ['lecture', 'practice', 'quiz', 'document'] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'professor' && auth.role !== 'admin') {
    return fail('FORBIDDEN', '교수 또는 관리자만 레슨을 수정할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const { id } = await params;

  if (!(await canManageLesson(client, id, auth))) {
    return fail('FORBIDDEN', '본인 강좌의 레슨만 수정할 수 있습니다.', 403);
  }

  const body = await req.json().catch(() => null);
  if (!body) return fail('VALIDATION_ERROR', '요청 본문이 필요합니다.');

  const updates: Record<string, unknown> = {};
  if (body.title != null) updates.title = String(body.title);
  if (body.type != null) {
    if (!LESSON_TYPES.includes(String(body.type) as (typeof LESSON_TYPES)[number])) {
      return fail('VALIDATION_ERROR', 'type은 lecture|practice|quiz|document 중 하나여야 합니다.');
    }
    updates.type = String(body.type);
  }
  if (body.fileUrl !== undefined) updates.file_url = body.fileUrl ? String(body.fileUrl) : null;
  if (body.orderNum != null) updates.order_num = Number(body.orderNum);

  if (Object.keys(updates).length === 0) {
    return fail('VALIDATION_ERROR', '수정할 필드가 없습니다.');
  }

  const { data, error } = await client
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select('id, week_id, title, type, file_url, order_num')
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  return ok(data);
}
