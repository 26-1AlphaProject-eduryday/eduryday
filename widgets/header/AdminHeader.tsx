'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

export function AdminHeader() {
  const router = useRouter();
  const [name, setName] = useState('관리자');

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/v1/profile', { cache: 'no-store' });
      const json = await res.json();
      if (json.ok) {
        setName(json.data.profile.name);
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
    <header className="bg-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-white/20" />
            <span className="text-lg font-bold text-white">EduRyday</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-gray-300" aria-label="알림">🔔</div>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-gray-200 hover:bg-gray-700">
            <div className="h-8 w-8 rounded-full bg-gray-600" aria-hidden="true" />
            <span className="font-medium">{name}</span>
            <span className="text-gray-400" aria-hidden="true">로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  );
}
