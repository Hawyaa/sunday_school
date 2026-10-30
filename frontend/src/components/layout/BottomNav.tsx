'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useAppStore();

  const links = [
    { href: '/', label: t.nav.home, icon: 'home' },
    { href: '/schedule', label: t.nav.schedule, icon: 'calendar_month' },
    { href: '/mezmur', label: t.nav.mezmur, icon: 'music_note' },
    { href: '/teachings', label: t.nav.teachings, icon: 'menu_book' },
    { href: '/gallery', label: t.nav.gallery, icon: 'photo_library' },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 inset-x-4 z-50 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 px-3 flex items-center justify-around">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 text-center transition-all ${
              isActive ? 'text-blue-600 scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'font-bold' : ''}`}>
              {link.icon}
            </span>
            <span className="text-[10px] font-semibold leading-tight">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
