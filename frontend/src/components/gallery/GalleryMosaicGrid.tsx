'use client';

/**
 * GalleryMosaicGrid.tsx
 *
 * Mosaic Gallery Grid & Featured Album (layout, sizes, borders, colours unchanged):
 * - 4-column x 3-row layout with gold bordered mosaic tiles
 *   slot 1: grid 1 / 2, rows 1 / 3 (Tall Left)       -> large: zoom reveal + parallax
 *   slot 2: grid 2 / 4, row 1 / 2   (Wide Top Center) -> wide: left-to-right reveal
 *   slot 3: grid 2 / 3, row 2 / 3   (Mid Center Left) -> small: staggered fade up
 *   slot 4: grid 3 / 4, row 2 / 3   (Mid Center Right)-> small: staggered fade up
 *   slot 5: grid 4 / 5, rows 1 / 3  (Tall Right)      -> tall: slide up + fade, parallax
 *   slot 6: grid 1 / 2, row 3 / 4   (Bottom Left)     -> small: staggered fade up
 *   slot 7: grid 2 / 3, row 3 / 4   (Bottom Mid Left) -> small: staggered fade up
 * - Featured Album card (grid 3 / 5, row 3 / 4)
 * - Premium lightbox (see GalleryLightbox.tsx)
 * - Connected to the live synchronized store (contentStore)
 * Motion CSS: gallery-animations.css · hooks: useGalleryMotion.ts
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  getStoredGalleryMosaic,
  getStoredFeaturedAlbum,
  GalleryMosaicItem,
  FeaturedAlbumData,
  INITIAL_GALLERY_MOSAIC,
  INITIAL_FEATURED_ALBUM,
} from '@/lib/contentStore';
import { GalleryLightbox, type LightboxItem } from '@/components/gallery/GalleryLightbox';
import { useScrollReveal, useParallax } from '@/components/gallery/useGalleryMotion';

type Kind = 'zoom' | 'slide' | 'wipe' | 'up';

interface TileDef {
  slot: number;
  kind: Kind;
  parallax?: boolean;
  /** original sizing + grid placement classes, unchanged */
  cls: string;
}

const TILES: TileDef[] = [
  { slot: 1, kind: 'zoom', parallax: true, cls: 'h-60 sm:h-auto lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3' },
  { slot: 2, kind: 'wipe', cls: 'h-48 sm:h-auto lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-2' },
  { slot: 3, kind: 'up', cls: 'h-44 sm:h-auto lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3' },
  { slot: 4, kind: 'up', cls: 'h-44 sm:h-auto lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3' },
  { slot: 5, kind: 'slide', parallax: true, cls: 'h-60 sm:h-auto lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3' },
  { slot: 6, kind: 'up', cls: 'h-44 sm:h-auto lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4' },
  { slot: 7, kind: 'up', cls: 'h-44 sm:h-auto lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4' },
];

const ViewIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5" />
  </svg>
);

