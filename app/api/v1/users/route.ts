import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin' | null;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth || auth.role !== 'admin') {
    return fail('UNAUTHORIZED', '관리자 권한이 필요합니다.', 401);
  }

  const adminClient = getServiceRoleClient();

  if (!adminClient) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const url = new URL(req.url);
  const role = url.searchParams.get('role') ?? 'all';
  const status = url.searchParams.get('status') ?? 'all';
  const query = (url.searchParams.get('q') ?? '').trim();
  const page = Number(url.searchParams.get('page') ?? '1');
  const pageSize = Number(url.searchParams.get('pageSize') ?? '10');
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let dbQuery = adminClient
    .from('profiles')
    .select('id, name, email, role, status, created_at, updated_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (role !== 'all') {
    dbQuery = dbQuery.eq('role', role);
  }

  if (status !== 'all') {
    dbQuery = dbQuery.eq('status', status);
  }

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data, error, count } = await dbQuery;

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  const rows = (data ?? []) as ProfileRow[];

  const users = rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role === 'professor' ? '교수' : row.role === 'admin' ? '관리자' : '학생',
    status: row.status === 'active' ? '활성' : row.status === 'pending' ? '승인대기' : '정지',
    joinedAt: row.created_at.slice(0, 10),
    lastLogin: row.updated_at.replace('T', ' ').slice(0, 16),
  }));

  const activeCount = rows.filter((row) => row.status === 'active').length;
  const studentCount = rows.filter((row) => row.role === 'student').length;
  const professorCount = rows.filter((row) => row.role === 'professor').length;

  return ok({
    users,
    total: count ?? users.length,
    page,
    pageSize,
    stats: {
      totalUsers: count ?? users.length,
      students: studentCount,
      professors: professorCount,
      active: activeCount,
    },
  });
}
