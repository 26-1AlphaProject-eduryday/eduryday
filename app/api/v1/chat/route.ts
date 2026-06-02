import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { canReadCourse } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

const SYSTEM_PROMPT = `당신은 EduRyday AI 튜터입니다. 다음 규칙을 따르세요:
1. 학생의 질문에 힌트와 설명으로 답변하되, 정답을 직접 알려주지 마세요.
2. 한국어로 답변하세요.
3. 코딩 관련 질문에는 개념 설명과 힌트를 제공하고, 코드를 직접 작성해주지 마세요.
4. 학생이 스스로 답을 찾을 수 있도록 단계적으로 안내하세요.
5. 학습 포인트가 있으면 마지막에 정리해주세요.`;

interface ConversationCourseRow {
  course_id: string | null;
}

interface CourseContextRow {
  title: string;
  description: string | null;
  professor_name: string | null;
}

interface WeekContextRow {
  id: string;
  number: number;
  title: string;
}

interface LessonContextRow {
  week_id: string;
  title: string;
  type: string;
}

interface AssignmentContextRow {
  title: string;
  type: string;
  deadline: string | null;
  description: string | null;
}

async function buildCourseContext(courseId: string | null, auth: NonNullable<Awaited<ReturnType<typeof getRouteAuthContext>>>) {
  if (!courseId) return '';

  const client = getServiceRoleClient();
  if (!client || !(await canReadCourse(client, courseId, auth))) {
    return '';
  }

  const [{ data: course }, { data: weeks }, { data: assignments }] = await Promise.all([
    client
      .from('courses')
      .select('title, description, professor_name')
      .eq('id', courseId)
      .maybeSingle<CourseContextRow>(),
    client
      .from('course_weeks')
      .select('id, number, title')
      .eq('course_id', courseId)
      .order('number', { ascending: true })
      .limit(8),
    client
      .from('assignments')
      .select('title, type, deadline, description')
      .eq('course_id', courseId)
      .eq('status', 'active')
      .order('deadline', { ascending: true })
      .limit(5),
  ]);

  const weekRows = (weeks ?? []) as WeekContextRow[];
  const weekIds = weekRows.map((week) => week.id);
  const { data: lessons } = weekIds.length > 0
    ? await client
        .from('lessons')
        .select('week_id, title, type')
        .in('week_id', weekIds)
        .order('order_num', { ascending: true })
        .limit(24)
    : { data: [] };

  const lessonRows = (lessons ?? []) as LessonContextRow[];
  const assignmentRows = (assignments ?? []) as AssignmentContextRow[];
  const lines = [
    `강좌: ${course?.title ?? '알 수 없음'}`,
    course?.description ? `설명: ${course.description}` : '',
    course?.professor_name ? `담당: ${course.professor_name}` : '',
    weekRows.length > 0
      ? `주차: ${weekRows.map((week) => `${week.number}주차 ${week.title}`).join(', ')}`
      : '',
    lessonRows.length > 0
      ? `레슨: ${lessonRows.map((lesson) => `${lesson.title}(${lesson.type})`).join(', ')}`
      : '',
    assignmentRows.length > 0
      ? `활성 과제: ${assignmentRows.map((assignment) => `${assignment.title}(${assignment.type}${assignment.deadline ? `, 마감 ${assignment.deadline.slice(0, 10)}` : ''})`).join(', ')}`
      : '',
  ].filter(Boolean);

  return lines.length > 0 ? `\n\n[강좌 문맥]\n${lines.join('\n')}` : '';
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) {
    return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 });
  }

  if (auth.role !== 'student') {
    return new Response(JSON.stringify({ error: '학생만 AI 튜터를 사용할 수 있습니다.' }), { status: 403 });
  }

  if (auth.status !== 'active') {
    return new Response(JSON.stringify({ error: '활성 계정만 AI 튜터를 사용할 수 있습니다.' }), { status: 403 });
  }

  // Check API key
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI 서비스가 설정되지 않았습니다. 관리자에게 문의하세요.' }), { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.messages || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'messages 배열이 필요합니다.' }), { status: 400 });
  }

  // Convert UIMessage format (parts) to ModelMessage format (content) for streamText
  const normalizedMessages = body.messages.map((msg: { role: string; content?: string; parts?: { type: string; text: string }[] }) => {
    if (msg.content) return { role: msg.role, content: msg.content };
    if (msg.parts) {
      const textPart = msg.parts.find((p) => p.type === 'text');
      return { role: msg.role, content: textPart?.text ?? '' };
    }
    return { role: msg.role, content: '' };
  });

  const conversationId = typeof body.conversationId === 'string' ? body.conversationId : undefined;
  let courseId = typeof body.courseId === 'string' ? body.courseId : null;

  // Rate limiting: check monthly message count
  const client = getServiceRoleClient();
  if (client) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { data: monthlyConversations } = await client
      .from('ai_conversations')
      .select('message_count')
      .eq('student_id', auth.userId)
      .gte('updated_at', monthStart.toISOString());

    const totalMessages = ((monthlyConversations ?? []) as { message_count: number | null }[])
      .reduce((sum, row) => sum + (row.message_count ?? 0), 0);
    const maxPerMonth = parseInt(process.env.AI_MAX_QUESTIONS_PER_MONTH ?? '100', 10);

    if (totalMessages >= maxPerMonth) {
      return new Response(JSON.stringify({ error: `이번 달 질문 한도(${maxPerMonth}회)를 초과했습니다.` }), { status: 429 });
    }

    if (conversationId) {
      const { data: conversation } = await client
        .from('ai_conversations')
        .select('course_id')
        .eq('id', conversationId)
        .eq('student_id', auth.userId)
        .maybeSingle<ConversationCourseRow>();

      courseId = conversation?.course_id ?? courseId;
    }
  }

  const model = process.env.OPENROUTER_MODEL ?? 'nvidia/nemotron-3-super-120b-a12b:free';
  const courseContext = await buildCourseContext(courseId, auth);

  const result = streamText({
    model: openrouter(model),
    system: `${SYSTEM_PROMPT}${courseContext}`,
    messages: normalizedMessages,
  });

  // Save conversation in background (don't block streaming)
  if (client && conversationId) {
    // We'll save the full conversation after streaming completes via a separate endpoint
    void conversationId;
  }

  return result.toUIMessageStreamResponse();
}
