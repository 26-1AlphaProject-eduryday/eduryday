import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const url = new URL(req.url);
  const courseId = url.searchParams.get('courseId');
  const studentId = url.searchParams.get('studentId');

  let query = client.from('enrollments').select('id, course_id, student_id, enrolled_at');

  if (courseId) query = query.eq('course_id', courseId);
  if (studentId) query = query.eq('student_id', studentId);
  // Students can only see their own enrollments
  if (auth.role === 'student') query = query.eq('student_id', auth.userId);

  const { data, error } = await query.order('enrolled_at', { ascending: false });
  if (error) return fail('DB_ERROR', error.message, 500);

  return ok({ enrollments: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'professor' && auth.role !== 'admin') {
    return fail('FORBIDDEN', '교수 또는 관리자만 수강 등록할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);
  if (!body?.courseId || !body?.studentId) {
    return fail('VALIDATION_ERROR', 'courseId와 studentId는 필수입니다.');
  }

  const { data, error } = await client
    .from('enrollments')
    .insert({ course_id: body.courseId, student_id: body.studentId })
    .select('id, course_id, student_id, enrolled_at')
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  return Response.json({ ok: true, data }, { status: 201 });
}
