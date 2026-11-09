'use client';

/**
 * MezmurPopularCard.tsx — "Popular Mezmurs" list (right column, bottom).
 * Clicking a row (or its play button) shows that mezmur in the lyric card.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { FlameIcon, PlayIcon } from '@/components/mezmur/icons';
import type { MezmurItem } from '@/components/mezmur/mezmurData';

interface Props {
  items: MezmurItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function MezmurPopularCard({ items, activeId, onSelect }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <div className="rounded-xl border border-[#dbe6f3] bg-[linear-gradient(#edf3fa,#e6eef8)] px-5 pb-3 pt-4 shadow-[0_3px_14px_rgba(15,35,82,0.05)]">
      <h2 className="mb-2 flex items-center gap-3 px-1 font-['Crimson_Text',serif] text-[17px] font-bold text-[#0f2352]">
        <FlameIcon className="h-5 w-5 text-[#0f2352]" />
        {am ? 'ተወዳጅ መዝሙራት' : 'Popular Mezmurs'}
      </h2>

      {items.length === 0 ? (
        <p className="py-6 text-center font-['Crimson_Text',serif] text-[14px] text-[#5a6479]">
          {am ? 'ምንም መዝሙር አልተገኘም።' : 'No mezmur found.'}
        </p>
      ) : (
        <ol className="max-h-[235px] overflow-y-auto pr-1 [scrollbar-color:#c8952f_transparent] [scrollbar-width:thin]">
          {items.map((m, i) => {
            const isActive = m.id === activeId;
            return (
              <li key={m.id} className={i < items.length - 1 ? 'border-b border-[#d3deec]' : ''}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(m.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(m.id)}
                  className="flex cursor-pointer items-center gap-3 px-1 py-2.5 font-['Crimson_Text',serif] text-[14px] text-[#35609a] transition hover:text-[#0f2352]"
                >
                  <span className="w-4 shrink-0 text-[#35496b]">{i + 1}.</span>
                  <span className={`min-w-0 flex-1 truncate ${isActive ? 'font-semibold text-[#0f2352]' : ''}`}>
                    <span className="truncate">{m.title}</span>
                    {m.audioUrl && (
                      <span className="ml-1 text-[11px] text-[#137333] font-bold" title="Audio recording available">
                        🔊
                      </span>
                    )}
                    {!am && <span className="text-[#5a6479]"> ({m.titleEn})</span>}
                  </span>
                  <button
                    type="button"
                    aria-label={`${am ? 'አጫውት' : 'Play'} ${m.titleEn}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(m.id);
                    }}
                    className="grid h-[30px] w-[30px] shrink-0 cursor-pointer place-items-center rounded-full bg-white text-[#c8952f] shadow-[0_1px_4px_rgba(15,35,82,0.15)] transition hover:bg-[#fff4d9]"
                  >
                    <PlayIcon className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
