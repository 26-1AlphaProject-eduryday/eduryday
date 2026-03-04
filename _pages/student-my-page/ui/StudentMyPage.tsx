'use client';

import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { StatCard, Input, Button } from '@/shared/ui';
import { MOCK_CURRENT_STUDENT } from '@/entities/user';

const LEARNING_STATS = [
  { label: '총 학습시간', value: '48시간', trend: '이번 달 +12시간', trendColor: 'green' as const },
  { label: '완료 강좌', value: '1개', trend: '수강 중 3개', trendColor: 'green' as const },
  { label: '평균 점수', value: '87.5점', trend: '상위 15%', trendColor: 'green' as const },
];

const COMPLETED_COURSES = [
  { id: 'c0', title: '컴퓨터과학 개론', semester: '2025-2학기', grade: 'A+' },
];

export function StudentMyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar activeItem="마이페이지" />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-700">마이페이지</h1>
            <p className="mt-1 text-sm text-gray-500">
              프로필 정보와 학습 통계를 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Left column: profile card + account settings */}
            <div className="col-span-1 flex flex-col gap-6">
              {/* Profile card */}
              <section
                aria-label="프로필"
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                {/* Avatar */}
                <div className="mb-4 flex flex-col items-center gap-3">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-100"
                    aria-hidden="true"
                  >
                    <span className="text-2xl font-bold text-gray-400">
                      {MOCK_CURRENT_STUDENT.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-800">
                      {MOCK_CURRENT_STUDENT.name}
                    </h2>
                    <p className="text-sm text-gray-500">{MOCK_CURRENT_STUDENT.email}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">역할</span>
                    <span className="font-medium text-gray-700">학생</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">학번</span>
                    <span className="font-medium text-gray-700">2022XXXXXX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">소속</span>
                    <span className="font-medium text-gray-700">컴퓨터공학부</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">학년</span>
                    <span className="font-medium text-gray-700">3학년</span>
                  </div>
                </div>
              </section>

              {/* Completed courses */}
              <section
                aria-label="수강 완료 강좌"
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-700">수강 완료 강좌</h3>
                {COMPLETED_COURSES.length > 0 ? (
                  <ul className="space-y-2">
                    {COMPLETED_COURSES.map((c) => (
                      <li
                        key={c.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">{c.title}</p>
                          <p className="text-xs text-gray-500">{c.semester}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600">{c.grade}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">완료한 강좌가 없습니다.</p>
                )}
              </section>
            </div>

            {/* Right column: stats + settings */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* Learning stats */}
              <section aria-label="학습 통계">
                <h2 className="mb-4 text-base font-semibold text-gray-700">학습 통계</h2>
                <div className="grid grid-cols-3 gap-4">
                  {LEARNING_STATS.map((stat) => (
                    <StatCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      trend={stat.trend}
                      trendColor={stat.trendColor}
                    />
                  ))}
                </div>
              </section>

              {/* Account settings */}
              <section
                aria-label="계정 설정"
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h2 className="mb-6 text-base font-semibold text-gray-700">계정 설정</h2>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-5"
                  aria-label="프로필 편집 양식"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="이름"
                      id="name"
                      name="name"
                      defaultValue={MOCK_CURRENT_STUDENT.name}
                      placeholder="이름 입력"
                    />
                    <Input
                      label="이메일"
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={MOCK_CURRENT_STUDENT.email}
                      placeholder="이메일 입력"
                      disabled
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="mb-4 text-sm font-medium text-gray-600">비밀번호 변경</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="현재 비밀번호"
                        id="current-password"
                        name="currentPassword"
                        type="password"
                        placeholder="현재 비밀번호"
                        autoComplete="current-password"
                      />
                      <Input
                        label="새 비밀번호"
                        id="new-password"
                        name="newPassword"
                        type="password"
                        placeholder="새 비밀번호 (8자 이상)"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button type="button" variant="secondary">
                      취소
                    </Button>
                    <Button type="submit" variant="primary">
                      저장
                    </Button>
                  </div>
                </form>
              </section>

              {/* Notification settings */}
              <section
                aria-label="알림 설정"
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h2 className="mb-4 text-base font-semibold text-gray-700">알림 설정</h2>
                <ul className="space-y-3">
                  {[
                    { id: 'notif-deadline', label: '과제 마감 알림 (D-2, D-1)' },
                    { id: 'notif-grade', label: '채점 완료 알림' },
                    { id: 'notif-notice', label: '강좌 공지사항 알림' },
                  ].map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      <label
                        htmlFor={item.id}
                        className="text-sm text-gray-700"
                      >
                        {item.label}
                      </label>
                      <input
                        id={item.id}
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 accent-gray-700"
                        aria-label={item.label}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
