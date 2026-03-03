interface StudentSidebarProps {
  activeItem?: string;
}

const NAV_ITEMS = [
  { label: '대시보드', href: '/student/dashboard' },
  { label: '내 강좌', href: '/student/courses' },
  { label: '과제', href: '/student/assignments' },
  { label: '성적', href: '/student/grades' },
  { label: 'AI 튜터', href: '/student/ai-tutor' },
  { label: '마이페이지', href: '/student/my-page' },
];

export function StudentSidebar({ activeItem }: StudentSidebarProps) {
  return (
    <aside className="min-h-screen w-64 border-r border-gray-200 bg-white p-4">
      <nav aria-label="학생 메뉴">
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
