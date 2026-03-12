import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const { id } = await params;
  const { data, error } = await client.from('courses').select('*').eq('id', id).maybeSingle();

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  if (!data) {
    return fail('NOT_FOUND', '강좌를 찾을 수 없습니다.', 404);
  }

  return ok(data);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();

  if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
    return fail('UNAUTHORIZED', '교수 또는 관리자 권한이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);

  const updatePayload: {
    title?: string;
    professor_name?: string;
    semester?: string;
    section?: string | null;
    status?: 'active' | 'closed' | 'draft' | 'pending';
    student_count?: number;
    current_week?: number;
    total_weeks?: number;
  } = {};

  if (typeof body?.title === 'string') {
    updatePayload.title = body.title;
  }
  if (typeof body?.professorName === 'string') {
    updatePayload.professor_name = body.professorName;
  }
  if (typeof body?.semester === 'string') {
    updatePayload.semester = body.semester;
  }
  if (typeof body?.section === 'string' || body?.section === null) {
    updatePayload.section = body.section;
  }
  if (body?.status === 'active' || body?.status === 'closed' || body?.status === 'draft' || body?.status === 'pending') {
    updatePayload.status = body.status;
  }
  if (typeof body?.studentCount === 'number') {
    updatePayload.student_count = body.studentCount;
  }
  if (typeof body?.currentWeek === 'number') {
    updatePayload.current_week = body.currentWeek;
  }
  if (typeof body?.totalWeeks === 'number') {
    updatePayload.total_weeks = body.totalWeeks;
  }

  const { error } = await client.from('courses').update(updatePayload).eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ id });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();

  if (!auth || (auth.role !== 'admin' && auth.role !== 'professor')) {
    return fail('UNAUTHORIZED', '관리자 또는 교수 권한이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const { id } = await params;
  const { error } = await client.from('courses').delete().eq('id', id);

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ id });
}
