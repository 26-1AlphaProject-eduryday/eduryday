'use client';

import { useEffect, useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';

interface CourseItem {
  id: string;
  title: string;
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

          <div className="mt-6 grid grid-cols-2 gap-4">
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

          {message ? <p className="mt-4 text-sm text-gray-700">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
