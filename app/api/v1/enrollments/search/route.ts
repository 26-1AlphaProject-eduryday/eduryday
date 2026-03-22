import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  if (auth.role !== 'professor' && auth.role !== 'admin') {
    return fail('FORBIDDEN', '교수 또는 관리자만 접근할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const courseId = url.searchParams.get('courseId');

  if (!q || q.length < 2) {
    return ok({ students: [] });
  }

  const { data: students, error } = await client
    .from('profiles')
    .select('id, name, email, student_id, department')
    .eq('role', 'student')
    .eq('status', 'active')
    .or(`name.ilike.%${q}%,email.ilike.%${q}%,student_id.ilike.%${q}%`)
    .limit(20);

  if (error) return fail('DB_ERROR', error.message, 500);

  let enrolledIds = new Set<string>();
  if (courseId) {
    const { data: enrollments } = await client
      .from('enrollments')
      .select('student_id')
      .eq('course_id', courseId);
    enrolledIds = new Set((enrollments ?? []).map((e: { student_id: string }) => e.student_id));
  }

  const result = (students ?? []).map((s: { id: string; name: string; email: string; student_id: string | null; department: string | null }) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    studentId: s.student_id,
    department: s.department,
    enrolled: enrolledIds.has(s.id),
  }));

  return ok({ students: result });
}
