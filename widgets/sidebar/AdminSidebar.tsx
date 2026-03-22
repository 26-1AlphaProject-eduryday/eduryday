'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: '대시보드', href: '/admin/dashboard' },
  { label: '사용자 관리', href: '/admin/users' },
  { label: '강좌 관리', href: '/admin/courses' },
  { label: '로그/모니터링', href: '/admin/logs' },
  { label: '시스템 설정', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex min-h-screen w-64 bg-gray-800 p-4 flex-col">
      <nav aria-label="관리자 메뉴">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-700 font-medium text-white'
                      : 'font-normal text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
