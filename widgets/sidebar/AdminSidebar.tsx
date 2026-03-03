interface AdminSidebarProps {
  activeItem?: string;
}

const NAV_ITEMS = [
  { label: '대시보드', href: '/admin/dashboard' },
  { label: '사용자 관리', href: '/admin/users' },
  { label: '강좌 관리', href: '/admin/courses' },
  { label: '시스템 설정', href: '/admin/settings' },
  { label: '로그/모니터링', href: '/admin/logs' },
  { label: 'AI 설정', href: '/admin/settings' },
];

export function AdminSidebar({ activeItem }: AdminSidebarProps) {
  return (
    <aside className="min-h-screen w-64 bg-gray-800 p-4">
      <nav aria-label="관리자 메뉴">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-700 font-medium text-white'
                      : 'font-normal text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
