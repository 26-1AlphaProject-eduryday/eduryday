import { StudentHeader } from '@/widgets/header';
import type { Conversation } from '@/entities/chat';
import { MOCK_CONVERSATIONS } from '@/entities/chat';

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function ConversationListItem({ item }: { item: Conversation }) {
  if (item.active) {
    return (
      <li>
        <button
          type="button"
          aria-current="true"
          className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-left"
        >
          <div className="text-sm font-medium text-blue-900">{item.title}</div>
          <div className="mt-0.5 text-xs text-blue-600">
            {item.course} · {item.time}
          </div>
        </button>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
      >
        <div className="text-sm font-medium text-gray-800">{item.title}</div>
        <div className="mt-0.5 text-xs text-gray-500">
          {item.course} · {item.time}
        </div>
      </button>
    </li>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* New conversation button */}
      <div className="border-b border-gray-200 p-4">
        <button
          type="button"
          className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          + 새 대화 시작
        </button>
      </div>

      {/* Conversation list */}
      <nav className="flex-1 overflow-auto p-4" aria-label="대화 목록">
        <p className="mb-3 text-sm font-medium text-gray-700">최근 대화</p>
        <ul className="space-y-1">
          {MOCK_CONVERSATIONS.map((item) => (
            <ConversationListItem key={item.id} item={item} />
          ))}
        </ul>
      </nav>

      {/* Usage indicator */}
      <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-500">
        이번 달 사용량: 47/100 질문
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Chat area
// ---------------------------------------------------------------------------

function ChatHeader() {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <div>
        <h1 className="text-base font-semibold text-gray-900">정렬 알고리즘 질문</h1>
        <p className="text-xs text-gray-500">알고리즘 기초 · 3주차 실습</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-50"
        >
          대화 저장
        </button>
        <button
          type="button"
          aria-label="더보기"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
        >
          ⋮
        </button>
      </div>
    </div>
  );
}

function ContextBanner() {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
      현재 학습 중: 알고리즘 기초 {'>'} 3주차 {'>'} 실습 1
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="max-w-xs rounded-2xl rounded-tr-sm bg-gray-800 px-4 py-3 text-sm text-white lg:max-w-sm">
        {text}
      </div>
      <div className="h-7 w-7 shrink-0 rounded-full bg-gray-300" aria-hidden="true" />
    </div>
  );
}

function AiIcon() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm"
      aria-hidden="true"
    >
      AI
    </div>
  );
}

function HintBox({ text }: { text: string }) {
  return (
    <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
      <p className="mb-1 text-xs font-semibold text-yellow-700">힌트</p>
      <p className="text-xs leading-relaxed text-yellow-700">{text}</p>
    </div>
  );
}

function LearningPointBox({ points }: { points: string[] }) {
  return (
    <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3">
      <p className="mb-2 text-xs font-semibold text-green-700">학습 포인트</p>
      <ul className="space-y-1">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-1.5 text-xs text-green-700">
            <span className="mt-0.5 shrink-0">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AiMessage({
  text,
  hint,
  learningPoints,
}: {
  text: string;
  hint?: string;
  learningPoints?: string[];
}) {
  return (
    <div className="flex items-start gap-3">
      <AiIcon />
      <div className="max-w-sm lg:max-w-lg">
        <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-sm text-gray-800">
          {text}
        </div>
        {hint && <HintBox text={hint} />}
        {learningPoints && <LearningPointBox points={learningPoints} />}
      </div>
    </div>
  );
}

function MessageArea() {
  return (
    <div
      className="flex-1 overflow-auto p-6"
      role="log"
      aria-label="AI 튜터 대화"
      aria-live="polite"
    >
      <div className="space-y-6">
        <ContextBanner />

        <UserMessage text="버블 정렬에서 테스트 3이 왜 시간 초과가 나는 건가요?" />

        <AiMessage
          text="버블 정렬의 최악 시간 복잡도는 O(n²)입니다. 테스트 3의 입력이 크거나 역순으로 정렬된 배열일 경우, 모든 비교가 발생해 시간이 많이 걸릴 수 있어요."
          hint="내부 반복문에서 이미 정렬된 부분을 다시 순회하고 있지는 않은지 확인해보세요. 플래그 변수를 활용하면 불필요한 반복을 줄일 수 있습니다."
        />

        <UserMessage text="퀵 정렬을 사용하면 될까요?" />

        <AiMessage
          text="좋은 접근입니다! 퀵 정렬은 평균 O(n log n)으로 훨씬 빠르지만, 이번 실습은 버블 정렬 최적화가 목표예요. 먼저 버블 정렬 내에서 개선 방법을 찾아보는 걸 추천드려요."
          learningPoints={[
            '버블 정렬의 시간 복잡도는 최선 O(n), 최악 O(n²)입니다.',
            '조기 종료(early exit) 최적화로 이미 정렬된 배열을 빠르게 처리할 수 있습니다.',
            '내부 반복 범위를 매 패스마다 줄이면 불필요한 비교를 줄일 수 있습니다.',
          ]}
        />
      </div>
    </div>
  );
}

function InputArea() {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="relative flex items-center gap-3">
        {/* Attachment button */}
        <button
          type="button"
          aria-label="파일 첨부"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Text input */}
        <input
          type="text"
          placeholder="질문을 입력하세요..."
          className="flex-1 rounded-lg border border-gray-200 py-2 pl-4 pr-12 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
          aria-label="질문 입력"
        />

        {/* Send button */}
        <button
          type="button"
          aria-label="전송"
          className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 text-white transition-colors hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-gray-500">
        AI 튜터는 정답을 직접 알려주지 않고 힌트와 설명으로 스스로 풀 수 있도록 도와드립니다.
      </p>
    </div>
  );
}

function ChatArea() {
  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-white">
      <ChatHeader />
      <MessageArea />
      <InputArea />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function AiTutorPage() {
  return (
    <div className="flex h-screen flex-col bg-white">
      <StudentHeader />
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
}
