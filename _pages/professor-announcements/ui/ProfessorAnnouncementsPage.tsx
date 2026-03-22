'use client';

import { useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';
import type { ProfessorCourse } from '@/entities/course';

interface ProfessorAnnouncementRecord {
  id: string;
  title: string;
  content: string;
  courseId: string;
  course: string;
  createdAt: string;
  views: number;
  pinned: boolean;
}

interface ProfessorAnnouncementsPageProps {
  courses: ProfessorCourse[];
  announcements: ProfessorAnnouncementRecord[];
}

export function ProfessorAnnouncementsPage({ courses, announcements }: ProfessorAnnouncementsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCourse, setFormCourse] = useState(courses[0]?.id ?? '');
  const [formContent, setFormContent] = useState('');
  const [formPinned, setFormPinned] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [items, setItems] = useState(announcements);

  async function refreshAnnouncements() {
    const res = await fetch('/api/v1/announcements', { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      setItems(json.data.announcements);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: formTitle,
      content: formContent,
      pinned: formPinned,
      courseId: formCourse,
    };

    const url = editingId ? `/api/v1/announcements/${editingId}` : '/api/v1/announcements';
    const method = editingId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (json.ok) {
      setShowForm(false);
      setFormTitle('');
      setFormContent('');
      setFormPinned(false);
      setEditingId(null);
      await refreshAnnouncements();
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/v1/announcements/${id}`, { method: 'DELETE' });
    const json = await res.json();

    if (json.ok) {
      await refreshAnnouncements();
    }
  }

  function handleEdit(item: ProfessorAnnouncementRecord) {
    setEditingId(item.id);
    setShowForm(true);
    setFormTitle(item.title);
    setFormPinned(item.pinned);
    setFormCourse(item.courseId || courses[0]?.id || '');
    setFormContent(item.content);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
              <p className="mt-1 text-sm text-gray-500">강좌별 공지사항을 작성하고 관리하세요</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm((prev) => !prev);
                setEditingId(null);
              }}
              className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              {showForm ? '닫기' : '공지 작성'}
            </button>
          </div>

          {showForm ? (
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-700">{editingId ? '공지 수정' : '새 공지사항 작성'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="announce-course" className="mb-1 block text-sm font-medium text-gray-700">강좌 선택</label>
                  <select
                    id="announce-course"
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                    required
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="announce-title" className="mb-1 block text-sm font-medium text-gray-700">제목</label>
                  <input
                    id="announce-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="announce-content" className="mb-1 block text-sm font-medium text-gray-700">내용</label>
                  <textarea
                    id="announce-content"
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    rows={5}
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="announce-pinned"
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-800"
                  />
                  <label htmlFor="announce-pinned" className="text-sm text-gray-700">상단 고정</label>
                </div>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <button type="submit" className="rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700">
                    {editingId ? '수정 저장' : '게시하기'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">취소</button>
                </div>
              </form>
            </section>
          ) : null}

          <div className="mb-4 flex items-center gap-4">
            <p className="text-sm text-gray-600">전체 <strong className="font-semibold text-gray-800">{items.length}개</strong> 공지사항</p>
            <span className="text-gray-300">|</span>
            <p className="text-sm text-gray-500">고정 <strong className="font-semibold text-gray-700">{items.filter((a) => a.pinned).length}개</strong></p>
          </div>

          <section aria-label="공지사항 목록">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">제목</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">강좌</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">작성일</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">조회수</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">고정</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                        공지사항이 없습니다.
                      </td>
                    </tr>
                  ) : (
                  items.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {announcement.pinned ? <span className="text-red-400">📌</span> : null}
                          <span className="font-medium text-gray-800">{announcement.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{announcement.course}</td>
                      <td className="px-4 py-4 text-gray-500">{announcement.createdAt}</td>
                      <td className="px-4 py-4 text-center text-gray-600">{announcement.views}</td>
                      <td className="px-4 py-4 text-center">{announcement.pinned ? <Badge variant="red">고정</Badge> : <span className="text-xs text-gray-300">-</span>}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-800" onClick={() => handleEdit(announcement)}>수정</button>
                          <span className="text-gray-300">|</span>
                          <button type="button" className="text-xs font-medium text-red-500 hover:text-red-700" onClick={() => handleDelete(announcement.id)}>삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
