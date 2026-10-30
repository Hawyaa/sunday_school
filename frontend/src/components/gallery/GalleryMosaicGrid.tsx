'use client';

/**
 * GalleryMosaicGrid.tsx
 *
 * Exact implementation of the Mosaic Gallery Grid & Featured Album:
 * - 4-column x 3-row layout with gold bordered mosaic items (.mosaic-item)
 * - Exact item positions:
 *   .item-1: grid 1 / 2, row 1 / 3 (Tall Left)
 *   .item-2: grid 2 / 4, row 1 / 2 (Wide Top Center)
 *   .item-3: grid 2 / 3, row 2 / 3 (Mid Center Left)
 *   .item-4: grid 3 / 4, row 2 / 3 (Mid Center Right)
 *   .item-5: grid 4 / 5, row 1 / 3 (Tall Right)
 *   .item-6: grid 1 / 2, row 3 / 4 (Bottom Left)
 *   .item-7: grid 2 / 3, row 3 / 4 (Bottom Mid Left)
 * - Featured Album Box (.featured-card-wrapper, grid 3 / 5, row 3 / 4)
 * - Full interactive Lightbox modal on image click
 * - Connected to live synchronized store (contentStore)
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
  getStoredGalleryMosaic,
  getStoredFeaturedAlbum,
  GalleryMosaicItem,
  FeaturedAlbumData,
} from '@/lib/contentStore';

export function GalleryMosaicGrid() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [mosaicItems, setMosaicItems] = useState<GalleryMosaicItem[]>(() =>
    getStoredGalleryMosaic()
  );
  const [featuredAlbum, setFeaturedAlbum] = useState<FeaturedAlbumData>(() =>
    getStoredFeaturedAlbum()
  );
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string; title: string } | null>(
    null
  );

  useEffect(() => {
    const handleUpdate = () => {
      setMosaicItems(getStoredGalleryMosaic());
      setFeaturedAlbum(getStoredFeaturedAlbum());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, []);

  const slot1 = mosaicItems.find((i) => i.slot === 1) || mosaicItems[0];
  const slot2 = mosaicItems.find((i) => i.slot === 2) || mosaicItems[1];
  const slot3 = mosaicItems.find((i) => i.slot === 3) || mosaicItems[2];
  const slot4 = mosaicItems.find((i) => i.slot === 4) || mosaicItems[3];
  const slot5 = mosaicItems.find((i) => i.slot === 5) || mosaicItems[4];
  const slot6 = mosaicItems.find((i) => i.slot === 6) || mosaicItems[5];
  const slot7 = mosaicItems.find((i) => i.slot === 7) || mosaicItems[6];

  return (
    <section className="max-w-[1280px] w-full mx-auto px-6 sm:px-9 my-8">
      {/* 
        Responsive Mosaic Grid:
        - Mobile/Tablet: 2-column flow
        - Desktop (lg): 4-column exact 150px 150px 160px row tracks
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_0.75fr_0.75fr_1fr] lg:grid-rows-[150px_150px_160px] gap-4">
        {/* Item 1: Tall Left (grid 1/2, row 1/3) */}
        {slot1 && (
          <div
            onClick={() =>
              setActiveImage({
                src: slot1.src,
                alt: slot1.alt,
                title: isAm ? slot1.titleAm : slot1.titleEn,
              })
            }
            className="relative rounded-[14px] overflow-hidden border-2 border-[#C99A3B] shadow-[0_4px_12px_rgba(15,27,62,0.08)] bg-[#EAE6DF] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.15)] transition-all cursor-pointer h-60 sm:h-auto lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 group"
          >
            <img
              src={slot1.src}
              alt={slot1.alt}
              className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-semibold">
                {isAm ? slot1.titleAm : slot1.titleEn}
              </span>
            </div>
          </div>
        )}

        {/* Item 2: Wide Top Center (grid 2/4, row 1/2) */}
        {slot2 && (
          <div
            onClick={() =>
              setActiveImage({
                src: slot2.src,
                alt: slot2.alt,
                title: isAm ? slot2.titleAm : slot2.titleEn,
              })
            }
            className="relative rounded-[14px] overflow-hidden border-2 border-[#C99A3B] shadow-[0_4px_12px_rgba(15,27,62,0.08)] bg-[#EAE6DF] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.15)] transition-all cursor-pointer h-48 sm:h-auto lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-2 group"
          >
            <img
              src={slot2.src}
              alt={slot2.alt}
              className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-semibold">
                {isAm ? slot2.titleAm : slot2.titleEn}
              </span>
            </div>
          </div>
        )}

        {/* Item 3: Mid Center Left (grid 2/3, row 2/3) */}
        {slot3 && (
          <div
            onClick={() =>
              setActiveImage({
                src: slot3.src,
                alt: slot3.alt,
                title: isAm ? slot3.titleAm : slot3.titleEn,
              })
            }
            className="relative rounded-[14px] overflow-hidden border-2 border-[#C99A3B] shadow-[0_4px_12px_rgba(15,27,62,0.08)] bg-[#EAE6DF] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.15)] transition-all cursor-pointer h-44 sm:h-auto lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3 group"
          >
            <img
              src={slot3.src}
              alt={slot3.alt}
              className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-semibold">
                {isAm ? slot3.titleAm : slot3.titleEn}
              </span>
            </div>
          </div>
        )}

        {/* Item 4: Mid Center Right (grid 3/4, row 2/3) */}
        {slot4 && (
          <div
            onClick={() =>
              setActiveImage({
                src: slot4.src,
                alt: slot4.alt,
                title: isAm ? slot4.titleAm : slot4.titleEn,
              })
            }
            className="relative rounded-[14px] overflow-hidden border-2 border-[#C99A3B] shadow-[0_4px_12px_rgba(15,27,62,0.08)] bg-[#EAE6DF] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.15)] transition-all cursor-pointer h-44 sm:h-auto lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3 group"
          >
            <img
              src={slot4.src}
              alt={slot4.alt}
              className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-semibold">
                {isAm ? slot4.titleAm : slot4.titleEn}
              </span>
            </div>
          </div>
        )}

        {/* Item 5: Tall Right (grid 4/5, row 1/3) */}
        {slot5 && (
          <div
            onClick={() =>
              setActiveImage({
                src: slot5.src,
                alt: slot5.alt,
                title: isAm ? slot5.titleAm : slot5.titleEn,
              })
            }
            className="relative rounded-[14px] overflow-hidden border-2 border-[#C99A3B] shadow-[0_4px_12px_rgba(15,27,62,0.08)] bg-[#EAE6DF] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.15)] transition-all cursor-pointer h-60 sm:h-auto lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3 group"
          >
            <img
              src={slot5.src}
              alt={slot5.alt}
              className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-semibold">
                {isAm ? slot5.titleAm : slot5.titleEn}
              </span>
            </div>
          </div>
        )}

        {/* Item 6: Bottom Left (grid 1/2, row 3/4) */}
        {slot6 && (
          <div
            onClick={() =>
              setActiveImage({
                src: slot6.src,
                alt: slot6.alt,
                title: isAm ? slot6.titleAm : slot6.titleEn,
              })
            }
            className="relative rounded-[14px] overflow-hidden border-2 border-[#C99A3B] shadow-[0_4px_12px_rgba(15,27,62,0.08)] bg-[#EAE6DF] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.15)] transition-all cursor-pointer h-44 sm:h-auto lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4 group"
          >
            <img
              src={slot6.src}
              alt={slot6.alt}
              className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-semibold">
                {isAm ? slot6.titleAm : slot6.titleEn}
              </span>
            </div>
          </div>
        )}

        {/* Item 7: Bottom Mid Left (grid 2/3, row 3/4) */}
        {slot7 && (
          <div
            onClick={() =>
              setActiveImage({
                src: slot7.src,
                alt: slot7.alt,
                title: isAm ? slot7.titleAm : slot7.titleEn,
              })
            }
            className="relative rounded-[14px] overflow-hidden border-2 border-[#C99A3B] shadow-[0_4px_12px_rgba(15,27,62,0.08)] bg-[#EAE6DF] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.15)] transition-all cursor-pointer h-44 sm:h-auto lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4 group"
          >
            <img
              src={slot7.src}
              alt={slot7.alt}
              className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-semibold">
                {isAm ? slot7.titleAm : slot7.titleEn}
              </span>
            </div>
          </div>
        )}

        {/* Featured Bottom Card (grid 3/5, row 3/4) */}
        <div className="bg-white rounded-[14px] border border-[#E8EEF5] shadow-[0_4px_16px_rgba(15,27,62,0.05)] p-3 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-center overflow-hidden lg:col-start-3 lg:col-end-5 lg:row-start-3 lg:row-end-4">
          <div
            onClick={() =>
              setActiveImage({
                src: featuredAlbum.coverSrc,
                alt: featuredAlbum.titleEn,
                title: isAm ? featuredAlbum.titleAm : featuredAlbum.titleEn,
              })
            }
            className="w-full h-[136px] rounded-[10px] overflow-hidden shrink-0 bg-slate-100 cursor-pointer"
          >
            <img
              src={featuredAlbum.coverSrc}
              alt="Featured Album Main"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex flex-col justify-between h-full py-1 pr-1 min-w-0">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1B3E] mb-0.5 truncate">
                {isAm ? featuredAlbum.titleAm : featuredAlbum.titleEn}
              </h3>
              <div className="text-xs text-[#505E7B] mb-2.5 font-medium">
                {featuredAlbum.dateStr}
              </div>

              {/* Thumbs Strip - Dynamic display of all album photos */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full [scrollbar-width:thin] [scrollbar-color:#c8952f_transparent]">
                {featuredAlbum.thumbnails.map((thumb, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setActiveImage({
                        src: thumb,
                        alt: `Album Photo ${idx + 1}`,
                        title: `${isAm ? featuredAlbum.titleAm : featuredAlbum.titleEn} (${idx + 1})`,
                      })
                    }
                    className="w-[38px] h-[34px] rounded-md overflow-hidden bg-[#D9D9D9] shrink-0 cursor-pointer hover:opacity-80 transition-all hover:scale-105 border border-[#ece5d8]"
                  >
                    <img
                      src={thumb}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F4F9]">
              <button
                type="button"
                onClick={() =>
                  setActiveImage({
                    src: featuredAlbum.coverSrc,
                    alt: featuredAlbum.titleEn,
                    title: `${isAm ? featuredAlbum.titleAm : featuredAlbum.titleEn} (Cover)`,
                  })
                }
                className="text-[11px] font-semibold text-[#C99A3B] hover:underline cursor-pointer"
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

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-transparent rounded-2xl overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-3 text-center">
              <p className="text-white text-sm font-semibold">{activeImage.title}</p>
            </div>
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
