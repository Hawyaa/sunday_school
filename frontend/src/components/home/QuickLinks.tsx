'use client';

/**
 * QuickLinks.tsx
 *
 * Pure presentational sidebar widget — zero props, zero API calls.
 * Add or reorder links here without touching any other file.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

const QUICK_LINKS = [
  { icon: '📅', labelEn: 'Schedule', labelAm: 'መርሐ ግብር', href: '/schedule' },
  { icon: '🎵', labelEn: 'Mezmur',   labelAm: 'መዝሙር',      href: '/mezmur' },
  { icon: '📖', labelEn: 'Teachings', labelAm: 'ትምህርት',    href: '/teachings' },
  { icon: '🖼️', labelEn: 'Gallery',  labelAm: 'ማኅደር',      href: '/gallery' },
  { icon: '📞', labelEn: 'Contact',  labelAm: 'አድራሻ',       href: '/contact' },
  { icon: '▶️', labelEn: 'Live',     labelAm: 'ቀጥታ',        href: '/teachings' },
];

export function QuickLinks() {
  const { locale } = useAppStore();

  return (
    <div className="bg-white rounded-xl border border-[#E3EEF8] p-6 shadow-[0_4px_12px_rgba(30,42,94,0.04)]">
      <h2 className="text-base font-bold text-[#1E2A5E] mb-3">⚡ Quick Links</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href + item.labelEn}
            href={item.href}
            className="bg-[#E3EEF8] hover:bg-[#d4e4f4] rounded-lg py-3 px-1.5 text-center transition-all hover:-translate-y-0.5 block"
          >
            <span className="text-lg mb-1 block">{item.icon}</span>
            <span className="text-[11px] font-bold text-[#1E2A5E] block truncate">
              {locale === 'am' ? item.labelAm : item.labelEn}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
