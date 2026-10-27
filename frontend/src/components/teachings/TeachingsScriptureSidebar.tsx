'use client';

/** TeachingsScriptureSidebar.tsx — right column: quote banner + "Browse by Category" list. */

import React from 'react';
import { TeachingsQuoteBanner } from './TeachingsQuoteBanner';
import { TIcon, type TeachingsIconName } from './TeachingsIcons';

export const CATEGORIES: { label: string; icon: TeachingsIconName; solid?: boolean }[] = [
  { label: 'Bible Teachings', icon: 'bible' },
  { label: 'Church Fathers', icon: 'father', solid: true },
  { label: 'Spiritual Life', icon: 'flame', solid: true },
  { label: 'Faith & Practice', icon: 'faith', solid: true },
  { label: 'Youth Teachings', icon: 'youth', solid: true },
];

interface Props { active?: string; onSelect?: (label: string) => void }

export function TeachingsScriptureSidebar({ active, onSelect }: Props) {
  return (
    <aside className="flex flex-col gap-[17px]">
      <TeachingsQuoteBanner />

      <div className="rounded-xl border border-[#e1e8f0] bg-[#eef2f6] px-3.5 pb-2.5 pt-3.5">
        <h4 className="flex items-center gap-3.5 px-2 pb-1.5 font-['Crimson_Text',serif] text-[17px] font-semibold text-[#0f2352]">
          <TIcon name="book" solid className="h-5 w-5 text-[#b9852a]" />Browse by Category
        </h4>
        {CATEGORIES.map((c) => (
          <button key={c.label} type="button" onClick={() => onSelect?.(c.label)} aria-pressed={active === c.label}
            className={`flex w-full items-center gap-4 border-t border-[#dde5ee] py-[9px] pl-2.5 pr-3 text-left font-['Crimson_Text',serif] text-[15.5px] text-[#1c3a63] transition hover:bg-white ${active === c.label ? 'bg-white' : 'bg-white/55'}`}>
            <TIcon name={c.icon} solid={c.solid} className="h-[19px] w-[19px] text-[#b9852a]" />
            {c.label}
            <TIcon name="chr" className="ml-auto h-[11px] w-[11px] text-[#35609a]" />
          </button>
        ))}
      </div>
    </aside>
  );
}