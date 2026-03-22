import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

const SYSTEM_PROMPT = `당신은 EduRyday AI 튜터입니다. 다음 규칙을 따르세요:
1. 학생의 질문에 힌트와 설명으로 답변하되, 정답을 직접 알려주지 마세요.
2. 한국어로 답변하세요.
3. 코딩 관련 질문에는 개념 설명과 힌트를 제공하고, 코드를 직접 작성해주지 마세요.
4. 학생이 스스로 답을 찾을 수 있도록 단계적으로 안내하세요.
5. 학습 포인트가 있으면 마지막에 정리해주세요.`;

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) {
    return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 });
  }

  if (auth.role !== 'student') {
    return new Response(JSON.stringify({ error: '학생만 AI 튜터를 사용할 수 있습니다.' }), { status: 403 });
  }

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI 서비스가 설정되지 않았습니다. 관리자에게 문의하세요.' }), { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.messages || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'messages 배열이 필요합니다.' }), { status: 400 });
  }

  const conversationId = body.conversationId as string | undefined;

  // Rate limiting: check monthly message count
  const client = getServiceRoleClient();
  if (client) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { count } = await client
      .from('ai_conversations')
      .select('message_count', { count: 'exact', head: false })
      .eq('student_id', auth.userId)
      .gte('updated_at', monthStart.toISOString());

    const totalMessages = (count ?? 0);
    const maxPerMonth = parseInt(process.env.AI_MAX_QUESTIONS_PER_MONTH ?? '100', 10);

    if (totalMessages > maxPerMonth) {
      return new Response(JSON.stringify({ error: `이번 달 질문 한도(${maxPerMonth}회)를 초과했습니다.` }), { status: 429 });
    }
  }

  const model = process.env.AI_MODEL ?? 'claude-sonnet-4-20250514';

  const result = streamText({
    model: anthropic(model),
    system: SYSTEM_PROMPT,
    messages: body.messages,
  });

  // Save conversation in background (don't block streaming)
  if (client && conversationId) {
    // We'll save the full conversation after streaming completes via a separate endpoint
    void conversationId;
  }

  return result.toTextStreamResponse();
}
