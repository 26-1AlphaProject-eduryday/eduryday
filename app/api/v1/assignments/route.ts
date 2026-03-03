import { fail, ok } from '@/shared/lib/api/response';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.title || typeof body.title !== 'string') {
    return fail('VALIDATION_ERROR', 'title(string)은 필수입니다.');
  }
  return ok({ id: `asg_${Date.now()}`, title: body.title, createdAt: new Date().toISOString() });
}
