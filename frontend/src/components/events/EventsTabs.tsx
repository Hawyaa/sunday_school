'use client';

/**
 * EventsTabs.tsx
 *
 * Tab switch between Upcoming Events and Past Events.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export type EventTabType = 'upcoming' | 'past';

interface Props {
  activeTab: EventTabType;
  onChange: (tab: EventTabType) => void;
}

export function EventsTabs({ activeTab, onChange }: Props) {
  const { locale } = useAppStore();

  return (
    <div className="flex gap-4 max-w-[520px]" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'upcoming'}
        onClick={() => onChange('upcoming')}
        className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          activeTab === 'upcoming'
            ? 'bg-[#1E2A5E] text-white border-[1.5px] border-[#C99A3B] shadow-[0_4px_10px_rgba(30,42,94,0.12)]'
            : 'bg-white text-[#1E2A5E] border-[1.5px] border-[#E3EEF8] hover:bg-[#1E2A5E] hover:text-white hover:border-[#C99A3B]'
        }`}
      >
        <span>🏠</span>
        <span>{locale === 'am' ? 'የሚመጡ ሁነቶች' : 'Upcoming Events'}</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'past'}
        onClick={() => onChange('past')}
        className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          activeTab === 'past'
            ? 'bg-[#1E2A5E] text-white border-[1.5px] border-[#C99A3B] shadow-[0_4px_10px_rgba(30,42,94,0.12)]'
            : 'bg-white text-[#1E2A5E] border-[1.5px] border-[#E3EEF8] hover:bg-[#1E2A5E] hover:text-white hover:border-[#C99A3B]'
        }`}
      >
        <span>{locale === 'am' ? 'ያለፉ ሁነቶች' : 'Past Events'}</span>
      </button>
    </div>
  );
}
