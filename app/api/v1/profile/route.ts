import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

function isValidRole(value: unknown): value is 'student' | 'professor' {
  return value === 'student' || value === 'professor';
}

export async function GET() {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const { data, error } = await client
    .from('profiles')
    .select('id, name, email, role, status, student_id, department')
    .eq('id', auth.userId)
    .maybeSingle();

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  if (!data) {
    return fail('NOT_FOUND', '프로필을 찾을 수 없습니다.', 404);
  }

  return ok({ profile: data });
}

export async function PATCH(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);

  const trimmedName = typeof body?.name === 'string' ? body.name.trim() : '';
  const trimmedDepartment = typeof body?.department === 'string' ? body.department.trim() : '';
  const trimmedStudentId = typeof body?.studentId === 'string' ? body.studentId.trim() : '';
  const role = body?.role;

  if (trimmedName.length < 1) {
    return fail('VALIDATION_ERROR', 'name은 필수입니다.');
  }

  if (role !== undefined && !isValidRole(role)) {
    return fail('VALIDATION_ERROR', 'role은 student 또는 professor만 가능합니다.');
  }

  if (role !== undefined && trimmedDepartment.length < 1) {
    return fail('VALIDATION_ERROR', 'department는 필수입니다.');
  }

  if (role === 'student' && trimmedStudentId.length < 1) {
    return fail('VALIDATION_ERROR', 'studentId는 학생 신청 시 필수입니다.');
  }

  const updates: {
    name: string;
    department?: string;
    student_id?: string | null;
    role?: 'student' | 'professor';
    status?: 'pending' | 'active';
  } = {
    name: trimmedName,
  };

  if (role !== undefined) {
    updates.role = role;
    updates.department = trimmedDepartment;
    updates.student_id = role === 'student' ? trimmedStudentId : null;
    updates.status = auth.email.toLowerCase() === 'eduryday@gmail.com' ? 'active' : 'pending';
  }

  const { error } = await client
    .from('profiles')
    .update(updates)
    .eq('id', auth.userId);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({
    name: trimmedName,
    role: updates.role ?? auth.role,
    studentId: updates.student_id ?? null,
    department: updates.department ?? null,
    status: updates.status ?? auth.status,
  });
}
