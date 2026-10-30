'use client';

/**
 * MezmurPageView.tsx
 * Hero + filter row + spotlight + lyric card + sidebar (Recent + Popular).
 */

import React, { useMemo, useState, useEffect } from 'react';
import { MezmurHero } from '@/components/mezmur/MezmurHero';
import { MezmurFilterBar, type MezmurSort } from '@/components/mezmur/MezmurFilterBar';
import { MezmurSpotlightCard } from '@/components/mezmur/MezmurSpotlightCard';
import { MezmurLyricCard } from '@/components/mezmur/MezmurLyricCard';
import { MezmurRecentCard } from '@/components/mezmur/MezmurRecentCard';
import { MezmurPopularCard } from '@/components/mezmur/MezmurPopularCard';
import { MezmurItem } from '@/components/mezmur/mezmurData';
import { getStoredMezmurs } from '@/lib/contentStore';

export function MezmurPageView({ items: initialItems }: { items?: MezmurItem[] }) {
  const [items, setItems] = useState<MezmurItem[]>(() => initialItems || getStoredMezmurs());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<MezmurSort>('newest');
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredMezmurs());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter((m) => {
      if (category !== 'all' && m.category !== category) return false;
      if (q && !`${m.title} ${m.titleEn} ${m.lyrics.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const t = (m: MezmurItem) => new Date(m.addedAt).getTime();
    return [...list].sort((a, b) => (sort === 'newest' ? t(b) - t(a) : t(a) - t(b)));
  }, [items, search, category, sort]);

  const active = items.find((m) => m.id === activeId) ?? filtered[0] ?? items[0];

  return (
    <div className="bg-[#f7f1e6] font-['Crimson_Text',Georgia,serif] text-[#1c2740]">
      <MezmurHero />

      <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-5 lg:px-[70px]">
        {/* items-stretch: the left cards grow so their bottom lines up with the sidebar */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_337px]">
          {/* Main column */}
          <div className="flex min-w-0 flex-col">
            <MezmurFilterBar
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              sort={sort}
              onSortChange={setSort}
            />

            <div className="mt-5 grid flex-1 grid-cols-1 gap-5 md:grid-cols-[290px_1fr]">
              <MezmurSpotlightCard onPlayAll={() => filtered[0] && setActiveId(filtered[0].id)} />
              {active && <MezmurLyricCard item={active} />}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            <MezmurRecentCard items={items} activeId={active?.id ?? ''} onSelect={setActiveId} />
            <MezmurPopularCard items={filtered} activeId={active?.id ?? ''} onSelect={setActiveId} />
          </aside>
        </div>
      </div>
    </div>
  );
}
