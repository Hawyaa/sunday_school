'use client';

/**
 * MezmurLyricCard.tsx — "Featured Lyric Text" (middle column).
 * Includes interactive Audio player for uploaded mezmur recordings.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { BookIcon, Divider, MusicIcon } from '@/components/reports/icons';
import { Corners, ShareIcon } from '@/components/mezmur/icons';
import type { MezmurItem } from '@/components/mezmur/mezmurData';

interface Props {
  item: MezmurItem;
}

export function MezmurLyricCard({ item }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const share = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/mezmur/${item.id}` : '';
    try {
      if (navigator.share) await navigator.share({ title: item.title, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="relative flex h-full flex-col rounded-xl border border-[#ecdcb8] bg-[#fffdf9] px-6 pb-7 pt-4 text-center shadow-[0_3px_14px_rgba(15,35,82,0.05)]">
      <Corners size={38} inset={4} />

      {/* Header */}
      <div className="relative mb-4 flex items-center justify-between border-b border-[#f0e6d0] pb-3 pl-6">
        <div className="flex items-center gap-3 font-['Crimson_Text',serif] text-[16px] font-semibold text-[#0f2352]">
          <MusicIcon className="h-5 w-5 text-[#b9852a]" />
          {am ? 'የተመረጠ የመዝሙር ግጥም' : 'Featured Lyric Text'}
        </div>
        <button
          type="button"
          onClick={share}
          aria-label={am ? 'አጋራ' : 'Share'}
          className="mr-6 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[#ece5d8] bg-white text-[#b9852a] shadow-sm transition hover:border-[#c8952f]"
        >
          <ShareIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-['Noto_Serif_Ethiopic','Playfair_Display',serif] text-[26px] font-bold leading-[1.3] text-[#0f2352]">
        {item.title}
      </h3>
      {!am && <p className="mt-1 font-['Crimson_Text',serif] text-[17px] text-[#35496b]">({item.titleEn})</p>}

      {/* Audio Player Bar */}
      {item.audioUrl ? (
        <div className="mx-auto my-3 w-full max-w-[420px] rounded-xl bg-[#FAF4E6] border border-[#E9D9B2] p-3 shadow-xs text-left">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#0F1B3E]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#137333] animate-pulse"></span>
              {am ? 'የተቀዳ መዝሙር (ኦዲዮ)' : 'Mezmur Audio Recording'}
            </span>
            <span className="text-[11px] text-[#8B6E32] font-semibold truncate max-w-[180px]">
              {item.audioName || (am ? 'ያዳምጡ' : 'Listen Now')}
            </span>
          </div>
          <audio
            controls
            key={item.id + (item.audioUrl || '')}
            src={item.audioUrl}
            className="w-full h-8 rounded-lg focus:outline-none"
          />
        </div>
      ) : (
        <div className="mx-auto my-2 text-center text-xs text-[#7C88A8] italic">
          {am ? 'ለዚህ መዝሙር እስካሁን የተቀዳ ድምፅ አልተያያዘም' : 'No audio recording attached yet'}
        </div>
      )}

      <Divider className="mx-auto my-3 w-[110px]" />

      {/* Lyrics */}
      <div className="mx-auto flex-1 space-y-1.5 font-['Noto_Serif_Ethiopic','Crimson_Text',serif] text-[16px] leading-[1.7] text-[#1c2740]">
        {item.lyrics.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <Divider className="mx-auto my-4 w-[110px]" />

      <Link
        href={`/mezmur/${item.id}`}
        className="mx-auto flex items-center gap-2.5 rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] px-8 py-2.5 font-['Crimson_Text',serif] text-[15px] font-semibold text-[#b9852a] transition hover:bg-[#fff4d9]"
      >
        <BookIcon className="h-[18px] w-[18px]" />
        {am ? 'ሙሉ ግጥም ይመልከቱ' : 'View Full Lyrics'}
      </Link>
    </div>
  );
}
