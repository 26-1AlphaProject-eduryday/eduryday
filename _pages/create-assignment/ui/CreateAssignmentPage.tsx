import { ProfessorHeader } from '@/widgets/header';
import { getRubricCriteria } from '@/shared/lib/supabase/ui-seed';

const STEPS = [
  { number: 1, label: '기본정보', state: 'done' },
  { number: 2, label: '문제작성', state: 'done' },
  { number: 3, label: '채점기준', state: 'active' },
  { number: 4, label: '미리보기', state: 'future' },
] as const;

type StepState = (typeof STEPS)[number]['state'];

function StepIndicator() {
  return (
    <nav aria-label="과제 생성 단계" className="mb-8 flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        const isDone = step.state === 'done';
        const isActive = step.state === 'active';

        const circleClass = isDone
          ? 'h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold'
          : isActive
          ? 'h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold'
          : 'h-8 w-8 rounded-full border-2 border-gray-300 text-gray-500 flex items-center justify-center text-sm font-semibold';

        const labelClass =
          isActive
            ? 'mt-1.5 text-xs font-semibold text-gray-800'
            : isDone
            ? 'mt-1.5 text-xs font-medium text-gray-600'
            : 'mt-1.5 text-xs font-medium text-gray-500';

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={circleClass}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={labelClass}>{step.label}</span>
            </div>

            {!isLast && (
              <ConnectorLine leftState={step.state} rightState={STEPS[index + 1].state} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function ConnectorLine({
  leftState,
  rightState,
}: {
  leftState: StepState;
  rightState: StepState;
}) {
  const filled = leftState === 'done' && (rightState === 'done' || rightState === 'active');
  return (
    <div
      className={`mx-2 mb-5 h-0.5 w-16 ${filled ? 'bg-gray-800' : 'bg-gray-300'}`}
      aria-hidden="true"
    />
  );
}

export async function CreateAssignmentPage() {
  const rubricCriteria = await getRubricCriteria();
  const totalWeight = rubricCriteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumb */}
      <ProfessorHeader />

      <div className="border-b border-gray-200 bg-white px-8 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <nav aria-label="경로" className="text-sm text-gray-500">
            <span>EduRyday</span>
            <span className="mx-1.5 text-gray-300" aria-hidden="true">›</span>
            <span>알고리즘 기초</span>
            <span className="mx-1.5 text-gray-300" aria-hidden="true">›</span>
            <span className="font-medium text-gray-700">과제 생성</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              임시저장
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              과제게시
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-8">
        {/* Progress steps */}
        <StepIndicator />

        {/* Main card */}
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          {/* Section title */}
          <h1 className="text-xl font-bold text-gray-900">채점 기준 설정</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            자연어로 채점 기준을 입력하면 AI가 자동으로 채점 로직을 생성합니다.
          </p>

          {/* Assignment summary */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <dl className="flex flex-wrap gap-6 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-gray-600">과제유형</dt>
                <dd className="text-gray-800">코딩문제</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-gray-600">마감일</dt>
                <dd className="text-gray-800">2026.01.23</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-gray-600">배점</dt>
                <dd className="text-gray-800">100점</dd>
              </div>
            </dl>
          </div>

          {/* No-Code Rubric criteria */}
          <div className="mt-8 space-y-4" aria-label="채점 기준 목록">
            {rubricCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className="rounded-lg border border-gray-200 p-4"
                aria-label={`채점 기준 ${criterion.id}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                    기준 {criterion.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`weight-${criterion.id}`}
                      className="text-sm text-gray-500"
                    >
                      가중치
                    </label>
                    <input
                      id={`weight-${criterion.id}`}
                      type="text"
                      defaultValue={`${criterion.weight}%`}
                      readOnly
                      className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-center text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      aria-label={`기준 ${criterion.id} 가중치`}
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  defaultValue={criterion.description}
                  readOnly
                  className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label={`기준 ${criterion.id} 설명`}
                />

                {/* AI conversion result */}
                <div className="mt-3 rounded-md border border-purple-200 bg-purple-50 px-4 py-3">
                  <p className="mb-1 text-xs font-semibold text-purple-700">
                    AI 변환 결과:
                  </p>
                  <code className="text-xs text-purple-800">{criterion.aiResult}</code>
                </div>
              </div>
            ))}

            {/* Add criterion button */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <span aria-hidden="true">+</span>
              채점 기준 추가
            </button>
          </div>

          {/* Total weight summary */}
          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">총 가중치</span>
               <span className="font-bold text-gray-900">{totalWeight}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
              role="progressbar"
               aria-valuenow={totalWeight}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="총 가중치"
            >
              <div
                className="h-full rounded-full bg-gray-800 transition-all duration-300"
                 style={{ width: `${totalWeight}%` }}
               />
             </div>
           </div>

          {/* Bottom navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <span aria-hidden="true">&larr;</span>
              이전
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              다음: 미리보기
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
