import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

function isValidRole(value: unknown): value is 'student' | 'professor' {
  return value === 'student' || value === 'professor';
}

interface ProfileRow {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'professor' | 'admin' | null;
  status: 'pending' | 'active' | 'suspended';
  student_id: string | null;
  department: string | null;
}

async function getOrCreateProfile() {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return { auth: null, client: null, profile: null as ProfileRow | null, errorResponse: fail('UNAUTHORIZED', '로그인이 필요합니다.', 401) };
  }

  const client = getServiceRoleClient();

  if (!client) {
    return {
      auth,
      client: null,
      profile: null as ProfileRow | null,
      errorResponse: fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500),
    };
  }

  const { data, error } = await client
    .from('profiles')
    .select('id, name, email, role, status, student_id, department')
    .eq('id', auth.userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    return { auth, client, profile: null as ProfileRow | null, errorResponse: fail('DB_ERROR', error.message, 500) };
  }

  if (data) {
    return { auth, client, profile: data, errorResponse: null };
  }

  const fallbackProfile: ProfileRow = {
    id: auth.userId,
    email: auth.email,
    name: auth.email.split('@')[0] || '이름없음',
    role: auth.role,
    status: auth.status,
    student_id: null,
    department: null,
  };

  const { data: inserted, error: insertError } = await client
    .from('profiles')
    .upsert(fallbackProfile, { onConflict: 'id' })
    .select('id, name, email, role, status, student_id, department')
    .single<ProfileRow>();

  if (insertError) {
    return { auth, client, profile: null as ProfileRow | null, errorResponse: fail('DB_ERROR', insertError.message, 500) };
  }

  return { auth, client, profile: inserted, errorResponse: null };
}

export async function GET() {
  const result = await getOrCreateProfile();

  if (result.errorResponse) {
    return result.errorResponse;
  }

  return ok({ profile: result.profile });
}

export async function PATCH(req: Request) {
  const result = await getOrCreateProfile();

  if (result.errorResponse || !result.auth || !result.client) {
    return result.errorResponse;
  }

  const { auth, client, profile } = result;

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
    .upsert(
      {
        id: auth.userId,
        email: profile?.email ?? auth.email,
        name: updates.name,
        role: updates.role ?? profile?.role ?? auth.role,
        status: updates.status ?? profile?.status ?? auth.status,
        student_id: updates.student_id ?? profile?.student_id ?? null,
        department: updates.department ?? profile?.department ?? null,
      },
      { onConflict: 'id' },
    );

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
