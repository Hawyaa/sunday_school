'use client';

/**
 * Gallery Album Detail Page (/gallery/album)
 *
 * Displays the Featured Album's full photo collection with:
 * - Cover image hero with album title and date
 * - Responsive photo grid (all album thumbnails)
 * - Lightbox modal on photo click with prev/next navigation
 * - Live-synced from contentStore (abune_content_store_updated event)
 * - Back to Gallery navigation
 */

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import {
  getStoredFeaturedAlbum,
  FeaturedAlbumData,
  INITIAL_FEATURED_ALBUM,
} from '@/lib/contentStore';

export default function GalleryAlbumPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [album, setAlbum] = useState<FeaturedAlbumData>(INITIAL_FEATURED_ALBUM);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* ── Live sync with contentStore ── */
  useEffect(() => {
    // Sync client-side localStorage after hydration to avoid SSR mismatch
    setAlbum(getStoredFeaturedAlbum());

    const handleUpdate = () => setAlbum(getStoredFeaturedAlbum());
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => window.removeEventListener('abune_content_store_updated', handleUpdate);
  }, []);

  /* ── Lightbox navigation ── */
  const allPhotos = [album.coverSrc, ...album.thumbnails];

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + allPhotos.length) % allPhotos.length));
  }, [allPhotos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % allPhotos.length));
  }, [allPhotos.length]);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, goPrev, goNext]);

  const title = isAm ? album.titleAm : album.titleEn;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF]">
      {/* Header */}
      <Header />

      {/* ── Hero Banner ── */}
      <div className="relative w-full h-[280px] sm:h-[360px] overflow-hidden">
        <img
          src={album.coverSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1b3e]/90 via-[#0f1b3e]/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-5 left-5">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold hover:bg-white/20 transition"
          >
            ← {isAm ? 'ወደ ጋለሪ ተመለስ' : 'Back to Gallery'}
          </Link>
        </div>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-8">
          <div className="max-w-[1200px] mx-auto">
            <span className="inline-block text-[#C99A3B] text-xs font-bold uppercase tracking-widest mb-2">
              ✨ {isAm ? 'ተለይቶ የቀረበ ማህደር' : 'Featured Album'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {title}
            </h1>
            <p className="text-[#C99A3B] text-sm font-semibold mt-1">
              📅 {album.dateStr} &nbsp;·&nbsp; 📷 {allPhotos.length}{' '}
              {isAm ? 'ፎቶዎች' : 'Photos'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Photo Grid ── */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-5 sm:px-8 py-10">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F1B3E] mb-6 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-[#C99A3B] inline-block" />
          {isAm ? 'ሁሉም ፎቶዎች' : 'All Photos'}
        </h2>

        {allPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#8A9BB5]">
            <span className="text-5xl mb-4">🖼️</span>
            <p className="text-base font-semibold">
              {isAm ? 'ፎቶዎች አልተጨመሩም' : 'No photos added yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {allPhotos.map((src, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className={`relative rounded-xl overflow-hidden border-2 cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.18)] bg-[#EAE6DF] ${
                  idx === 0
                    ? 'border-[#C99A3B] col-span-2 sm:col-span-2 row-span-1 aspect-video'
                    : 'border-[#E3D8C5] aspect-square'
                }`}
              >
                <img
                  src={src}
                  alt={`${title} — photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Cover badge */}
                {idx === 0 && (
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#C99A3B] text-white text-[10px] font-bold shadow">
                    {isAm ? 'ሽፋን' : 'Cover'}
                  </div>
                )}
                {/* Hover dim */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {/* Back link bottom */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#C99A3B] text-[#C99A3B] font-bold text-sm hover:bg-[#C99A3B] hover:text-white transition-all"
          >
            ← {isAm ? 'ወደ ጋለሪ ተመለስ' : 'Back to Gallery'}
          </Link>
        </div>
      </main>

      {/* ── Lightbox Modal ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative flex flex-col items-center max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <img
              src={allPhotos[lightboxIndex]}
              alt={`${title} — photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Caption */}
            <p className="mt-3 text-white/80 text-sm font-semibold">
              {lightboxIndex === 0
                ? (isAm ? 'ሽፋን ፎቶ' : 'Cover Photo')
                : `${isAm ? 'ፎቶ' : 'Photo'} ${lightboxIndex} / ${allPhotos.length - 1}`}
            </p>

            {/* Thumbnail strip */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full px-2 py-1 [scrollbar-width:thin] [scrollbar-color:#c8952f_transparent]">
              {allPhotos.map((thumb, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-12 h-10 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                    i === lightboxIndex
                      ? 'border-[#C99A3B] scale-110 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Prev / Next */}
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 text-white text-xl flex items-center justify-center transition"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 text-white text-xl flex items-center justify-center transition"
            >
              ›
            </button>

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-0 right-0 -translate-y-2 translate-x-2 sm:translate-x-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
