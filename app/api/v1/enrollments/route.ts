import { fail, ok } from '@/shared/lib/api/response';
import { canManageCourse, canReadCourse, getAccessibleCourseIds } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const url = new URL(req.url);
  const courseId = url.searchParams.get('courseId');
  const studentId = url.searchParams.get('studentId');

  let query = client
    .from('enrollments')
    .select('id, course_id, student_id, enrolled_at, courses(title), profiles!enrollments_student_id_fkey(name, email, student_id, department)');

  if (courseId) query = query.eq('course_id', courseId);
  if (studentId) query = query.eq('student_id', studentId);
  // Students can only see their own enrollments
  if (auth.role === 'student') query = query.eq('student_id', auth.userId);
  if (courseId && !(await canReadCourse(client, courseId, auth))) {
    return fail('FORBIDDEN', '접근 가능한 강좌가 아닙니다.', 403);
  }
  if (!courseId && auth.role !== 'admin' && auth.role !== 'student') {
    const accessibleCourseIds = await getAccessibleCourseIds(client, auth);
    if (accessibleCourseIds !== null) {
      if (accessibleCourseIds.length === 0) {
        return ok({ enrollments: [] });
      }
      query = query.in('course_id', accessibleCourseIds);
    }
  }

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

  const courseId = String(body.courseId);
  const studentId = String(body.studentId);

  if (!(await canManageCourse(client, courseId, auth))) {
    return fail('FORBIDDEN', '본인 강좌에만 수강생을 등록할 수 있습니다.', 403);
  }

  const { data: studentProfile, error: studentError } = await client
    .from('profiles')
    .select('id')
    .eq('id', studentId)
    .eq('role', 'student')
    .eq('status', 'active')
    .maybeSingle<{ id: string }>();

  if (studentError) return fail('DB_ERROR', studentError.message, 500);
  if (!studentProfile) return fail('VALIDATION_ERROR', '활성 학생만 등록할 수 있습니다.');

  const { data, error } = await client
    .from('enrollments')
    .insert({ course_id: courseId, student_id: studentId })
    .select('id, course_id, student_id, enrolled_at')
    .single();

  if (error) return fail('DB_ERROR', error.message, 500);
  return Response.json({ ok: true, data }, { status: 201 });
}
