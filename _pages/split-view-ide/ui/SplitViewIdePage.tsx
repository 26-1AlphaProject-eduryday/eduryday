import type { TestResult } from '@/entities/assignment';
import { MOCK_TEST_RESULTS } from '@/entities/assignment';
import { MOCK_CURRENT_STUDENT } from '@/entities/user';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CODE_LINES: { num: number; tokens: React.ReactNode }[] = [
  {
    num: 1,
    tokens: (
      <>
        <span className="text-blue-600">def</span>{' '}
        <span className="text-yellow-600">bubble_sort</span>
        <span className="text-gray-700">(arr):</span>
      </>
    ),
  },
  {
    num: 2,
    tokens: (
      <>
        <span className="pl-8 text-gray-400">{'# 여기에 코드를 작성하세요'}</span>
      </>
    ),
  },
  {
    num: 3,
    tokens: (
      <>
        <span className="pl-8 text-gray-700">
          n <span className="text-gray-500">=</span> len(arr)
        </span>
      </>
    ),
  },
  {
    num: 4,
    tokens: (
      <>
        <span className="pl-8 text-blue-600">for</span>
        <span className="text-gray-700"> i </span>
        <span className="text-blue-600">in</span>
        <span className="text-gray-700"> range(n):</span>
      </>
    ),
  },
  {
    num: 5,
    tokens: (
      <>
        <span className="pl-16 text-blue-600">for</span>
        <span className="text-gray-700"> j </span>
        <span className="text-blue-600">in</span>
        <span className="text-gray-700"> range(</span>
        <span className="text-gray-500">0</span>
        <span className="text-gray-700">, n-i-</span>
        <span className="text-gray-500">1</span>
        <span className="text-gray-700">):</span>
      </>
    ),
  },
  {
    num: 6,
    tokens: (
      <>
        <span className="pl-24 text-blue-600">if</span>
        <span className="text-gray-700"> arr[j] </span>
        <span className="text-gray-500">{'>'}</span>
        <span className="text-gray-700"> arr[j+</span>
        <span className="text-gray-500">1</span>
        <span className="text-gray-700">]:</span>
      </>
    ),
  },
  {
    num: 7,
    tokens: (
      <>
        <span className="pl-32 text-gray-700">
          arr[j], arr[j+<span className="text-gray-500">1</span>]{' '}
          <span className="text-gray-500">=</span> arr[j+<span className="text-gray-500">1</span>],
          arr[j]
        </span>
      </>
    ),
  },
  {
    num: 8,
    tokens: (
      <>
        <span className="pl-8 text-blue-600">return</span>
        <span className="text-gray-700"> arr</span>
      </>
    ),
  },
];


// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function IdeHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
      {/* Left: logo + breadcrumb */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex shrink-0 items-center gap-2">
          <div className="h-6 w-6 rounded bg-gray-800" aria-hidden="true" />
          <span className="text-sm font-bold text-gray-900">EduRyday</span>
        </div>

        <span className="text-gray-300" aria-hidden="true">›</span>

        <nav aria-label="경로" className="flex min-w-0 items-center gap-1 text-sm text-gray-500">
          <span className="truncate">알고리즘 기초</span>
          <span className="shrink-0 text-gray-300" aria-hidden="true">›</span>
          <span className="truncate">3주차</span>
          <span className="shrink-0 text-gray-300" aria-hidden="true">›</span>
          <span className="truncate font-medium text-gray-800">실습 1: 정렬 구현</span>
        </nav>
      </div>

      {/* Right: save + avatar */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          저장
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
          aria-label="사용자 메뉴"
        >
          <div className="h-6 w-6 rounded-full bg-gray-300" aria-hidden="true" />
          <span className="text-xs font-medium">{MOCK_CURRENT_STUDENT.name}</span>
          <span className="text-xs text-gray-400" aria-hidden="true">▼</span>
        </button>
      </div>
    </header>
  );
}

