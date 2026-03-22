import { fail } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'student') {
    return fail('FORBIDDEN', '학생만 수강신청할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === 'string' ? body.code.trim() : '';

  if (!code) {
    return fail('VALIDATION_ERROR', '수강신청 코드를 입력해주세요.');
  }

  // Find course by enrollment code
  const { data: course, error: courseError } = await client
    .from('courses')
    .select('id, title')
    .eq('enrollment_code', code)
    .maybeSingle();

  if (courseError) return fail('DB_ERROR', courseError.message, 500);
  if (!course) return fail('NOT_FOUND', '유효하지 않은 수강신청 코드입니다.', 404);

  // Check if already enrolled
  const { data: existing } = await client
    .from('enrollments')
    .select('id')
    .eq('course_id', course.id)
    .eq('student_id', auth.userId)
    .maybeSingle();

  if (existing) {
    return fail('DUPLICATE', '이미 수강 중인 강좌입니다.');
  }

  // Enroll
  const { error: enrollError } = await client
    .from('enrollments')
    .insert({ course_id: course.id, student_id: auth.userId });

  if (enrollError) return fail('DB_ERROR', enrollError.message, 500);

  return Response.json({ ok: true, data: { courseId: course.id, courseTitle: course.title } }, { status: 201 });
}
