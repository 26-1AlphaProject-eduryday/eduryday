const NAV_LINKS = [
  { label: '기능 소개', href: '#features' },
  { label: '팀 소개', href: '#team' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingHeader() {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gray-800" />
          <span className="text-lg font-bold text-gray-900">EduRyday</span>
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="주요 메뉴">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            로그인
          </a>
          <a
            href="/signup"
            className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 active:bg-black"
          >
            시작하기
          </a>
        </div>
      </div>
    </header>
  );
}
