'use client';

import { useState } from 'react';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { StatCard, Input, Button } from '@/shared/ui';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
}

interface LearningStatRecord {
  label: string;
  value: string;
  trend: string;
  trendColor: 'green' | 'red';
}

interface CompletedCourseRecord {
  id: string;
  title: string;
  semester: string;
  grade: string;
}

interface StudentMyPageProps {
  student: StudentProfile;
  learningStats: LearningStatRecord[];
  completedCourses: CompletedCourseRecord[];
}

export function StudentMyPage({
  student,
  learningStats,
  completedCourses,
}: StudentMyPageProps) {
  const [name, setName] = useState(student.name);
  const [studentId, setStudentId] = useState(student.studentId);
  const [department, setDepartment] = useState(student.department);
  const [message, setMessage] = useState('');

  function handleCancel() {
    setName(student.name);
    setStudentId(student.studentId);
    setDepartment(student.department);
    setMessage('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch('/api/v1/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role: 'student', studentId, department }),
    });
    const json = await res.json();

    if (json.ok) {
      setMessage('저장되었습니다.');
      return;
    }

    setMessage('저장에 실패했습니다.');
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
            <p className="mt-1 text-sm text-gray-500">
              프로필 정보와 학습 통계를 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-800">
                      {student.name}
                    </h2>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">역할</span>
                    <span className="font-medium text-gray-700">학생</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">학번</span>
                    <span className="font-medium text-gray-700">{student.studentId || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">소속</span>
                    <span className="font-medium text-gray-700">{student.department || '-'}</span>
                  </div>
                </div>
              </section>

              {/* Completed courses */}
              <section
                aria-label="수강 완료 강좌"
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-700">수강 완료 강좌</h3>
                {completedCourses.length > 0 ? (
                  <ul className="space-y-2">
                    {completedCourses.map((c) => (
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {learningStats.map((stat) => (
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
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  aria-label="프로필 편집 양식"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="이름"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="이름 입력"
                    />
                    <Input
                      label="학번"
                      id="student-id"
                      name="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="학번 입력"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="이메일"
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={student.email}
                      placeholder="이메일 입력"
                      disabled
                    />
                    <Input
                      label="소속"
                      id="department"
                      name="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="소속 입력"
                    />
                  </div>

                  <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                      취소
                    </Button>
                    <Button type="submit" variant="primary">
                      저장
                    </Button>
                  </div>
                  {message ? <p className="text-sm text-gray-600">{message}</p> : null}
                </form>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
