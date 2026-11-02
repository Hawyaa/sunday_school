'use client';

/**
 * MezmurRecentCard.tsx — "Recent Mezmurs" list (right column, top).
 * Newest first, scrolls when there are many. Click a row to show it in the lyric card.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronRight, MusicIcon } from '@/components/reports/icons';
import { ClockIcon, Corners } from '@/components/mezmur/icons';
import type { MezmurItem } from '@/components/mezmur/mezmurData';

interface Props {
  items: MezmurItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export function MezmurRecentCard({ items, activeId, onSelect }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const recent = [...items].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  return (
    <div className="relative rounded-xl border border-[#ecdcb8] bg-[#fffdf9] px-6 pb-8 pt-5 shadow-[0_3px_14px_rgba(15,35,82,0.05)]">
      <Corners size={40} inset={4} />

      <h2 className="mb-3 flex items-center justify-center gap-3 font-['Playfair_Display',serif] text-[21px] font-bold text-[#0F1B3E]">
        <ClockIcon className="h-6 w-6 text-[#b9852a]" />
        {am ? 'የቅርብ ጊዜ መዝሙራት' : 'Recent Mezmurs'}
      </h2>

      <ul className="max-h-[245px] overflow-y-auto pr-1 [scrollbar-color:#c8952f_transparent] [scrollbar-width:thin]">
        {recent.map((m, i) => {
          const isActive = m.id === activeId;
          return (
            <li key={m.id} className={i < recent.length - 1 ? 'border-b border-[#efe6d3]' : ''}>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                className={`flex w-full cursor-pointer items-center gap-3.5 px-1 py-[11px] text-left font-['Crimson_Text',serif] text-[15px] transition hover:text-[#b9852a] ${
                  isActive ? 'font-semibold text-[#b9852a]' : 'text-[#1c2740]'
                }`}
              >
                <MusicIcon className="h-[20px] w-[20px] shrink-0 text-[#b9852a]" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{m.title}</span>
                    {m.audioUrl && (
                      <span className="text-[12px] text-[#137333] font-bold shrink-0" title="Audio track available">
                        🔊
                      </span>
                    )}
                  </span>
                  {!am && <span className="block truncate text-[12.5px] font-normal text-[#6b7690]">{m.titleEn}</span>}
                </span>
                <span className="shrink-0 text-[12.5px] font-normal text-[#6b7690]">{fmt(m.addedAt)}</span>
                <ChevronRight className="h-3 w-3 shrink-0 text-[#9aa3b5]" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
