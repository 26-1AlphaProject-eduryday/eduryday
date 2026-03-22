'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  dark?: boolean;
}

export function MobileDrawer({ open, onClose, items, dark = false }: MobileDrawerProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const bg = dark ? 'bg-gray-800' : 'bg-white';
  const text = dark ? 'text-gray-200' : 'text-gray-700';
  const activeText = dark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900';
  const hoverBg = dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <nav
        className={`fixed inset-y-0 left-0 z-50 w-64 ${bg} p-4 shadow-xl lg:hidden`}
        aria-label="모바일 메뉴"
      >
        <div className="mb-6 flex items-center justify-between">
          <span className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>메뉴</span>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-1 ${text} ${hoverBg}`}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? activeText : `${text} ${hoverBg}`
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
