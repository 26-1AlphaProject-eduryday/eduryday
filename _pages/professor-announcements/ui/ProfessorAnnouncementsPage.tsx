'use client';

import { useState } from 'react';
import { ProfessorHeader } from '@/widgets/header';
import { ProfessorSidebar } from '@/widgets/sidebar';
import { Badge } from '@/shared/ui';
import type { ProfessorCourse } from '@/entities/course';
import type { ProfessorAnnouncementRecord } from '@/shared/lib/supabase/ui-seed';

interface ProfessorAnnouncementsPageProps {
  courses: ProfessorCourse[];
  announcements: ProfessorAnnouncementRecord[];
}

export function ProfessorAnnouncementsPage({
  courses,
  announcements,
}: ProfessorAnnouncementsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCourse, setFormCourse] = useState(courses[0]?.id ?? '');
  const [formContent, setFormContent] = useState('');
  const [formPinned, setFormPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would call an API
    setShowForm(false);
    setFormTitle('');
    setFormContent('');
    setFormPinned(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ProfessorHeader />

      <div className="flex flex-1">
        <ProfessorSidebar activeItem="공지사항" />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-700">공지사항 관리</h1>
              <p className="mt-1 text-sm text-gray-500">
                강좌별 공지사항을 작성하고 관리하세요
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {showForm ? '닫기' : '공지 작성'}
            </button>
          </div>

          {/* Write form */}
          {showForm && (
            <section
              aria-label="공지사항 작성 폼"
              className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-4 text-base font-semibold text-gray-700">새 공지사항 작성</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Course select */}
                <div>
                  <label
                    htmlFor="announce-course"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    강좌 선택
                  </label>
                  <select
                    id="announce-course"
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    required
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label
                    htmlFor="announce-title"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    제목
                  </label>
                  <input
                    id="announce-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="공지사항 제목을 입력하세요"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-500 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    required
                  />
                </div>

                {/* Content textarea */}
                <div>
                  <label
                    htmlFor="announce-content"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    내용
                  </label>
                  <textarea
                    id="announce-content"
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="공지사항 내용을 입력하세요"
                    rows={5}
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-500 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    required
                  />
                </div>

                {/* Pin option */}
                <div className="flex items-center gap-2">
                  <input
                    id="announce-pinned"
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-400"
                  />
                  <label
                    htmlFor="announce-pinned"
                    className="text-sm text-gray-700"
                  >
                    상단 고정
                  </label>
                </div>

                {/* Form actions */}
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    게시하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  >
                    취소
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Summary */}
          <div className="mb-4 flex items-center gap-4">
            <p className="text-sm text-gray-600">
              전체{' '}
              <strong className="font-semibold text-gray-800">
                 {announcements.length}개
              </strong>{' '}
              공지사항
            </p>
            <span className="text-gray-300">|</span>
            <p className="text-sm text-gray-500">
              고정{' '}
              <strong className="font-semibold text-gray-700">
                 {announcements.filter((a) => a.pinned).length}개
              </strong>
            </p>
          </div>

          {/* Announcements table */}
          <section aria-label="공지사항 목록">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      제목
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      강좌
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      작성일
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      조회수
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      고정
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">액션</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {announcements.map((announcement) => (
                    <tr
                      key={announcement.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {announcement.pinned && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5 flex-shrink-0 text-red-400"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-label="고정됨"
                            >
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                          )}
                          <span className="font-medium text-gray-800">
                            {announcement.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {announcement.course}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {announcement.createdAt}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">
                        {announcement.views}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {announcement.pinned ? (
                          <Badge variant="red">고정</Badge>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            수정
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
