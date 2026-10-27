'use client';

/**
 * ScheduleFilterTabs.tsx
 *
 * Category filter tabs: All Services, Daily Prayers, Weekly Services, Special Services.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

interface Tab {
  key: string;
  icon: string;
  labelEn: string;
  labelAm: string;
}

const TABS: Tab[] = [
  { key: 'all', icon: '📅', labelEn: 'All Services', labelAm: 'ሁሉም አገልግሎቶች' },
  { key: 'daily', icon: '📖', labelEn: 'Daily Prayers', labelAm: 'ዕለታዊ ጸሎቶች' },
  { key: 'weekly', icon: '👥', labelEn: 'Weekly Services', labelAm: 'ሳምንታዊ አገልግሎቶች' },
  { key: 'special', icon: '✨', labelEn: 'Special Services', labelAm: 'ልዩ አገልግሎቶች' },
];

interface Props {
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function ScheduleFilterTabs({ activeTab, onTabChange }: Props) {
  const { locale } = useAppStore();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-3 rounded-xl px-5 py-4 border text-left transition-all cursor-pointer shadow-[0_2px_6px_rgba(30,42,94,0.02)] ${
              isActive
                ? 'bg-[#1E2A5E] border-[#C99A3B] text-white'
                : 'bg-white border-[#E3EEF8] text-[#1E2A5E] hover:bg-[#1E2A5E] hover:text-white hover:border-[#C99A3B]'
            }`}
          >
            <span className={`text-[22px] ${isActive ? 'text-[#C99A3B]' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-sm font-bold">
              {locale === 'am' ? tab.labelAm : tab.labelEn}
            </span>
          </button>
        );
      })}
    </div>
  );
}
