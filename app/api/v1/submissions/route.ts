import { fail, ok } from '@/shared/lib/api/response';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.assignmentId || !body?.answer) {
    return fail('VALIDATION_ERROR', 'assignmentId, answer는 필수입니다.');
  }
  return ok({ id: `sub_${Date.now()}`, status: 'queued', assignmentId: body.assignmentId });
}
