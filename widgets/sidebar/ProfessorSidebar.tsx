interface ProfessorSidebarProps {
  activeItem?: string;
}

const NAV_ITEMS = [
  { label: '대시보드', href: '/professor/dashboard' },
  { label: '내 강좌', href: '/professor/courses' },
  { label: '과제 관리', href: '/professor/assignments' },
  { label: '채점 현황', href: '/professor/courses/1/grading' },
  { label: '성적 관리', href: '/professor/grades' },
  { label: '학습 분석', href: '/professor/analytics' },
  { label: '공지사항', href: '/professor/announcements' },
];

export function ProfessorSidebar({ activeItem }: ProfessorSidebarProps) {
  return (
    <aside className="min-h-screen w-64 border-r border-gray-200 bg-white p-4">
      <nav aria-label="교수 메뉴">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-100 font-medium text-gray-900'
                      : 'font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
