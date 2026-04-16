import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET() {
  const auth = await getRouteAuthContext();
  if (!auth || auth.role !== 'admin') return fail('UNAUTHORIZED', '관리자 권한이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const { data, error } = await client
    .from('admin_settings')
    .select('key, value, updated_at');

  if (error) return fail('DB_ERROR', error.message, 500);

  // Convert array of {key, value} to a single settings object
  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }

  return ok({ settings });
}

export async function PATCH(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth || auth.role !== 'admin') return fail('UNAUTHORIZED', '관리자 권한이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return fail('VALIDATION_ERROR', '설정 데이터가 필요합니다.');

  // Upsert each key-value pair
  const entries = Object.entries(body);
  for (const [key, value] of entries) {
    await client
      .from('admin_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  }

  return ok({ saved: entries.length });
}
