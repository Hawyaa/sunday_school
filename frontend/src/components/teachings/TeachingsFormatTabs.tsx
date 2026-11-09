'use client';

/**
 * TeachingsFormatTabs.tsx
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

const FORMATS = [
  { key: 'all', icon: '📁', labelEn: 'All', labelAm: 'ሁሉም' },
  { key: 'pdf', icon: '📄', labelEn: 'PDF Documents', labelAm: 'የፒዲኤፍ ሰነዶች' },
  { key: 'audio', icon: '🎧', labelEn: 'Audio Lessons', labelAm: 'የድምፅ ትምህርቶች' },
  { key: 'video', icon: '🎬', labelEn: 'Video Sermons', labelAm: 'የቪዲዮ ስብከቶች' },
];

interface Props {
  activeFormat: string;
  onSelect: (fmt: string) => void;
}

export function TeachingsFormatTabs({ activeFormat, onSelect }: Props) {
  const { locale } = useAppStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#E3EEF8] p-2 rounded-xl">
      {FORMATS.map((f) => {
        const isActive = activeFormat === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onSelect(f.key)}
            className={`py-2.5 px-4 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isActive
                ? 'bg-[#1E2A5E] text-white border-[1.5px] border-[#C99A3B] shadow-[0_2px_6px_rgba(30,42,94,0.12)]'
                : 'bg-transparent text-[#1E2A5E] hover:bg-white/60'
            }`}
          >
            <span>{f.icon}</span>
            <span>{locale === 'am' ? f.labelAm : f.labelEn}</span>
          </button>
        );
      })}
    </div>
  );
}
