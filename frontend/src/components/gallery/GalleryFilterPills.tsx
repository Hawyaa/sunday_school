'use client';

/**
 * GalleryFilterPills.tsx
 *
 * Filter categories for gallery albums (Feasts, Sunday School, Choir, Liturgical, Charity).
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

const CATEGORIES = [
  { key: 'All', labelEn: 'All Albums', labelAm: 'ሁሉም ማህደሮች' },
  { key: 'Feasts', labelEn: 'Feasts & Celebrations', labelAm: 'በዓላትና ደመራ' },
  { key: 'Sunday School', labelEn: 'Sunday School', labelAm: 'ሰንበት ትምህርት ቤት' },
  { key: 'Choir', labelEn: 'Choir & Hymns', labelAm: 'መዘምራንና ዝማሬ' },
  { key: 'Liturgical', labelEn: 'Liturgical & Monastic', labelAm: 'ቅዳሴና ገዳማት' },
  { key: 'Charity', labelEn: 'Charity & Fellowship', labelAm: 'በጎ አድራጎት' },
];

interface Props {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function GalleryFilterPills({ activeCategory, onSelect }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.key;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelect(cat.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
              isActive
                ? 'bg-[#1E2A5E] text-white border-[#C99A3B] shadow-sm'
                : 'bg-white text-[#1E2A5E] border-[#E3EEF8] hover:border-[#C99A3B] hover:bg-[#E3EEF8]'
            }`}
          >
            {isAm ? cat.labelAm : cat.labelEn}
          </button>
        );
      })}
    </div>
  );
}
