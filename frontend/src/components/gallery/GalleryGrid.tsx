'use client';

/**
 * GalleryGrid.tsx
 *
 * Responsive grid of gallery albums with interactive photo lightbox modal.
 */

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { GalleryCard } from './GalleryCard';
import type { GalleryAlbum } from '@/types/gallery';

interface Props {
  albums: GalleryAlbum[];
}

export function GalleryGrid({ albums }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [activeModalAlbum, setActiveModalAlbum] = useState<GalleryAlbum | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <GalleryCard
            key={album.id}
            album={album}
            onOpen={setActiveModalAlbum}
          />
        ))}
      </div>

      {/* Lightbox / Album Modal Dialog */}
      {activeModalAlbum && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border-2 border-[#C99A3B] relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalAlbum(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-[#E3EEF8] bg-[#FBF7F0]">
              <span className="text-xs uppercase tracking-wider text-[#8A6414] font-bold">
                {isAm ? activeModalAlbum.categoryAm : activeModalAlbum.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E2A5E] mt-1">
                {isAm ? activeModalAlbum.titleAm : activeModalAlbum.title}
              </h3>
              <p className="text-xs text-[#44506B] mt-1">
                📅 {activeModalAlbum.date} • 📷 {activeModalAlbum.photoCount} {isAm ? 'ፎቶዎች' : 'Photos'}
              </p>
            </div>

            {/* Main Modal Image */}
            <div className="relative aspect-16/9 bg-slate-900">
              <img
                src={activeModalAlbum.coverUrl}
                alt={activeModalAlbum.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Body & Thumbnails */}
            <div className="p-6 sm:p-7 space-y-5">
              <p className="text-sm text-[#44506B] leading-relaxed">
                {isAm ? activeModalAlbum.descriptionAm : activeModalAlbum.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E2A5E] mb-3">
                  {isAm ? 'የተመረጡ ፎቶዎች' : 'Preview Images'}
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[activeModalAlbum.coverUrl, ...activeModalAlbum.previewImages].map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden border border-[#E3EEF8]"
                    >
                      <img
                        src={img}
                        alt="Gallery preview"
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalAlbum(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1E2A5E] text-white text-xs font-bold hover:bg-[#2F5D9E] transition"
                >
                  {isAm ? 'ዝጋ' : 'Close Preview'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
