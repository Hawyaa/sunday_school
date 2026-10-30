'use client';

/**
 * MezmurSpotlightCard.tsx — "Featured" album card (left column).
 * Fills the row height so its bottom lines up with the sidebar.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Divider, MusicIcon } from '@/components/reports/icons';
import { Corners, PlayIcon } from '@/components/mezmur/icons';
import { SPOTLIGHT } from '@/components/mezmur/mezmurData';

interface Props {
  onPlayAll?: () => void;
}

export function MezmurSpotlightCard({ onPlayAll }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <div className="relative flex h-full flex-col rounded-xl border border-[#ecdcb8] bg-[#fffdf9] px-[18px] pb-7 pt-[18px] text-center shadow-[0_3px_14px_rgba(15,35,82,0.05)]">
      <Corners size={38} inset={4} />

      <div className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-lg bg-[#1c2740]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SPOTLIGHT.image} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
        <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-[linear-gradient(#d3a03c,#b9852a)] px-3 py-1 font-['Crimson_Text',serif] text-[13px] font-semibold text-white shadow">
          <MusicIcon className="h-3.5 w-3.5" />
          {am ? 'ተመራጭ' : 'Featured'}
        </span>
      </div>

      {/* Text block grows/centres so the card matches its neighbours' height */}
      <div className="flex flex-1 flex-col justify-center py-4">
        <h3 className="font-['Crimson_Text',serif] text-[21px] font-bold leading-[1.2] text-[#0f2352]">
          {am ? SPOTLIGHT.titleAm : SPOTLIGHT.title}
        </h3>
        <p className="mt-2 font-['Crimson_Text',serif] text-[15px] text-[#35496b]">
          {am ? SPOTLIGHT.artistAm : SPOTLIGHT.artist}
        </p>
        <p className="mt-3 flex items-center justify-center gap-2 font-['Crimson_Text',serif] text-[15px] text-[#35496b]">
          <MusicIcon className="h-4 w-4 text-[#b9852a]" />
          {am ? 'የመዝሙር አልበም' : 'Mezmur Album'}
        </p>
      </div>

      <Divider className="mx-auto mb-3.5 w-[110px]" />

      <button
        type="button"
        onClick={onPlayAll}
        className="mx-auto flex cursor-pointer items-center gap-2.5 rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] px-9 py-2 font-['Crimson_Text',serif] text-[15px] font-semibold text-[#b9852a] transition hover:bg-[#fff4d9]"
      >
        <PlayIcon className="h-4 w-4" />
        {am ? 'ሁሉንም አጫውት' : 'Play All'}
      </button>
    </div>
  );
}