import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge, Button } from '@/shared/ui';

const STATS = [
  { label: '전체 사용자', value: '342명' },
  { label: '학생', value: '298명' },
  { label: '교수', value: '44명' },
  { label: '오늘 접속', value: '127명' },
];

type UserRole = '학생' | '교수';
type UserStatus = '활성' | '정지';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastLogin: string;
}

const USERS: User[] = [
  {
    id: 1,
    name: '김철수',
    email: 'chulsoo.kim@university.ac.kr',
    role: '학생',
    status: '활성',
    joinedAt: '2026-03-02',
    lastLogin: '2026-03-04 14:23',
  },
  {
    id: 2,
    name: '이영희',
    email: 'younghee.lee@university.ac.kr',
    role: '학생',
    status: '활성',
    joinedAt: '2026-03-02',
    lastLogin: '2026-03-04 09:15',
  },
  {
    id: 3,
    name: '박민수',
    email: 'minsu.park@university.ac.kr',
    role: '학생',
    status: '정지',
    joinedAt: '2026-03-01',
    lastLogin: '2026-03-03 18:42',
  },
  {
    id: 4,
    name: '이현기',
    email: 'hyungi.lee@university.ac.kr',
    role: '교수',
    status: '활성',
    joinedAt: '2026-02-28',
    lastLogin: '2026-03-04 11:05',
  },
  {
    id: 5,
    name: '정소연',
    email: 'soyeon.jung@university.ac.kr',
    role: '교수',
    status: '활성',
    joinedAt: '2026-02-27',
    lastLogin: '2026-03-04 08:50',
  },
];

const ROLE_BADGE: Record<UserRole, 'blue' | 'green'> = {
  학생: 'blue',
  교수: 'green',
};

const STATUS_BADGE: Record<UserStatus, 'green' | 'red'> = {
  활성: 'green',
  정지: 'red',
};

export function AdminUsersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar activeItem="사용자 관리" />

        <main className="flex-1 bg-gray-50 p-8">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
            <p className="mt-1 text-sm text-gray-500">전체 사용자 계정을 관리합니다</p>
          </div>

          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="mb-4 flex items-center gap-3">
            <select
              aria-label="역할 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue="all"
            >
              <option value="all">전체 역할</option>
              <option value="student">학생</option>
              <option value="professor">교수</option>
            </select>

            <select
              aria-label="상태 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue="all"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="suspended">정지</option>
            </select>

            <input
              type="search"
              placeholder="이름 또는 이메일로 검색"
              aria-label="사용자 검색"
              className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />

            <div className="ml-auto">
              <Button size="sm">사용자 추가</Button>
            </div>
          </div>

          {/* Users table */}
          <section aria-label="사용자 목록">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">이름</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">이메일</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">역할</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">상태</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">가입일</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">마지막 로그인</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {USERS.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-5 py-3 text-gray-600">{user.email}</td>
                      <td className="px-5 py-3">
                        <Badge variant={ROLE_BADGE[user.role]}>{user.role}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={STATUS_BADGE[user.status]}>{user.status}</Badge>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{user.joinedAt}</td>
                      <td className="px-5 py-3 text-gray-600">{user.lastLogin}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="sm">상세보기</Button>
                          {user.status === '활성' ? (
                            <Button variant="danger" size="sm">계정정지</Button>
                          ) : (
                            <Button variant="secondary" size="sm">활성화</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>전체 342명 중 1-5 표시</p>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled
                  aria-label="이전 페이지"
                >
                  이전
                </button>
                <button
                  className="rounded-lg border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-white"
                  aria-current="page"
                >
                  1
                </button>
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                  2
                </button>
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                  3
                </button>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                  aria-label="다음 페이지"
                >
                  다음
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
