'use client';

import { useEffect, useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';

interface CourseItem {
  id: string;
  title: string;
}

interface RubricCriterion {
  id: string;
  description: string;
  weight: number;
}

export function CreateAssignmentPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState<'coding' | 'essay' | 'multiple-choice' | 'file'>('coding');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [rubric, setRubric] = useState<RubricCriterion[]>([
    { id: '1', description: '', weight: 30 },
  ]);

  useEffect(() => {
    async function loadCourses() {
      const res = await fetch('/api/v1/courses?page=1&pageSize=50', { cache: 'no-store' });
      const json = await res.json();

      if (json.ok) {
        const items = (json.data.courses ?? []) as { id: string; title?: string; name?: string }[];
        const mapped = items.map((item) => ({ id: item.id, title: item.title ?? item.name ?? '-' }));
        setCourses(mapped);
        setCourseId(mapped[0]?.id ?? '');
      }
    }

    loadCourses();
  }, []);

  async function saveAssignment(status: 'draft' | 'active') {
    if (title.trim() === '') {
      setMessage('제목을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    const res = await fetch('/api/v1/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        type,
        courseId,
        status,
        rubric: rubric.filter(r => r.description.trim()).map(r => ({
          description: r.description.trim(),
          weight: r.weight,
        })),
      }),
    });

    const json = await res.json();
    setSubmitting(false);

    if (json.ok) {
      setMessage(status === 'draft' ? '임시저장 완료' : '과제 게시 완료');
      if (status === 'active') {
        setTitle('');
        setDescription('');
        setDeadline('');
      }
    } else {
      setMessage(json.message ?? '저장에 실패했습니다.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessorHeader />

      <div className="border-b border-gray-200 bg-white px-8 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <nav aria-label="경로" className="text-sm text-gray-500">
            <span>EduRyday</span>
            <span className="mx-1.5 text-gray-300" aria-hidden="true">›</span>
            <span>강좌</span>
            <span className="mx-1.5 text-gray-300" aria-hidden="true">›</span>
            <span className="font-medium text-gray-700">과제 생성</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => saveAssignment('draft')}
              disabled={submitting}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-70"
            >
              임시저장
            </button>
            <button
              type="button"
              onClick={() => saveAssignment('active')}
              disabled={submitting}
              className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
            >
              과제게시
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <h1 className="text-xl font-bold text-gray-900">과제 정보 작성</h1>
          <p className="mt-1.5 text-sm text-gray-500">강좌와 제출 마감 정보를 입력하고 과제를 생성하세요.</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="course-id" className="mb-1 block text-sm font-medium text-gray-700">강좌</label>
              <select
                id="course-id"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="assignment-type" className="mb-1 block text-sm font-medium text-gray-700">유형</label>
              <select
                id="assignment-type"
                value={type}
                onChange={(e) => setType(e.target.value as 'coding' | 'essay' | 'multiple-choice' | 'file')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="coding">코딩</option>
                <option value="essay">주관식</option>
                <option value="multiple-choice">객관식</option>
                <option value="file">파일</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="assignment-title" className="mb-1 block text-sm font-medium text-gray-700">제목</label>
            <input
              id="assignment-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="예: 실습 4: 탐색 알고리즘"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="assignment-deadline" className="mb-1 block text-sm font-medium text-gray-700">마감일</label>
            <input
              id="assignment-deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="assignment-description" className="mb-1 block text-sm font-medium text-gray-700">설명</label>
            <textarea
              id="assignment-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="과제 설명과 요구사항을 입력하세요."
            />
          </div>

          {/* Rubric section */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">채점 기준 (루브릭)</h2>
                <p className="mt-0.5 text-xs text-gray-500">각 기준의 설명과 가중치를 입력하세요.</p>
              </div>
              <span className={`text-sm font-medium ${rubric.reduce((sum, r) => sum + r.weight, 0) === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                총 가중치: {rubric.reduce((sum, r) => sum + r.weight, 0)}%
                {rubric.reduce((sum, r) => sum + r.weight, 0) !== 100 && ' (100%가 되어야 합니다)'}
              </span>
            </div>

            <div className="space-y-3">
              {rubric.map((criterion, index) => (
                <div key={criterion.id} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex-1">
                    <label htmlFor={`rubric-desc-${criterion.id}`} className="mb-1 block text-xs font-medium text-gray-600">
                      기준 {index + 1}
                    </label>
                    <textarea
                      id={`rubric-desc-${criterion.id}`}
                      value={criterion.description}
                      onChange={(e) => {
                        const updated = rubric.map(r => r.id === criterion.id ? { ...r, description: e.target.value } : r);
                        setRubric(updated);
                      }}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="채점 기준 설명을 입력하세요."
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1 pt-5">
                    <label htmlFor={`rubric-weight-${criterion.id}`} className="text-xs font-medium text-gray-600">가중치</label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`rubric-weight-${criterion.id}`}
                        type="number"
                        min={0}
                        max={100}
                        value={criterion.weight}
                        onChange={(e) => {
                          const updated = rubric.map(r => r.id === criterion.id ? { ...r, weight: Number(e.target.value) } : r);
                          setRubric(updated);
                        }}
                        className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-center"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRubric(rubric.filter(r => r.id !== criterion.id))}
                    disabled={rubric.length <= 1}
                    className="mt-5 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`기준 ${index + 1} 삭제`}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setRubric([...rubric, { id: String(Date.now()), description: '', weight: 0 }])}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
            >
              + 채점 기준 추가
            </button>
          </div>

          {message ? (
            <p className={`mt-4 text-sm ${message.includes('실패') || message.includes('오류') || message.includes('입력') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
