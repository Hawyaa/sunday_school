'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export function UrgentBanner() {
  const { locale } = useAppStore();

  return (
    <div className="bg-[#1E2A5E] text-white px-6 py-2.5 text-sm font-medium flex justify-between items-center z-50">
      <div className="max-w-[1280px] mx-auto w-full flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span>⚠️</span>
          <span>
            {locale === 'am'
              ? 'በዚህ ሳምንት የሚተላለፈው የአቡነ ሚዲያ መርሐ ግብር ተሰርዟል።'
              : 'Attention: This week’s Abune Media schedule has been updated.'}
          </span>
        </span>
        <Link
          href="/announcements"
          className="text-white underline font-semibold hover:text-[#FBF7F0] transition shrink-0 ml-4"
        >
          {locale === 'am' ? 'ዝርዝሩን ይመልከቱ >' : 'View Details >'}
        </Link>
      </div>
    </div>
  );
}
