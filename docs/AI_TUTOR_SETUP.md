# AI 튜터 구현 가이드

이 문서는 EduRyday의 AI 튜터 기능을 구현하기 위한 단계별 가이드입니다.

## 현재 상태

- AI 튜터 UI와 `/api/v1/chat` 스트리밍 API 구현 완료
- OpenRouter 기반 LLM 연동 및 `ai_conversations` 대화 저장 구현 완료
- 수강 강좌/주차/레슨/활성 과제 기반 문맥 주입 구현 완료
- pgvector 기반 자료 검색 증강은 Phase 2 과제

## 구현 단계

### 1단계: 환경변수 설정

`.env.local`에 추가:
```
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free
```

API 키는 OpenRouter 콘솔에서 발급받습니다.

### 2단계: LLM SDK 설치

```bash
# 이미 설치됨
npm install ai @ai-sdk/openai
```

### 3단계: DB 테이블 생성

`supabase/migrations/` 에 새 마이그레이션 파일 생성:

```sql
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id),
  title text not null default '새 대화',
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.ai_conversations enable row level security;

-- 학생은 자신의 대화만 조회/생성
create policy ai_conversations_student_select on public.ai_conversations
  for select using (auth.uid() = student_id);

create policy ai_conversations_student_insert on public.ai_conversations
  for insert with check (auth.uid() = student_id);

create policy ai_conversations_student_update on public.ai_conversations
  for update using (auth.uid() = student_id);

-- 인덱스
create index idx_ai_conversations_student on public.ai_conversations(student_id);
create index idx_ai_conversations_course on public.ai_conversations(course_id);
```

적용: `npx supabase db push`

### 4단계: Chat API 엔드포인트 구현

`app/api/v1/chat/route.ts` 생성:

```typescript
// Vercel AI SDK 사용 예시
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return new Response('Unauthorized', { status: 401 });

  const { messages, conversationId } = await req.json();

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL ?? 'nvidia/nemotron-3-super-120b-a12b:free'),
    system: `당신은 EduRyday AI 튜터입니다. 학생의 질문에 힌트와 설명으로 답하되,
             정답을 직접 알려주지 마세요. 한국어로 답변하세요.`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
```

### 5단계: 프론트엔드 연동

`_pages/ai-tutor/ui/AiTutorPage.tsx`를 수정:
- `useChat()` 훅 사용 (Vercel AI SDK 제공)
- 버튼 disabled 상태 해제
- 실시간 스트리밍 응답 표시

### 6단계: 대화 영속화

- 새 대화 시작 → `ai_conversations` INSERT
- 메시지 전송 시 → `messages` JSONB 업데이트
- 대화 목록 → `ai_conversations` SELECT

## 추천 아키텍처

```
[프론트엔드]          [백엔드]              [외부]
AiTutorPage  →  /api/v1/chat/route.ts  →  OpenRouter API
 (useChat)       (streamText)              (selected model)
     ↕                ↕
 Supabase Client  Supabase Service Role
     ↕                ↕
           [ai_conversations 테이블]
```

## 비용 관리

- **Rate Limiting**: 학생당 월 100질문 제한 (ai_conversations의 messages 카운트로 추적)
- **토큰 예산**: 선택한 OpenRouter 모델 가격 기준으로 산정
- **최대 대화 길이**: 대화당 100메시지 권장 (context window 절약)

## 환경변수 요약

| 변수 | 필수 | 설명 |
|------|------|------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API 키 |
| `OPENROUTER_MODEL` | No | 사용할 모델 |
| `AI_MAX_QUESTIONS_PER_MONTH` | No | 학생당 월 최대 질문 수 (기본: 100) |

## Phase 2 고려사항 (Vector RAG)

- pgvector 확장 활성화 (`create extension vector;`)
- 강의 자료 임베딩 파이프라인
- 파일/강의자료 청크 검색과 현재 강좌 문맥 결합
