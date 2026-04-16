import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const { id } = await params;
  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  // Get current lesson
  const { data: lesson, error: lessonError } = await client
    .from('lessons')
    .select('id, completed_by')
    .eq('id', id)
    .single();

  if (lessonError || !lesson) return fail('NOT_FOUND', '강의를 찾을 수 없습니다.', 404);

  const completedBy: string[] = Array.isArray(lesson.completed_by) ? lesson.completed_by : [];
  const isCompleted = completedBy.includes(auth.userId);

  let newCompletedBy: string[];
  if (isCompleted) {
    // Toggle off: remove student
    newCompletedBy = completedBy.filter((uid) => uid !== auth.userId);
  } else {
    // Toggle on: add student
    newCompletedBy = [...completedBy, auth.userId];
  }

  const { error: updateError } = await client
    .from('lessons')
    .update({ completed_by: newCompletedBy })
    .eq('id', id);

  if (updateError) return fail('DB_ERROR', updateError.message, 500);

  return ok({ completed: !isCompleted, lessonId: id });
}
