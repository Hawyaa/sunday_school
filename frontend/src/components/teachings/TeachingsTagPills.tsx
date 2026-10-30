'use client';

/**
 * TeachingsTagPills.tsx
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

const TAGS = [
  { key: 'All', labelEn: 'All Subjects', labelAm: 'ሁሉም ርዕሶች' },
  { key: 'Holy Bible', labelEn: 'Holy Bible', labelAm: 'መጽሐፍ ቅዱስ' },
  { key: 'Dogma', labelEn: 'Dogma', labelAm: 'ነገረ መለኮት (ዶግማ)' },
  { key: 'Church History', labelEn: 'Church History', labelAm: 'የቤተክርስቲያን ታሪክ' },
  { key: 'Patristics', labelEn: 'Patristics', labelAm: 'ነገረ አበው' },
];

interface Props {
  activeTag: string;
  onSelect: (tag: string) => void;
}

export function TeachingsTagPills({ activeTag, onSelect }: Props) {
  const { locale } = useAppStore();

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
      {TAGS.map((t) => {
        const isActive = activeTag === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelect(t.key)}
            className={`px-4.5 py-2 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-[#E3EEF8] text-[#1E2A5E] border-[#C99A3B]'
                : 'bg-white text-[#1E2A5E] border-[#E3EEF8] hover:border-[#C99A3B] hover:bg-[#E3EEF8]'
            }`}
          >
            {locale === 'am' ? t.labelAm : t.labelEn}
          </button>
        );
      })}
    </div>
  );
}
