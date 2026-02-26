import { ok } from '@/lib/api/response';

export async function GET() {
  return ok({ service: 'eduryday', status: 'healthy', ts: new Date().toISOString() });
}
