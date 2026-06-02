import { fail, ok } from '@/shared/lib/api/response';
import { canReadCourse } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

// GET: list conversations for current user
export async function GET() {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'student') return fail('FORBIDDEN', '학생만 AI 튜터 대화를 조회할 수 있습니다.', 403);

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
  if (auth.role !== 'student' || auth.status !== 'active') {
    return fail('FORBIDDEN', '활성 학생만 AI 튜터 대화를 만들 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);
  const courseId = typeof body?.courseId === 'string' && body.courseId.length > 0 ? body.courseId : null;

  if (courseId && !(await canReadCourse(client, courseId, auth))) {
    return fail('FORBIDDEN', '접근 가능한 강좌가 아닙니다.', 403);
  }

  const { data, error } = await client
    .from('ai_conversations')
    .insert({
      student_id: auth.userId,
      title: body?.title ?? '새 대화',
      course_id: courseId,
      messages: body?.messages ?? [],
      message_count: body?.messages?.length ?? 0,
    })
    .select('id, title, course_id, message_count, created_at, updated_at')
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  return Response.json({ ok: true, data }, { status: 201 });
}
