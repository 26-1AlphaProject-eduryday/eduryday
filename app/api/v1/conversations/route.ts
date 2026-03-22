import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

// GET: list conversations for current user
export async function GET() {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const { data, error } = await client
    .from('ai_conversations')
    .select('id, title, course_id, message_count, created_at, updated_at')
    .eq('student_id', auth.userId)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) return fail('DB_ERROR', error.message, 500);
  return ok({ conversations: data ?? [] });
}

// POST: create new conversation
export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);

  const { data, error } = await client
    .from('ai_conversations')
    .insert({
      student_id: auth.userId,
      title: body?.title ?? '새 대화',
      course_id: body?.courseId ?? null,
      messages: body?.messages ?? [],
      message_count: body?.messages?.length ?? 0,
    })
    .select('id, title, course_id, message_count, created_at, updated_at')
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  return Response.json({ ok: true, data }, { status: 201 });
}
