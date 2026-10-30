'use client';

/**
 * MezmurPageView.tsx
 *
 * Implements the exact user requested experience:
 * 1. Default View: Student browsing list formatted like Image 1, filterable by Category & Search.
 * 2. Detail View: When student clicks on any mezmur, transitions to Image 2 (Spotlight album on left + Lyric card & sound player on right).
 * 3. Dynamic Categories: Categories are managed by the admin and updated in real-time.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MezmurHero } from '@/components/mezmur/MezmurHero';
import { MezmurFilterBar, type MezmurSort } from '@/components/mezmur/MezmurFilterBar';
import { MezmurSpotlightCard } from '@/components/mezmur/MezmurSpotlightCard';
import { MezmurLyricCard } from '@/components/mezmur/MezmurLyricCard';
import { Corners } from '@/components/mezmur/icons';
import { ChevronRight, MusicIcon } from '@/components/reports/icons';
import { MezmurItem, MezmurCategory, CATEGORIES } from '@/components/mezmur/mezmurData';
import { getStoredMezmurs, getStoredMezmurCategories } from '@/lib/contentStore';

interface Props {
  items?: MezmurItem[];
  initialSelectedId?: string;
}

const fmt = (iso: string) => {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

export function MezmurPageView({ items: initialItems, initialSelectedId }: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const [items, setItems] = useState<MezmurItem[]>(() => initialItems || getStoredMezmurs());
  const [categories, setCategories] = useState<MezmurCategory[]>(() => getStoredMezmurCategories());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<MezmurSort>('newest');

  // Selected mezmur ID for Image 2 view; null shows Image 1 list
  const [selectedMezmurId, setSelectedMezmurId] = useState<string | null>(initialSelectedId || null);

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredMezmurs());
      setCategories(getStoredMezmurCategories());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, []);

  // Filter & sort mezmurs
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter((m) => {
      if (category !== 'all' && m.category !== category) return false;
      if (q && !`${m.title} ${m.titleEn} ${m.lyrics.join(' ')}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });

    const t = (m: MezmurItem) => new Date(m.addedAt).getTime() || 0;
    return [...list].sort((a, b) => (sort === 'newest' ? t(b) - t(a) : t(a) - t(b)));
  }, [items, search, category, sort]);

  const activeMezmur = items.find((m) => m.id === selectedMezmurId) || null;

  const currentCatObj = categories.find((c) => c.key === category);
  const currentCatLabel =
    category === 'all'
      ? am
        ? 'ሁሉም መዝሙራት (All Mezmurs)'
        : 'All Mezmurs'
      : currentCatObj
      ? am
        ? currentCatObj.am
        : currentCatObj.en
      : category;

  return (
    <div className="bg-[#f7f1e6] font-['Crimson_Text',Georgia,serif] text-[#1c2740] min-h-[85vh]">
      <MezmurHero />

      <div className="mx-auto max-w-[1340px] px-5 pb-16 pt-6 lg:px-[70px]">
        {/* === VIEW 1: MEZMUR LIST VIEW (IMAGE 1) === */}
        {!selectedMezmurId ? (
          <div className="space-y-6">
            {/* Top Toolbar: Search + Category Dropdown + Sort */}
            <MezmurFilterBar
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              sort={sort}
              onSortChange={setSort}
              categories={categories}
            />

            {/* List Card Matching Image 1 Exactly */}
            <div className="relative rounded-2xl border border-[#ecdcb8] bg-[#fffdf9] px-6 sm:px-8 pb-8 pt-6 shadow-[0_4px_16px_rgba(15,35,82,0.06)]">
              <Corners size={40} inset={4} />

              {/* Card Header Bar */}
              <div className="mb-4 flex items-center justify-between border-b border-[#efe6d3] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF4E6] border border-[#E9D9B2] flex items-center justify-center text-[#b9852a]">
                    <MusicIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#0f2352]">
                      {currentCatLabel}
                    </h2>
                    <p className="text-xs text-[#7C88A8]">
                      {am
                        ? 'መዝሙሩን ለማዳመጥ እና ግጥሙን ለማየት ይጫኑ'
                        : 'Click any mezmur to listen to audio and view lyrics'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-[#b9852a] bg-[#FAF4E6] px-3 py-1 rounded-full border border-[#E9D9B2]">
                  {filtered.length} {am ? 'መዝሙራት' : 'Mezmurs'}
                </span>
              </div>

              {/* Mezmurs Rows (Image 1) */}
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#FAF4E6] border border-[#E9D9B2] flex items-center justify-center mx-auto mb-3 text-[#b9852a]">
                    <MusicIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0f2352] mb-1">
                    {am ? 'ምንም መዝሙር አልተገኘም' : 'No Mezmurs Found'}
                  </h3>
                  <p className="text-xs text-[#7C88A8] mb-4">
                    {am
                      ? 'እባክዎ የተለየ ምድብ ይምረጡ ወይም ፍለጋዎን ያስተካክሉ'
                      : 'Please adjust your search keyword or selected category.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('all');
                      setSearch('');
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#0f2352] text-white text-xs font-semibold hover:bg-[#19377d] transition-colors"
                  >
                    {am ? 'ሁሉንም አሳይ' : 'Reset Category & Filters'}
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#efe6d3]">
                  {filtered.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMezmurId(m.id);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className="flex w-full cursor-pointer items-center gap-4 px-2 py-4 text-left font-['Crimson_Text',serif] transition hover:bg-[#FAF4E6]/50 rounded-lg group"
                      >
                        {/* Gold Music Note Icon */}
                        <div className="w-8 h-8 rounded-lg bg-[#FAF4E6] border border-[#E9D9B2]/60 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <MusicIcon className="h-4 w-4 text-[#b9852a]" />
                        </div>

                        {/* Title & Subtitle */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0F1B3E] text-base group-hover:text-[#b9852a] transition-colors truncate">
                              {m.title}
                            </span>
                            {m.audioUrl && (
                              <span
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full shrink-0"
                                title={am ? 'የተቀዳ ድምፅ አለው' : 'Audio recording attached'}
                              >
                                <span>🔊</span>
                                <span>Audio</span>
                              </span>
                            )}
                          </div>
                          {m.titleEn && (
                            <span className="block truncate text-[13px] text-[#6b7690] mt-0.5">
                              {m.titleEn}
                            </span>
                          )}
                        </div>

                        {/* Date & Chevron Right Arrow */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[12.5px] font-medium text-[#7C88A8]">
                            {fmt(m.addedAt)}
                          </span>
                          <ChevronRight className="h-4 w-4 text-[#9aa3b5] group-hover:text-[#b9852a] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          /* === VIEW 2: MEZMUR DETAILS & PLAYER VIEW (IMAGE 2) === */
          <div className="space-y-6">
            {/* Top Navigation: Back to List + Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fffdf9] p-3.5 rounded-xl border border-[#ece5d8] shadow-xs">
              <button
                type="button"
                onClick={() => setSelectedMezmurId(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f2352] text-white text-xs font-bold hover:bg-[#19377d] transition-all cursor-pointer shadow-xs"
              >
                <span>←</span>
                <span>{am ? 'ወደ መዝሙራት ዝርዝር ተመለስ' : 'Back to Mezmur List'}</span>
              </button>

              {activeMezmur && (
                <div className="flex items-center gap-2 text-xs text-[#505E7B]">
                  <span className="font-semibold text-[#b9852a]">
                    {categories.find((c) => c.key === activeMezmur.category)?.en || activeMezmur.category}
                  </span>
                  <span>/</span>
                  <span className="font-bold text-[#0f2352] truncate max-w-[200px]">
                    {activeMezmur.title}
                  </span>
                </div>
              )}
            </div>

            {/* 2-Column Layout Matching Image 2 */}
            {activeMezmur && (
              <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] gap-6 items-start">
                {/* Left Card: Spotlight Album Artwork & Play All */}
                <MezmurSpotlightCard
                  onPlayAll={() => {
                    const audioEl = document.querySelector('audio');
                    if (audioEl) audioEl.play();
                  }}
                />

                {/* Right Card: Lyric Card with Sound Player & Lyrics */}
                <MezmurLyricCard item={activeMezmur} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
