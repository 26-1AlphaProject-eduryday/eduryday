import { ReactNode } from 'react';
import Link from 'next/link';

export function TopNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">EduRyday</Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          <Link href="/student">학생</Link>
          <Link href="/professor">교수</Link>
          <Link href="/admin">관리자</Link>
          <Link href="/login" className="rounded-md border px-3 py-1.5">로그인</Link>
        </nav>
      </div>
    </header>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNav />
      {children}
    </div>
  );
}
