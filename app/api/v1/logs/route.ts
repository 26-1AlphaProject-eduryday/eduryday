import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface ActivityLogRow {
  id: number;
  type: 'login' | 'submit' | 'ai' | 'course' | 'error' | 'grading' | 'access';
  user_name: string;
  user_role: string | null;
  ip: string | null;
  message: string;
  created_at: string;
}

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth || auth.role !== 'admin') {
    return fail('UNAUTHORIZED', '관리자 권한이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const url = new URL(req.url);
  const type = url.searchParams.get('type') ?? 'all';
  const page = Number(url.searchParams.get('page') ?? '1');
  const pageSize = Number(url.searchParams.get('pageSize') ?? '10');
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let dbQuery = client
    .from('activity_logs')
    .select('id, type, user_name, user_role, ip, message, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (type !== 'all') {
    dbQuery = dbQuery.eq('type', type);
  }

  const { data, error, count } = await dbQuery;

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  const rows = (data ?? []) as ActivityLogRow[];
  const logs = rows.map((row) => ({
    id: row.id,
    timestamp: row.created_at.replace('T', ' ').slice(0, 19),
    type: row.type,
    user: row.user_name,
    userRole: row.user_role,
    ip: row.ip,
    message: row.message,
  }));

  return ok({ logs, total: count ?? logs.length, page, pageSize });
}
