import Link from 'next/link';
import { StudentHeader } from '@/widgets/header';
import { ProgressBar, Badge, Button } from '@/shared/ui';
import type { WeekStatus } from '@/entities/course';
import { MOCK_STUDENT_COURSES, MOCK_COURSE_WEEKS, MOCK_COURSE_RESOURCES } from '@/entities/course';

const CURRENT_COURSE = MOCK_STUDENT_COURSES[0];

const statusLabel: Record<WeekStatus, string> = {
  done: '완료',
  'in-progress': '진행 중',
  locked: '미완료',
};

const statusClass: Record<WeekStatus, string> = {
  done: 'text-green-500',
  'in-progress': 'text-gray-600',
  locked: 'text-gray-500',
};

export function CourseDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <StudentHeader />

      <div className="flex flex-1">
        {/* Course sidebar */}
        <aside
          className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col"
          aria-label="강좌 네비게이션"
        >
          {/* Course info */}
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-bold text-gray-800 text-base">{CURRENT_COURSE.title}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{CURRENT_COURSE.professor}</p>
            <ProgressBar value={CURRENT_COURSE.progress} color="blue" className="mt-3" />
            <p className="mt-1 text-xs text-gray-500">진행률 {CURRENT_COURSE.progress}%</p>
          </div>

          {/* Week navigation */}
          <nav className="flex-1 overflow-y-auto p-3" aria-label="주차 목록">
            <ul className="space-y-1">
              {MOCK_COURSE_WEEKS.map((week) => (
                <li key={week.id}>
                  {/* Week header */}
                  <div
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                      week.status === 'in-progress'
                        ? 'border-2 border-gray-400 bg-gray-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {week.number}주차: {week.title}
                    </span>
                    <span className={`text-xs font-medium ${statusClass[week.status]}`}>
                      {statusLabel[week.status]}
                    </span>
                  </div>

                  {/* Expanded lessons for in-progress week */}
                  {week.lessons && (
                    <ul className="mt-1 ml-3 space-y-0.5" aria-label={`${week.number}주차 강의 목록`}>
                      {week.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <div
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              lesson.active
                                ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            aria-current={lesson.active ? 'page' : undefined}
                          >
                            {lesson.completed ? (
                              <span
                                className="text-green-500 shrink-0"
                                aria-label="시청완료"
                              >
                                &#10003;
                              </span>
                            ) : (
                              <span
                                className="inline-block h-3.5 w-3.5 shrink-0 rounded-sm border border-gray-300"
                                aria-label="미완료"
                              />
                            )}
                            <span>{lesson.title}</span>
                            {lesson.completed && (
                              <span className="ml-auto text-xs text-gray-500">시청완료</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {/* Breadcrumb */}
          <nav aria-label="경로" className="mb-4">
            <ol className="flex items-center gap-1.5 text-sm text-gray-500">
              <li>
                <Link href="/student/courses" className="hover:text-gray-700 transition-colors">
                  알고리즘 기초
                </Link>
              </li>
              <li aria-hidden="true">&rsaquo;</li>
              <li>3주차</li>
              <li aria-hidden="true">&rsaquo;</li>
              <li className="text-gray-700 font-medium">실습 1: 정렬 구현</li>
            </ol>
          </nav>

          {/* Page title */}
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            실습 1: 정렬 알고리즘 구현
          </h1>

          {/* Content card */}
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
            {/* Badges row */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge variant="blue" size="md">코딩 실습</Badge>
              <Badge variant="default" size="md">난이도: 중</Badge>
              <span className="text-sm text-gray-500">
                마감&nbsp;
                <time dateTime="2026-01-23T23:59">2026.01.23 23:59</time>
              </span>
            </div>

            {/* Problem description */}
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <div>
                <h3 className="mb-1 font-semibold text-gray-800">문제 설명</h3>
                <p>
                  버블 정렬과 선택 정렬 알고리즘을 직접 구현하고, 두 알고리즘의 시간
                  복잡도를 비교 분석하세요. 각 알고리즘의 특성을 이해하고 적절한 상황에
                  적용할 수 있도록 합니다.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-semibold text-gray-800">입력</h3>
                <p>
                  정수 배열 <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">arr</code>
                  (1 &le; len(arr) &le; 1000, &minus;10000 &le; arr[i] &le; 10000)
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-semibold text-gray-800">출력</h3>
                <p>오름차순으로 정렬된 배열을 반환하세요.</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex items-center gap-3">
              <Link href="/student/ide/1">
                <Button variant="primary" size="md">
                  실습 시작하기 &rarr;
                </Button>
              </Link>
              <Link href="/student/ai-tutor">
                <Button variant="secondary" size="md">
                  AI 튜터에게 질문
                </Button>
              </Link>
            </div>
          </div>

          {/* Related resources card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-800">관련 자료</h2>
            <ul className="space-y-2">
              {MOCK_COURSE_RESOURCES.map((res) => (
                <li
                  key={res.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    {res.isPdf ? (
                      <span
                        className="text-xs font-medium text-red-500 border border-red-300 rounded px-1 py-0.5"
                        aria-label="PDF"
                      >
                        PDF
                      </span>
                    ) : (
                      <span
                        className="text-green-500 font-medium"
                        aria-hidden="true"
                      >
                        &#9654;
                      </span>
                    )}
                    <span className="text-sm text-gray-700">{res.title}</span>
                  </div>

                  {res.completed ? (
                    <span className="text-xs text-green-600 font-medium">시청완료</span>
                  ) : (
                    <Link
                      href="#"
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      다운로드
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