export function GalleryMosaicGrid() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';
  const router = useRouter();

  const [mosaicItems, setMosaicItems] = useState<GalleryMosaicItem[]>(INITIAL_GALLERY_MOSAIC);
  const [featuredAlbum, setFeaturedAlbum] = useState<FeaturedAlbumData>(INITIAL_FEATURED_ALBUM);
  const [lightbox, setLightbox] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);
  useParallax(rootRef);

  useEffect(() => {
    // Sync initial client-side localStorage after hydration to avoid SSR mismatch
    setMosaicItems(getStoredGalleryMosaic());
    setFeaturedAlbum(getStoredFeaturedAlbum());

    const handleUpdate = () => {
      setMosaicItems(getStoredGalleryMosaic());
      setFeaturedAlbum(getStoredFeaturedAlbum());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, []);

  const tiles = useMemo(
    () =>
      TILES.map((t) => ({ ...t, item: mosaicItems.find((i) => i.slot === t.slot) || mosaicItems[t.slot - 1] })).filter(
        (t): t is TileDef & { item: GalleryMosaicItem } => !!t.item,
      ),
    [mosaicItems],
  );

  const mosaicLightboxItems: LightboxItem[] = useMemo(
    () => tiles.map((t) => ({ src: t.item.src, alt: t.item.alt, title: isAm ? t.item.titleAm : t.item.titleEn })),
    [tiles, isAm],
  );

  const albumTitle = isAm ? featuredAlbum.titleAm : featuredAlbum.titleEn;
  const albumLightboxItems: LightboxItem[] = useMemo(
    () =>
      featuredAlbum.thumbnails.map((thumb, idx) => ({
        src: thumb,
        alt: `Album Photo ${idx + 1}`,
        title: `${albumTitle} (${idx + 1})`,
      })),
    [featuredAlbum.thumbnails, albumTitle],
  );

  return (
    <section ref={rootRef} className="max-w-[1280px] w-full mx-auto px-6 sm:px-9 my-8">
      {/*
        Responsive Mosaic Grid:
        - Mobile/Tablet: 2-column flow
        - Desktop (lg): 4-column exact 150px 150px 160px row tracks
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_0.75fr_0.75fr_1fr] lg:grid-rows-[150px_150px_160px] gap-4">
        {tiles.map((t, i) => {
          const title = isAm ? t.item.titleAm : t.item.titleEn;
          const open = () => setLightbox({ items: mosaicLightboxItems, index: i });
          return (
            <div
              key={t.slot}
              role="button"
              tabIndex={0}
              aria-label={`${title} — ${isAm ? 'ፎቶ ይመልከቱ' : 'View photo'}`}
              data-gl-reveal="tile"
              onClick={open}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  open();
                }
              }}
              className={`gl-tile gl-t-${t.kind} relative rounded-[14px] overflow-hidden border-2 border-[#C99A3B] shadow-[0_4px_12px_rgba(15,27,62,0.08)] bg-[#EAE6DF] cursor-pointer outline-hidden ${t.cls}`}
            >
              <div className="gl-par" data-gl-parallax={t.parallax ? '' : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.item.src}
                  alt={t.item.alt}
                  decoding="async"
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="gl-img w-full h-full object-cover block"
                />
              </div>

              {/* hover: soft dark overlay + caption, view icon, gold corner details */}
              <div className="gl-overlay absolute inset-0 pointer-events-none flex items-end p-3">
                <span className="text-white text-xs font-semibold">{title}</span>
              </div>
              <div className="gl-view" aria-hidden="true">
                <ViewIcon />
              </div>
              <div className="gl-brackets" aria-hidden="true" />
            </div>
          );
        })}

        {/* Featured Bottom Card (grid 3/5, row 3/4) */}
        <div
          data-gl-reveal="card"
          className="gl-card bg-white rounded-[14px] border border-[#E8EEF5] shadow-[0_4px_16px_rgba(15,27,62,0.05)] p-3 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-center overflow-hidden lg:col-start-3 lg:col-end-5 lg:row-start-3 lg:row-end-4"
        >
          {/* Clicking the cover image navigates to the full album page */}
          <div
            onClick={() => router.push('/gallery/album')}
            className="gl-cover-wrap w-full h-[136px] rounded-[10px] overflow-hidden shrink-0 bg-slate-100 cursor-pointer group relative"
            title={isAm ? 'ሁሉንም ፎቶዎች ይመልከቱ' : 'View Full Album'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredAlbum.coverSrc}
              alt="Featured Album Main"
              decoding="async"
              loading="lazy"
              className="gl-cover w-full h-full object-cover"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-[#0F1B3E]/0 group-hover:bg-[#0F1B3E]/40 transition-colors flex items-center justify-center">
              <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-[#C99A3B]/90 px-3 py-1 rounded-full">
                {isAm ? 'ሁሉንም ይመልከቱ' : 'View All'}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full py-1 pr-1 min-w-0">
            <div>
              <div className="gl-album-title">
                <h3 className="text-base font-extrabold text-[#0F1B3E] mb-0.5 truncate">{albumTitle}</h3>
                <div className="text-xs text-[#505E7B] mb-2.5 font-medium">{featuredAlbum.dateStr}</div>
              </div>

              {/* Thumbs Strip - Dynamic display of all album photos */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full [scrollbar-width:thin] [scrollbar-color:#c8952f_transparent]">
                {featuredAlbum.thumbnails.map((thumb, idx) => (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    aria-label={`${albumTitle} (${idx + 1})`}
                    style={{ '--k': Math.min(idx, 8) } as React.CSSProperties}
                    onClick={() => setLightbox({ items: albumLightboxItems, index: idx })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setLightbox({ items: albumLightboxItems, index: idx });
                      }
                    }}
                    className="gl-thumb w-[38px] h-[34px] rounded-md overflow-hidden bg-[#D9D9D9] shrink-0 cursor-pointer hover:opacity-80 transition-all hover:scale-105 border border-[#ece5d8] outline-hidden focus-visible:ring-2 focus-visible:ring-[#C99A3B]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb} alt={`Thumb ${idx + 1}`} decoding="async" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F4F9]">
              <button
                type="button"
                onClick={() => router.push('/gallery/album')}
                className="gl-link text-[11px] font-semibold text-[#C99A3B] cursor-pointer outline-hidden"
              >
                {isAm ? 'የተሟላ አልበም' : 'Complete Album'}
              </button>
              <span className="text-[11px] text-[#7C88A8] font-medium">
                {featuredAlbum.thumbnails.length} {isAm ? 'ፎቶዎች' : 'photos'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <GalleryLightbox
          items={lightbox.items}
          index={lightbox.index}
          isAm={isAm}
          onIndexChange={(index) => setLightbox((l) => (l ? { ...l, index } : l))}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
