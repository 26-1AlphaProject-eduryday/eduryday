'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';
import { MobileDrawer } from '@/widgets/mobile-drawer';

const STUDENT_NAV_ITEMS = [
  { label: '대시보드', href: '/student/dashboard' },
  { label: '내 강좌', href: '/student/courses' },
  { label: '과제', href: '/student/assignments' },
  { label: '성적', href: '/student/grades' },
  { label: 'AI 튜터', href: '/student/ai-tutor' },
  { label: '마이페이지', href: '/student/my-page' },
];

export function StudentHeader() {
  const router = useRouter();
  const [name, setName] = useState('학생');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return;
      }

      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        return;
      }

      const profileRes = await fetch('/api/v1/profile', { cache: 'no-store' });
      const profileJson = await profileRes.json();

      if (profileJson.ok) {
        setName(profileJson.data.profile.name);
      } else {
        setName(user.email?.split('@')[0] ?? '학생');
      }
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  }

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden rounded-lg p-1 text-gray-700 hover:bg-gray-100"
            onClick={() => setDrawerOpen(true)}
            aria-label="메뉴 열기"
          >
            ☰
          </button>
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gray-800" />
            <span className="text-lg font-bold text-gray-900">EduRyday</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600" aria-label="알림">🔔</button>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-gray-700 hover:bg-gray-100">
            <div className="h-8 w-8 rounded-full bg-gray-300" aria-hidden="true" />
            <span className="font-medium">{name}</span>
            <span className="text-gray-400" aria-hidden="true">로그아웃</span>
          </button>
        </div>
      </div>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={STUDENT_NAV_ITEMS}
      />
    </header>
  );
}
