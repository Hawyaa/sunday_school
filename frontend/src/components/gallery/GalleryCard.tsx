'use client';

/**
 * GalleryCard.tsx
 *
 * Individual album card with image hover effect, category tag, and photo count.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import type { GalleryAlbum } from '@/types/gallery';

interface Props {
  album: GalleryAlbum;
  onOpen?: (album: GalleryAlbum) => void;
}

export function GalleryCard({ album, onOpen }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <div
      onClick={() => onOpen?.(album)}
      className="bg-white rounded-2xl border border-[#E3EEF8] overflow-hidden hover:border-[#C99A3B] transition-all shadow-[0_2px_10px_rgba(30,42,94,0.03)] hover:shadow-[0_8px_24px_rgba(30,42,94,0.08)] hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Category Pill Top Left */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1E2A5E]/85 text-white border border-[#C99A3B]/60 text-[11px] font-bold backdrop-blur-xs">
            {isAm ? album.categoryAm : album.category}
          </div>

          {/* Photo Count Pill Top Right */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1">
            <span>📷</span>
            <span>{album.photoCount}</span>
          </div>

          {/* Date Bottom Left */}
          <div className="absolute bottom-3 left-3 text-white text-xs font-medium">
            {album.date}
          </div>
        </div>

        {/* Content details */}
        <div className="p-5">
          <h3 className="text-base font-extrabold text-[#1E2A5E] group-hover:text-[#2F5D9E] transition-colors mb-2 line-clamp-2">
            {isAm ? album.titleAm : album.title}
          </h3>
          <p className="text-xs text-[#44506B] line-clamp-2 leading-relaxed">
            {isAm ? album.descriptionAm : album.description}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <div className="w-full py-2.5 px-4 rounded-xl bg-[#E3EEF8] group-hover:bg-[#1E2A5E] text-[#1E2A5E] group-hover:text-white border border-[#C99A3B] text-xs font-bold transition flex items-center justify-center gap-1.5">
          <span>🖼️</span>
          <span>{isAm ? 'አልበሙን ክፈት' : 'Open Album'}</span>
        </div>
      </div>
    </div>
  );
}
