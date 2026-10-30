'use client';

/**
 * MezmurSearchBar.tsx
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function MezmurSearchBar({ value, onChange }: Props) {
  const { locale } = useAppStore();

  return (
    <div className="bg-white border-[1.5px] border-[#E3EEF8] focus-within:border-[#C99A3B] rounded-full px-5 py-3 flex items-center gap-3 shadow-[0_2px_6px_rgba(30,42,94,0.02)] transition-colors">
      <span className="text-[#1E2A5E] text-base select-none">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={locale === 'am' ? 'የመዝሙር ርዕስ ይፈልጉ...' : 'Search mezmur title...'}
        className="w-full border-none outline-hidden bg-transparent text-sm text-[#44506B] placeholder-[#8896AB]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-xs text-[#44506B] hover:text-[#1E2A5E] cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  );
}
