import Link from 'next/link';

export function StudentHeader() {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gray-800" />
          <span className="text-lg font-bold text-gray-900">EduRyday</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Bell icon placeholder */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600"
            aria-label="알림"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          {/* Avatar + name */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-gray-300" aria-hidden="true" />
            <span className="font-medium">심준</span>
            <span className="text-gray-400" aria-hidden="true">▼</span>
          </button>
        </div>
      </div>
    </header>
  );
}
