'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const MonacoEditor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      에디터 로딩 중...
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  javascript: 'javascript',
  typescript: 'typescript',
};

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'javascript', label: 'JavaScript' },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SplitViewIdePageProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    language: string;
  };
  studentName: string;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function SplitViewIdePage({ assignment, studentName }: SplitViewIdePageProps) {
  const [code, setCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`ide-code-${assignment.id}`) ?? '# 여기에 코드를 작성하세요\n';
    }
    return '# 여기에 코드를 작성하세요\n';
  });
  const [language, setLanguage] = useState(assignment.language);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [runOutput, setRunOutput] = useState('');

  function handleSave() {
    localStorage.setItem(`ide-code-${assignment.id}`, code);
    setMessage('저장되었습니다.');
    setTimeout(() => setMessage(''), 2000);
  }

  async function handleSubmit() {
    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/v1/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId: assignment.id, answer: code }),
      });
      const json = await res.json();
      if (json.ok) {
        setSubmitStatus('success');
        setMessage('제출 완료!');
      } else {
        setSubmitStatus('error');
        setMessage(json.message ?? '제출 실패');
      }
    } catch {
      setSubmitStatus('error');
      setMessage('네트워크 오류');
    }
    setTimeout(() => {
      setSubmitStatus('idle');
      setMessage('');
    }, 3000);
  }

  async function handleRun() {
    setRunStatus('running');
    setRunOutput('');

    try {
      const res = await fetch('/api/v1/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId: assignment.id, code, language }),
      });
      const json = await res.json();

      if (!json.ok) {
        setRunStatus('error');
        setRunOutput(json.message ?? '실행 실패');
        return;
      }

      setRunStatus('success');
      setRunOutput(`${json.data.summary} · ${json.data.score}점`);
    } catch {
      setRunStatus('error');
      setRunOutput('네트워크 오류');
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex shrink-0 items-center gap-2">
            <div className="h-6 w-6 rounded bg-gray-800" aria-hidden="true" />
            <span className="text-sm font-bold text-gray-900">EduRyday</span>
          </div>
          <span className="text-gray-300" aria-hidden="true">›</span>
          <nav aria-label="경로" className="flex min-w-0 items-center gap-1 text-sm text-gray-500">
            <span className="truncate font-medium text-gray-800">{assignment.title}</span>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            저장
          </button>
          <div className="flex items-center gap-1.5 rounded-lg px-2 py-1">
            <div className="h-6 w-6 rounded-full bg-gray-300" aria-hidden="true" />
            <span className="text-xs font-medium text-gray-700">{studentName}</span>
          </div>
        </div>
      </header>

      {/* Main split view */}
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left panel: problem description */}
        <div className="flex w-full flex-col border-b border-gray-200 bg-white md:w-1/2 md:border-b-0 md:border-r overflow-hidden">
          {/* Back navigation */}
          <div className="shrink-0 border-b border-gray-100 px-4 py-2">
            <Link
              href="/student/assignments"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              &#8592; 과제 목록
            </Link>
          </div>

          {/* Problem tabs */}
          <div className="flex border-b border-gray-200 shrink-0" role="tablist">
            {(['문제', '강의 영상', '참고 자료'] as const).map((tab, i) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={i === 0}
                disabled={i !== 0}
                className={
                  i === 0
                    ? 'border-b-2 border-gray-800 px-5 py-3 text-sm font-medium text-gray-900'
                    : 'cursor-not-allowed px-5 py-3 text-sm text-gray-500 opacity-50'
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Problem content */}
          <div className="flex-1 overflow-auto p-6 text-sm text-gray-700">
            <div className="mb-4 flex gap-2">
              <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                코딩
              </span>
            </div>

            <h1 className="mb-5 text-lg font-bold text-gray-900">{assignment.title}</h1>

            {assignment.description ? (
              <section className="mb-5">
                <h2 className="mb-2 font-semibold text-gray-900">문제 설명</h2>
                <p className="leading-relaxed whitespace-pre-wrap">{assignment.description}</p>
              </section>
            ) : null}
          </div>

          {/* AI Tutor CTA */}
          <div className="border-t border-gray-200 p-4 shrink-0">
            <Link
              href="/student/ai-tutor"
              className="block w-full rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              AI 튜터에게 질문
            </Link>
          </div>
        </div>

        {/* Right panel: code editor */}
        <div className="flex w-full flex-col bg-white md:w-1/2 overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 shrink-0">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-600"
                aria-label="언어 선택"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="rounded px-3 py-1.5 text-xs text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                저장
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={runStatus === 'running'}
                className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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
                {runStatus === 'running' ? '실행 중...' : '실행'}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitStatus === 'submitting'}
                className={`rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors ${
                  submitStatus === 'submitting'
                    ? 'cursor-not-allowed bg-gray-400'
                    : submitStatus === 'success'
                      ? 'bg-green-600'
                      : submitStatus === 'error'
                        ? 'bg-red-600'
                        : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {submitStatus === 'submitting' ? '제출 중...' : '제출하기'}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={LANGUAGE_MAP[language] ?? 'python'}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              theme="vs"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Status bar */}
          {(message || runOutput) && (
            <div
              className={`shrink-0 border-t px-4 py-2 text-xs flex items-center justify-between gap-3 ${
                submitStatus === 'error' || runStatus === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-green-200 bg-green-50 text-green-700'
              }`}
            >
              <span>{message || runOutput}</span>
              {submitStatus === 'success' && (
                <Link
                  href="/student/assignments"
                  className="shrink-0 font-medium underline hover:no-underline"
                >
                  과제 목록으로 돌아가기
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
