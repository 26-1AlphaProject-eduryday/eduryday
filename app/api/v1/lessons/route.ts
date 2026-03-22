import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const url = new URL(req.url);
  const weekId = url.searchParams.get('weekId');

  if (!weekId) return fail('VALIDATION_ERROR', 'weekId는 필수입니다.');

  const { data, error } = await client
    .from('lessons')
    .select('id, week_id, title, type, file_url, order_num')
    .eq('week_id', weekId)
    .order('order_num', { ascending: true });

  if (error) return fail('DB_ERROR', error.message, 500);

  return ok({ lessons: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'professor' && auth.role !== 'admin') {
    return fail('FORBIDDEN', '교수 또는 관리자만 레슨을 생성할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);
  if (!body?.weekId || !body?.title || !body?.type) {
    return fail('VALIDATION_ERROR', 'weekId, title, type은 필수입니다.');
  }

  const { data, error } = await client
    .from('lessons')
    .insert({
      week_id: body.weekId,
      title: String(body.title),
      type: String(body.type),
      file_url: body.fileUrl ? String(body.fileUrl) : null,
      order_num: body.orderNum != null ? Number(body.orderNum) : null,
    })
    .select('id, week_id, title, type, file_url, order_num')
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  return Response.json({ ok: true, data }, { status: 201 });
}
