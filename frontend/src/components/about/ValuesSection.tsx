'use client';

/**
 * ValuesSection.tsx
 * "Our Values" card. Rendered INSIDE MissionVisionSection (matches the design),
 * so don't render it separately in the page.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { PF, IconBadge, card } from './shared';

const VALUES = [
  { en: 'Faith', am: 'እምነት' },
  { en: 'Community', am: 'ኅብረት' },
  { en: 'Knowledge', am: 'እውቀት' },
  { en: 'Compassion', am: 'ምሕረትና ፍቅር' },
  { en: 'Integrity', am: 'ታማኝነት' },
];

export function ValuesSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <div className={`${card} px-4 py-[18px]`}>
      <IconBadge name="heart" />
      <h3 className={`${PF} mb-1.5 mt-3 text-sm font-semibold text-[#0f2352]`}>{am ? 'እሴቶቻችን' : 'Our Values'}</h3>
      <ul className="text-[10.5px] text-[#5a6479]">
        {VALUES.map((v) => (
          <li key={v.en} className="mb-[3px] flex items-center gap-2">
            <span className="size-[5px] rounded-full bg-[#c8952f]" />
            {am ? v.am : v.en}
          </li>
        ))}
      </ul>
    </div>
  );
}