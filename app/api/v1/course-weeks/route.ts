import { fail, ok } from '@/shared/lib/api/response';
import { canManageCourse, canReadCourse } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const url = new URL(req.url);
  const courseId = url.searchParams.get('courseId');

  if (!courseId) return fail('VALIDATION_ERROR', 'courseId는 필수입니다.');

  if (!(await canReadCourse(client, courseId, auth))) {
    return fail('FORBIDDEN', '접근 가능한 강좌가 아닙니다.', 403);
  }

  const { data, error } = await client
    .from('course_weeks')
    .select('id, course_id, number, title, status')
    .eq('course_id', courseId)
    .order('number', { ascending: true });

  if (error) return fail('DB_ERROR', error.message, 500);

  return ok({ weeks: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'professor' && auth.role !== 'admin') {
    return fail('FORBIDDEN', '교수 또는 관리자만 주차를 생성할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);
  if (!body?.courseId || body?.number == null || !body?.title) {
    return fail('VALIDATION_ERROR', 'courseId, number, title은 필수입니다.');
  }

  const courseId = String(body.courseId);

  if (!(await canManageCourse(client, courseId, auth))) {
    return fail('FORBIDDEN', '본인 강좌에만 주차를 생성할 수 있습니다.', 403);
  }

  const { data, error } = await client
    .from('course_weeks')
    .insert({
      course_id: courseId,
      number: Number(body.number),
      title: String(body.title),
      status: body.status ?? 'locked',
    })
    .select('id, course_id, number, title, status')
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  return Response.json({ ok: true, data }, { status: 201 });
}
