'use client';

/** TeachingsSearchBar.tsx — the wide search input. */

import React from 'react';
import { TIcon } from './TeachingsIcons';

interface Props { value: string; onChange: (v: string) => void; placeholder?: string }

export function TeachingsSearchBar({ value, onChange, placeholder = 'Search teachings by title, speaker, or keyword...' }: Props) {
  return (
    <label className="flex h-9 items-center gap-3.5 rounded-[10px] border border-[#ece5d8] bg-[#fffdf9] px-3.5 shadow-[0_2px_8px_rgba(15,35,82,.05)]">
      <TIcon name="search" className="h-5 w-5 shrink-0 text-[#35609a]" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label="Search teachings"
        className="w-full bg-transparent font-['Crimson_Text',serif] text-sm text-[#1c2740] outline-none placeholder:text-[#8a93a7]" />
    </label>
  );
}