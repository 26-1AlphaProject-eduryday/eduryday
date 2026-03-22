'use client';

import { useEffect, useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';

interface ProfessorCourseManagePageProps {
  courseId: string;
}

interface CourseDetail {
  id: string;
  title: string;
  semester: string;
  section: string | null;
  status: 'active' | 'closed' | 'draft' | 'pending';
  student_count: number;
  current_week: number;
  total_weeks: number;
}

interface CourseWeek {
  id: string;
  number: number;
  title: string;
  status: 'locked' | 'in-progress' | 'done';
}

interface Lesson {
  id: string;
  weekId: string;
  title: string;
  type: 'video' | 'practice' | 'quiz' | 'document';
  orderNum: number;
}

export function ProfessorCourseManagePage({ courseId }: ProfessorCourseManagePageProps) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [weeks, setWeeks] = useState<CourseWeek[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [weeksLoading, setWeeksLoading] = useState(false);
  const [newWeekTitle, setNewWeekTitle] = useState('');
  const [addingLessonWeekId, setAddingLessonWeekId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<Lesson['type']>('video');

  async function loadCourse() {
    setLoading(true);
    const res = await fetch(`/api/v1/courses/${courseId}`, { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      setCourse(json.data as CourseDetail);
    }

    setLoading(false);
  }

  async function loadWeeksAndLessons() {
    setWeeksLoading(true);
    const weeksRes = await fetch(`/api/v1/course-weeks?courseId=${courseId}`, { cache: 'no-store' });
    const weeksJson = await weeksRes.json();

    if (!weeksJson.ok) {
      setWeeksLoading(false);
      return;
    }

    const fetchedWeeks: CourseWeek[] = weeksJson.data ?? [];
    setWeeks(fetchedWeeks);

    const allLessons: Lesson[] = [];
    await Promise.all(
      fetchedWeeks.map(async (week) => {
        const lessonsRes = await fetch(`/api/v1/lessons?weekId=${week.id}`, { cache: 'no-store' });
        const lessonsJson = await lessonsRes.json();
        if (lessonsJson.ok && Array.isArray(lessonsJson.data)) {
          allLessons.push(...(lessonsJson.data as Lesson[]));
        }
      })
    );

    setLessons(allLessons);
    setWeeksLoading(false);
  }

  useEffect(() => {
    loadCourse();
    loadWeeksAndLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function saveChanges() {
    if (!course) {
      return;
    }

    const res = await fetch(`/api/v1/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: course.title,
        semester: course.semester,
        section: course.section,
        status: course.status,
        studentCount: course.student_count,
        currentWeek: course.current_week,
        totalWeeks: course.total_weeks,
      }),
    });
    const json = await res.json();

    if (json.ok) {
      setMessage('저장되었습니다.');
      setMessageType('success');
    } else {
      setMessage('저장에 실패했습니다.');
      setMessageType('error');
    }
  }

  async function handleAddWeek() {
    if (!newWeekTitle.trim()) return;

    const res = await fetch('/api/v1/course-weeks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        number: weeks.length + 1,
        title: newWeekTitle.trim(),
      }),
    });
    const json = await res.json();

    if (json.ok) {
      setNewWeekTitle('');
      await loadWeeksAndLessons();
    }
  }

  async function handleAddLesson(weekId: string) {
    if (!newLessonTitle.trim()) return;

    const weekLessons = lessons.filter((l) => l.weekId === weekId);
    const res = await fetch('/api/v1/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weekId,
        title: newLessonTitle.trim(),
        type: newLessonType,
        orderNum: weekLessons.length + 1,
      }),
    });
    const json = await res.json();

    if (json.ok) {
      setNewLessonTitle('');
      setNewLessonType('video');
      setAddingLessonWeekId(null);
      await loadWeeksAndLessons();
    }
  }

  async function handleUpdateWeekStatus(weekId: string, status: CourseWeek['status']) {
    const res = await fetch(`/api/v1/course-weeks/${weekId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();

    if (json.ok) {
      setWeeks((prev) => prev.map((w) => (w.id === weekId ? { ...w, status } : w)));
    }
  }

  const statusLabel: Record<CourseWeek['status'], string> = {
    locked: '잠김',
    'in-progress': '진행 중',
    done: '완료',
  };

  const statusBadgeClass: Record<CourseWeek['status'], string> = {
    locked: 'bg-gray-100 text-gray-600',
    'in-progress': 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  };

  const typeLabel: Record<Lesson['type'], string> = {
    video: '영상',
    practice: '실습',
    quiz: '퀴즈',
    document: '문서',
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />
      <div className="flex flex-1">
        <ProfessorSidebar />
        <main className="flex-1 p-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">강좌 관리</h1>
          <p className="mb-6 text-sm text-gray-500">강좌 정보와 운영 상태를 수정합니다.</p>

          {loading || !course ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">강좌 정보를 불러오는 중...</div>
          ) : (
            <div className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6">
              <div>
                <label htmlFor="course-title" className="mb-1 block text-sm font-medium text-gray-700">강좌명</label>
                <input
                  id="course-title"
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="course-semester" className="mb-1 block text-sm font-medium text-gray-700">학기</label>
                  <input
                    id="course-semester"
                    value={course.semester}
                    onChange={(e) => setCourse({ ...course, semester: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="course-status" className="mb-1 block text-sm font-medium text-gray-700">상태</label>
                  <select
                    id="course-status"
                    value={course.status}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        status: e.target.value as CourseDetail['status'],
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="active">진행중</option>
                    <option value="closed">종료</option>
                    <option value="draft">초안</option>
                    <option value="pending">대기</option>
                  </select>
                </div>
              </div>
              <button type="button" onClick={saveChanges} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
                변경 저장
              </button>
              {message ? (
                <p className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
              ) : null}
            </div>
          )}

          {/* Week & Lesson Management */}
          <div className="mt-8 max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">주차 및 강의 관리</h2>

            {/* Add week input */}
            <div className="mb-6 flex gap-2">
              <input
                value={newWeekTitle}
                onChange={(e) => setNewWeekTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddWeek(); }}
                placeholder="새 주차 제목 입력"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddWeek}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white whitespace-nowrap"
              >
                + 새 주차 추가
              </button>
            </div>

            {weeksLoading ? (
              <p className="text-sm text-gray-400">주차 정보를 불러오는 중...</p>
            ) : weeks.length === 0 ? (
              <p className="text-sm text-gray-400">등록된 주차가 없습니다.</p>
            ) : (
              <ul className="space-y-4">
                {weeks
                  .slice()
                  .sort((a, b) => a.number - b.number)
                  .map((week) => {
                    const weekLessons = lessons
                      .filter((l) => l.weekId === week.id)
                      .sort((a, b) => a.orderNum - b.orderNum);
                    const isAddingLesson = addingLessonWeekId === week.id;

                    return (
                      <li key={week.id} className="rounded-lg border border-gray-200 p-4">
                        {/* Week header */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900 text-sm">
                            {week.number}주차: {week.title}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass[week.status]}`}>
                            {statusLabel[week.status]}
                          </span>
                          <div className="ml-auto flex items-center gap-2">
                            <select
                              value={week.status}
                              onChange={(e) => handleUpdateWeekStatus(week.id, e.target.value as CourseWeek['status'])}
                              className="rounded border border-gray-300 px-2 py-1 text-xs"
                            >
                              <option value="locked">잠김</option>
                              <option value="in-progress">진행 중</option>
                              <option value="done">완료</option>
                            </select>
                          </div>
                        </div>

                        {/* Lessons list */}
                        {weekLessons.length > 0 && (
                          <ul className="mt-3 space-y-1 border-l-2 border-gray-200 pl-4">
                            {weekLessons.map((lesson, idx) => (
                              <li key={lesson.id} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="text-gray-400">강의 {idx + 1}:</span>
                                <span>{lesson.title}</span>
                                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                                  {typeLabel[lesson.type]}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Add lesson form */}
                        {isAddingLesson ? (
                          <div className="mt-3 flex gap-2 border-l-2 border-gray-200 pl-4 flex-wrap">
                            <input
                              value={newLessonTitle}
                              onChange={(e) => setNewLessonTitle(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleAddLesson(week.id); }}
                              placeholder="강의 제목"
                              className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                            />
                            <select
                              value={newLessonType}
                              onChange={(e) => setNewLessonType(e.target.value as Lesson['type'])}
                              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                            >
                              <option value="video">영상</option>
                              <option value="practice">실습</option>
                              <option value="quiz">퀴즈</option>
                              <option value="document">문서</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleAddLesson(week.id)}
                              className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
                            >
                              추가
                            </button>
                            <button
                              type="button"
                              onClick={() => { setAddingLessonWeekId(null); setNewLessonTitle(''); setNewLessonType('video'); }}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setAddingLessonWeekId(week.id); setNewLessonTitle(''); setNewLessonType('video'); }}
                            className="mt-3 border-l-2 border-gray-200 pl-4 text-sm text-blue-600 hover:text-blue-700"
                          >
                            + 강의 추가
                          </button>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
