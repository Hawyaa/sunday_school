'use client';

/**
 * FeaturedAlbumBlock.tsx
 *
 * Highlighted featured album preview block with multi-image gallery teaser.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import type { GalleryAlbum } from '@/types/gallery';

interface Props {
  album: GalleryAlbum;
}

export function FeaturedAlbumBlock({ album }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <div className="bg-white rounded-3xl border border-[#E3EEF8] overflow-hidden shadow-[0_4px_20px_rgba(30,42,94,0.06)] hover:border-[#C99A3B] transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Main Cover Image */}
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] overflow-hidden bg-slate-100 group">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2A5E]/80 via-transparent to-black/20" />

          {/* Top Badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E2A5E]/90 text-[#C99A3B] border border-[#C99A3B] text-xs font-bold shadow-md">
            <span>✨</span>
            <span>{isAm ? 'ተለይቶ የቀረበ ማህደር' : 'Featured Album'}</span>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs uppercase tracking-wider text-[#C99A3B] font-bold">
              {isAm ? album.categoryAm : album.category}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-1 text-white">
              {isAm ? album.titleAm : album.title}
            </h2>
          </div>
        </div>

        {/* Right: Album Details & Preview Grid */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white to-[#FBF7F0]">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8A6414] font-semibold mb-3">
              <span>📅 {album.date}</span>
              <span className="bg-[#E3EEF8] text-[#1E2A5E] px-2.5 py-1 rounded-md font-bold">
                📷 {album.photoCount} {isAm ? 'ፎቶዎች' : 'Photos'}
              </span>
            </div>

            <p className="text-sm text-[#44506B] leading-relaxed mb-6">
              {isAm ? album.descriptionAm : album.description}
            </p>

            {/* Thumbnail previews */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {album.previewImages.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-4/3 rounded-xl overflow-hidden border border-[#E3EEF8] group"
                >
                  <img
                    src={src}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  {i === album.previewImages.length - 1 && (
                    <div className="absolute inset-0 bg-[#1E2A5E]/80 flex items-center justify-center text-white text-xs font-extrabold">
                      +{album.photoCount - album.previewImages.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              className="w-full py-3 px-5 rounded-xl bg-[#1E2A5E] hover:bg-[#2F5D9E] text-white border-2 border-[#C99A3B] text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🖼️</span>
              <span>
                {isAm ? 'ሁሉንም ፎቶዎች ይመልከቱ' : 'View Full Album'} ({album.photoCount})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
