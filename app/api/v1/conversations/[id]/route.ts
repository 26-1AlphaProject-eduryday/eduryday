import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

// GET: get single conversation with messages
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'student') return fail('FORBIDDEN', '학생만 AI 튜터 대화를 조회할 수 있습니다.', 403);

  const { id } = await params;
  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const { data, error } = await client
    .from('ai_conversations')
    .select('id, title, course_id, messages, message_count, created_at, updated_at')
    .eq('id', id)
    .eq('student_id', auth.userId)
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  if (!data) return fail('NOT_FOUND', '대화를 찾을 수 없습니다.', 404);

  return ok({ conversation: data });
}

// PATCH: update conversation (save messages, update title)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'student' || auth.status !== 'active') {
    return fail('FORBIDDEN', '활성 학생만 AI 튜터 대화를 수정할 수 있습니다.', 403);
  }

  const { id } = await params;
  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body?.title) updates.title = body.title;
  if (body?.messages) {
    updates.messages = body.messages;
    updates.message_count = body.messages.length;
  }

  const { error } = await client
    .from('ai_conversations')
    .update(updates)
    .eq('id', id)
    .eq('student_id', auth.userId);

  if (error) return fail('DB_ERROR', error.message, 500);
  return ok({ updated: true });
}

// DELETE: delete conversation
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'student') return fail('FORBIDDEN', '학생만 AI 튜터 대화를 삭제할 수 있습니다.', 403);

  const { id } = await params;
  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const { error } = await client
    .from('ai_conversations')
    .delete()
    .eq('id', id)
    .eq('student_id', auth.userId);

  if (error) return fail('DB_ERROR', error.message, 500);
  return ok({ deleted: true });
}
