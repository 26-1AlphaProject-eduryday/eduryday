import { fail, ok } from '@/shared/lib/api/response';
import { isAdminEmail } from '@/shared/lib/auth/profile';
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
    if (isAdminEmail(data.email ?? auth.email) && (data.role !== 'admin' || data.status !== 'active')) {
      const adminProfile = { ...data, role: 'admin' as const, status: 'active' as const };
      const { error: adminUpdateError } = await client
        .from('profiles')
        .update({ role: adminProfile.role, status: adminProfile.status })
        .eq('id', auth.userId);

      if (adminUpdateError) {
        return { auth, client, profile: null as ProfileRow | null, errorResponse: fail('DB_ERROR', adminUpdateError.message, 500) };
      }

      return { auth, client, profile: adminProfile, errorResponse: null };
    }

    return { auth, client, profile: data, errorResponse: null };
  }

  const isAdmin = isAdminEmail(auth.email);
  const fallbackProfile: ProfileRow = {
    id: auth.userId,
    email: auth.email,
    name: auth.email.split('@')[0] || '이름없음',
    role: isAdmin ? 'admin' : auth.role,
    status: isAdmin ? 'active' : auth.status,
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

  // Log profile access (login tracking) - fire and forget
  if (result.client && result.profile) {
    await result.client.from('activity_logs').insert({
      type: 'login',
      user_name: result.profile.name,
      user_role: result.profile.role ?? 'unknown',
      message: '프로필 조회 (로그인)',
    }); // Fire and forget; errors are intentionally ignored
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
  const isAdmin = isAdminEmail(auth.email);

  if (trimmedName.length < 1) {
    return fail('VALIDATION_ERROR', 'name은 필수입니다.');
  }

  if (role !== undefined && !isAdmin && !isValidRole(role)) {
    return fail('VALIDATION_ERROR', 'role은 student 또는 professor만 가능합니다.');
  }

  if (role !== undefined && !isAdmin && trimmedDepartment.length < 1) {
    return fail('VALIDATION_ERROR', 'department는 필수입니다.');
  }

  if (!isAdmin && role === 'student' && trimmedStudentId.length < 1) {
    return fail('VALIDATION_ERROR', 'studentId는 학생 신청 시 필수입니다.');
  }

  const updates: {
    name: string;
    department?: string;
    student_id?: string | null;
    role?: 'student' | 'professor' | 'admin';
    status?: 'pending' | 'active';
  } = {
    name: trimmedName,
  };

  if (trimmedDepartment.length > 0) {
    updates.department = trimmedDepartment;
  }

  if (trimmedStudentId.length > 0) {
    updates.student_id = trimmedStudentId;
  }

  if (isAdmin) {
    updates.role = 'admin';
    updates.status = 'active';
    updates.student_id = null;
  } else if (role !== undefined) {
    updates.role = role;
    updates.department = trimmedDepartment;
    updates.student_id = role === 'student' ? trimmedStudentId : null;
    updates.status = 'pending';
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