function ProblemTabs() {
  const tabs = ['문제', '강의 영상', '참고 자료'] as const;
  return (
    <div className="flex border-b border-gray-200" role="tablist">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={i === 0}
          className={
            i === 0
              ? 'border-b-2 border-gray-800 px-5 py-3 text-sm font-medium text-gray-900'
              : 'px-5 py-3 text-sm text-gray-500 hover:text-gray-700'
          }
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function ProblemContent() {
  return (
    <div className="overflow-auto p-6 text-sm text-gray-700">
      {/* Badges */}
      <div className="mb-4 flex gap-2">
        <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          코딩
        </span>
        <span className="rounded-md bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
          난이도: 중
        </span>
      </div>

      <h1 className="mb-5 text-lg font-bold text-gray-900">실습 1: 정렬 알고리즘 구현</h1>

      {/* Description */}
      <section className="mb-5">
        <h2 className="mb-2 font-semibold text-gray-900">문제 설명</h2>
        <p className="leading-relaxed">
          버블 정렬(Bubble Sort) 알고리즘을 구현하세요. 배열의 인접한 두 원소를 비교하여 정렬하는
          알고리즘으로, 시간 복잡도는 O(n²)입니다.
        </p>
      </section>

      {/* Input */}
      <section className="mb-5">
        <h2 className="mb-2 font-semibold text-gray-900">입력</h2>
        <ul className="list-disc pl-5 leading-relaxed">
          <li>정수로 이루어진 배열 <code className="rounded bg-gray-100 px-1 font-mono">arr</code></li>
          <li>배열의 길이: 1 ≤ len(arr) ≤ 1000</li>
          <li>원소 범위: -10000 ≤ arr[i] ≤ 10000</li>
        </ul>
      </section>

      {/* Output */}
      <section className="mb-5">
        <h2 className="mb-2 font-semibold text-gray-900">출력</h2>
        <p className="leading-relaxed">오름차순으로 정렬된 배열을 반환합니다.</p>
      </section>

      {/* Example */}
      <section className="mb-5">
        <h2 className="mb-2 font-semibold text-gray-900">예시</h2>
        <pre className="overflow-auto rounded-lg bg-gray-100 p-3 font-mono text-xs leading-relaxed text-gray-800">
          {`입력: arr = [64, 34, 25, 12, 22, 11, 90]
출력: [11, 12, 22, 25, 34, 64, 90]`}
        </pre>
      </section>

      {/* Hint */}
      <section className="rounded-lg bg-blue-50 p-4">
        <h2 className="mb-1.5 font-semibold text-blue-800">힌트</h2>
        <p className="leading-relaxed text-blue-700">
          이중 반복문을 사용하여 인접한 두 원소를 비교하고, 순서가 맞지 않으면 서로 교환(swap)하세요.
          내부 반복 범위를 줄여 이미 정렬된 끝 부분을 다시 비교하지 않도록 최적화할 수 있습니다.
        </p>
      </section>
    </div>
  );
}

function LeftPanel() {
  return (
    <div className="flex w-1/2 flex-col border-r border-gray-200 bg-white">
      <ProblemTabs />
      <ProblemContent />

      {/* AI Tutor CTA */}
      <div className="border-t border-gray-200 p-4">
        <button
          type="button"
          className="w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          AI 튜터에게 질문하기
        </button>
      </div>
    </div>
  );
}

function EditorHeader() {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm font-medium text-gray-800">solution.py</span>
        <select
          className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-600"
          aria-label="언어 선택"
          defaultValue="python"
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-200"
        >
          초기화
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          실행
        </button>
      </div>
    </div>
  );
}

function CodeEditor() {
  return (
    <div
      className="flex-1 overflow-auto bg-[#f8f9fa] p-4 font-mono text-sm"
      role="region"
      aria-label="코드 에디터"
    >
      {CODE_LINES.map((line) => (
        <div key={line.num} className="flex leading-6">
          <span
            className="mr-4 w-8 shrink-0 select-none text-right text-gray-400"
            aria-hidden="true"
          >
            {line.num}
          </span>
          <span>{line.tokens}</span>
        </div>
      ))}
    </div>
  );
}

function TestResultItem({ result }: { result: TestResult }) {
  const isPass = result.status === 'pass';
  return (
    <div
      className={`flex items-center justify-between rounded border px-3 py-2 text-xs ${
        isPass
          ? 'border-green-200 bg-green-50'
          : 'border-red-200 bg-red-50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={isPass ? 'text-green-600' : 'text-red-500'}>
          {isPass ? '✓' : '✗'}
        </span>
        <span className={`font-medium ${isPass ? 'text-green-700' : 'text-red-700'}`}>
          {result.label}
        </span>
        <span className={isPass ? 'text-green-600' : 'text-red-500'}>
          {isPass ? '통과' : '실패'}
        </span>
      </div>
      <span className={`font-mono ${isPass ? 'text-green-600' : 'text-red-500'}`}>
        {result.detail}
      </span>
    </div>
  );
}

function ResultPanel() {
  const passCount = MOCK_TEST_RESULTS.filter((r) => r.status === 'pass').length;
  return (
    <div className="flex h-48 flex-col border-t border-gray-200">
      {/* Result header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="text-xs font-medium text-gray-700">실행 결과</span>
        <span className="text-xs text-gray-500">
          {passCount}/{MOCK_TEST_RESULTS.length} 통과
        </span>
      </div>

      {/* Result list */}
      <div className="flex-1 overflow-auto p-3 space-y-1.5">
        {MOCK_TEST_RESULTS.map((result) => (
          <TestResultItem key={result.label} result={result} />
        ))}
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <div className="flex w-1/2 flex-col bg-white">
      <EditorHeader />
      <CodeEditor />
      <ResultPanel />

      {/* Submit button */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <button
          type="button"
          className="w-full rounded-lg bg-gray-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          제출하기
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function SplitViewIdePage() {
  return (
    <div className="flex h-screen flex-col bg-white">
      <IdeHeader />
      <main className="flex h-[calc(100vh-52px)]">
        <LeftPanel />
        <RightPanel />
      </main>
    </div>
  );
}
