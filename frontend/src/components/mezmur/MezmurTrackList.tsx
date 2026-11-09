'use client';

/**
 * MezmurTrackList.tsx
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import type { MezmurTrack } from '@/types/mezmur';

interface Props {
  tracks: MezmurTrack[];
  isLoading?: boolean;
}

export function MezmurTrackList({ tracks, isLoading }: Props) {
  const { locale } = useAppStore();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E3EEF8] rounded-xl p-4 flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#E3EEF8]" />
              <div className="space-y-2">
                <div className="h-4 bg-[#E3EEF8] rounded w-36" />
                <div className="h-3 bg-[#E3EEF8] rounded w-20" />
              </div>
            </div>
            <div className="h-4 bg-[#E3EEF8] rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E3EEF8] p-8 text-center text-[#44506B] text-sm">
        {locale === 'am' ? 'ምንም መዝሙር አልተገኘም።' : 'No mezmur found.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tracks.map((track) => (
        <Link
          key={track.id}
          href={`/mezmur/${track.id}`}
          className="bg-white border border-[#E3EEF8] hover:border-[#C99A3B] rounded-xl px-5 py-3.5 flex items-center justify-between transition-all hover:bg-[#F4F8FC] hover:-translate-y-0.5 shadow-[0_2px_6px_rgba(30,42,94,0.02)] group no-underline"
        >
          {/* Left info */}
          <div className="flex items-center gap-4 min-w-0 pr-3">
            <div className="w-11 h-11 bg-[#1E2A5E] text-white border-[1.5px] border-[#C99A3B] rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
              🎵
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-extrabold text-[#1E2A5E] mb-0.5 truncate group-hover:text-[#2F5D9E] transition-colors">
                {locale === 'am' && track.titleAm ? track.titleAm : track.title}
              </h4>
              <span className="bg-[#E3EEF8] text-[#2F5D9E] text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-block">
                {track.category}
              </span>
            </div>
          </div>

          {/* Right meta */}
          <div className="flex items-center gap-5 text-[13px] text-[#44506B] font-semibold shrink-0">
            <span>{track.duration}</span>
            <span className="text-xl text-[#2F5D9E] font-bold group-hover:translate-x-1 transition-transform">
              ›
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
