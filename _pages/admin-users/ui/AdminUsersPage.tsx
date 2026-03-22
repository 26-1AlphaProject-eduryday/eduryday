'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Badge, Button, TableSkeleton } from '@/shared/ui';

type UserRole = '학생' | '교수' | '관리자';
type UserStatus = '활성' | '정지' | '승인대기';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastLogin: string;
}

interface UserResponse {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  stats: {
    totalUsers: number;
    students: number;
    professors: number;
    active: number;
  };
}

const ROLE_BADGE: Record<UserRole, 'blue' | 'green' | 'red'> = {
  학생: 'blue',
  교수: 'green',
  관리자: 'red',
};

const STATUS_BADGE: Record<UserStatus, 'green' | 'red' | 'yellow'> = {
  활성: 'green',
  정지: 'red',
  승인대기: 'yellow',
};

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState<UserResponse['stats']>({
    totalUsers: 0,
    students: 0,
    professors: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  async function loadUsers() {
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      role: roleFilter,
      status: statusFilter,
      q: query,
    });

    const res = await fetch(`/api/v1/users?${params.toString()}`, { cache: 'no-store' });
    const json = await res.json();

    if (json.ok) {
      const data = json.data as UserResponse;
      setUsers(data.users);
      setTotal(data.total);
      setStats(data.stats);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter, statusFilter]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    await loadUsers();
  }

  async function updateUserStatus(userId: string, action: 'approve' | 'suspend' | 'activate') {
    const res = await fetch(`/api/v1/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    const json = await res.json();

    if (json.ok) {
      await loadUsers();
    }
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
            <p className="mt-1 text-sm text-gray-500">전체 사용자 계정을 관리합니다</p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">전체 사용자</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">학생</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{stats.students}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">교수</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{stats.professors}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">활성</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-4 flex items-center gap-3">
            <select
              aria-label="역할 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">전체 역할</option>
              <option value="student">학생</option>
              <option value="professor">교수</option>
              <option value="admin">관리자</option>
            </select>

            <select
              aria-label="상태 필터"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="pending">승인대기</option>
              <option value="suspended">정지</option>
            </select>

            <input
              type="search"
              placeholder="이름 또는 이메일로 검색"
              aria-label="사용자 검색"
              className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="sm" variant="secondary">검색</Button>
          </form>

          <section aria-label="사용자 목록">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
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
                  {loading ? (
                    <TableSkeleton columns={7} rows={3} />
                  ) :users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-gray-500">사용자가 없습니다.</td>
                    </tr>
                  ) : (
                    users.map((user) => (
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
                            {user.status === '승인대기' ? (
                              <Button size="sm" onClick={() => updateUserStatus(user.id, 'approve')}>승인</Button>
                            ) : null}
                            {user.status === '활성' ? (
                              <Button variant="danger" size="sm" onClick={() => updateUserStatus(user.id, 'suspend')}>계정정지</Button>
                            ) : (
                              <Button variant="secondary" size="sm" onClick={() => updateUserStatus(user.id, 'activate')}>활성화</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>전체 {total}명 중 {(page - 1) * pageSize + 1}-{Math.min(total, page * pageSize)} 표시</p>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  이전
                </button>
                <span className="px-2">{page}/{totalPages}</span>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
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
