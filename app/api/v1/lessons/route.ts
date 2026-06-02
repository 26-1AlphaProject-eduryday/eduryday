import { fail, ok } from '@/shared/lib/api/response';
import { canManageWeek, canReadWeek } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

const LESSON_TYPES = ['lecture', 'practice', 'quiz', 'document'] as const;

function isLessonType(value: unknown): value is (typeof LESSON_TYPES)[number] {
  return LESSON_TYPES.includes(value as (typeof LESSON_TYPES)[number]);
}

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const url = new URL(req.url);
  const weekId = url.searchParams.get('weekId');

  if (!weekId) return fail('VALIDATION_ERROR', 'weekId는 필수입니다.');

  if (!(await canReadWeek(client, weekId, auth))) {
    return fail('FORBIDDEN', '접근 가능한 주차가 아닙니다.', 403);
  }

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

  const weekId = String(body.weekId);
  const type = String(body.type);

  if (!isLessonType(type)) {
    return fail('VALIDATION_ERROR', 'type은 lecture|practice|quiz|document 중 하나여야 합니다.');
  }

  if (!(await canManageWeek(client, weekId, auth))) {
    return fail('FORBIDDEN', '본인 강좌의 주차에만 레슨을 생성할 수 있습니다.', 403);
  }

  const { data, error } = await client
    .from('lessons')
    .insert({
      week_id: weekId,
      title: String(body.title),
      type,
      file_url: body.fileUrl ? String(body.fileUrl) : null,
      order_num: body.orderNum != null ? Number(body.orderNum) : null,
    })
    .select('id, week_id, title, type, file_url, order_num')
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  return Response.json({ ok: true, data }, { status: 201 });
}
