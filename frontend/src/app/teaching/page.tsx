'use client';

/**
 * app/teachings/page.tsx
 * Header > Hero > [panel: toolbar + lesson list | quote banner + categories] > Footer
 *
 * NOTE: lessons below are sample data. Replace SAMPLE_LESSONS with your API/hook
 * result (same TeachingLesson shape) and keep the rest as is.
 */

import React, { useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TeachingsHero } from '@/components/teachings/TeachingsHero';
import { TeachingsFilterToolbar, type SortKey } from '@/components/teachings/TeachingsFilterToolbar';
import { TeachingsList } from '@/components/teachings/TeachingsList';
import { TeachingsScriptureSidebar, CATEGORIES } from '@/components/teachings/TeachingsScriptureSidebar';
import type { TeachingLesson } from '@/components/teachings/TeachingsLessonCard';

const CATEGORY_NAMES = CATEGORIES.map((c) => c.label);

const SAMPLE_LESSONS: TeachingLesson[] = [
  { id: '1', title: 'The Power of Prayer', description: 'Prayer connects us to God, gives peace to our hearts, and strengthens our faith in daily life.', speaker: 'Abune Yohannes', date: '2025-01-30', minutes: 16, category: 'Spiritual Life', image: 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg' },
  { id: '2', title: 'Living the Teachings of the Church Fathers', description: 'Let us learn from the wisdom of the Church Fathers and apply their teachings in our daily lives.', speaker: 'Abune Matheos', date: '2025-01-12', minutes: 24, category: 'Church Fathers', image: 'https://i.pinimg.com/736x/d5/e8/67/d5e86784cc782e8616d91447b16109fb.jpg' },
  { id: '3', title: 'The Meaning of the Cross', description: 'The Cross is not just a symbol, but the victory of love, sacrifice, and eternal life.', speaker: 'Abune Samuel', date: '2024-12-28', minutes: 18, category: 'Faith & Practice', image: 'https://i.pinimg.com/236x/54/60/fa/5460fadba1fc15124905df442994a08a.jpg' },
  { id: '4', title: 'Faith and Good Works', description: 'Faith without works is dead. Let us live our faith through love, kindness, and service to others.', speaker: 'Abune Yohannes', date: '2024-12-15', minutes: 21, category: 'Bible Teachings', image: 'https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg' },
];

export default function TeachingsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortKey>('latest');

  const reset = () => {
    setQuery('');
    setCategory('');
    setSort('latest');
  };

  const lessons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_LESSONS
      .filter((l) => !category || l.category === category)
      .filter((l) => !q || `${l.title} ${l.description} ${l.speaker}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === 'latest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [query, category, sort]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f1e6]">
      <Header />
      <TeachingsHero />

      <main className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 gap-[30px] px-4 py-[22px] sm:px-8 lg:grid-cols-[1fr_316px] lg:px-[70px]">
        {/* Left panel: toolbar + rows */}
        <section className="min-w-0 self-start rounded-[14px] border border-[#ece5d8] bg-[#fffdf9]/70 px-3 pb-3.5 pt-3">
          <div className="mb-2.5">
            <TeachingsFilterToolbar
              query={query}
              onQuery={setQuery}
              categories={CATEGORY_NAMES}
              category={category}
              onCategory={setCategory}
              sort={sort}
              onSort={setSort}
            />
          </div>
          <TeachingsList lessons={lessons} onReset={reset} />
        </section>

        {/* Right column: quote banner + Browse by Category */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <TeachingsScriptureSidebar
            active={category}
            onSelect={(c) => setCategory((prev) => (prev === c ? '' : c))}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}