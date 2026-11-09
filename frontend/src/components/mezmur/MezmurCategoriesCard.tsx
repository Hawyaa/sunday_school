'use client';

/**
 * MezmurCategoriesCard.tsx — "Mezmur Categories" (right column, top).
 * Clicking a row filters the page; click again to clear.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronRight, MusicIcon } from '@/components/reports/icons';
import { BuildingIcon, Corners, PrayIcon, StarIcon, UsersIcon } from '@/components/mezmur/icons';
import { CATEGORIES, type MezmurIconKey } from '@/components/mezmur/mezmurData';

const ICONS: Record<MezmurIconKey, React.ComponentType<{ className?: string }>> = {
  music: MusicIcon,
  users: UsersIcon,
  star: StarIcon,
  building: BuildingIcon,
  pray: PrayIcon,
};

interface Props {
  active: string;
  onSelect: (key: string) => void;
}

export function MezmurCategoriesCard({ active, onSelect }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <div className="relative rounded-xl border border-[#ecdcb8] bg-[#fffdf9] px-6 pb-9 pt-5 shadow-[0_3px_14px_rgba(15,35,82,0.05)]">
      <Corners size={40} inset={4} />

      <h2 className="mb-3 flex items-center justify-center gap-3 font-['Playfair_Display',serif] text-[21px] font-bold text-[#0f2352]">
        <MusicIcon className="h-6 w-6 text-[#b9852a]" />
        {am ? 'የመዝሙር ምድቦች' : 'Mezmur Categories'}
      </h2>

      <ul>
        {CATEGORIES.map((c, i) => {
          const Icon = (c.icon && ICONS[c.icon as MezmurIconKey]) || MusicIcon;
          const isActive = active === c.key;
          return (
            <li key={c.key} className={i < CATEGORIES.length - 1 ? 'border-b border-[#efe6d3]' : ''}>
              <button
                type="button"
                onClick={() => onSelect(isActive ? 'all' : c.key)}
                aria-pressed={isActive}
                className={`flex w-full cursor-pointer items-center gap-3.5 px-1 py-[11px] text-left font-['Crimson_Text',serif] text-[15px] transition hover:text-[#b9852a] ${
                  isActive ? 'font-semibold text-[#b9852a]' : 'text-[#1c2740]'
                }`}
              >
                <Icon className="h-[22px] w-[22px] shrink-0 text-[#b9852a]" />
                <span className="flex-1">{am ? c.am : c.en}</span>
                <ChevronRight className="h-3 w-3 text-[#9aa3b5]" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
