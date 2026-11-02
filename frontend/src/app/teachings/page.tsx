'use client';

/**
 * app/teachings/page.tsx
 * Header > Hero > [panel: toolbar + lessons | quote banner] > Footer
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTeachingsData } from '@/hooks/useTeachingsData';
import { TeachingsHero } from '@/components/teachings/TeachingsHero';
import { TeachingsFilterToolbar, type SortKey } from '@/components/teachings/TeachingsFilterToolbar';
import { TeachingsList } from '@/components/teachings/TeachingsList';
import { TeachingsScriptureSidebar } from '@/components/teachings/TeachingsScriptureSidebar';
import type { TeachingLesson } from '@/components/teachings/TeachingsLessonCard';
import { getStoredTeachingCategories } from '@/lib/contentStore';
import { TeachingCategory, INITIAL_TEACHING_CATEGORIES, DEFAULT_TEACHING_COVER } from '@/types/teaching';

// ── Convert whatever your hook returns into a TeachingLesson ────────────────
type Raw = Record<string, unknown>;
const pick = (t: Raw, ...keys: string[]) => {
  for (const k of keys) {
    const v = t[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
};
const str = (v: unknown, d = '') => (v == null ? d : String(v));

function toLesson(raw: unknown, i: number): TeachingLesson {
  const t = (raw ?? {}) as Raw;
  const dur = pick(t, 'minutes', 'durationMinutes', 'duration');
  const text = str(pick(t, 'description', 'summary', 'content'));
  const rawImg = pick(t, 'image', 'thumbnail', 'thumbnailUrl', 'coverImage', 'imageUrl');

  return {
    id: str(pick(t, 'id', '_id'), String(i)),
    title: str(pick(t, 'title', 'name'), 'Untitled'),
    description: text.length > 140 ? `${text.slice(0, 140)}…` : text,
    speaker: str(pick(t, 'speaker', 'author', 'teacher', 'presenter'), 'Abune Media'),
    date: str(pick(t, 'date', 'publishedAt', 'createdAt'), '2025-01-01').slice(0, 10),
    minutes: typeof dur === 'number' ? dur : parseInt(str(dur), 10) || 10,
    category: str(pick(t, 'category', 'subject')),
    image: rawImg ? str(rawImg) : DEFAULT_TEACHING_COVER,
    format: pick(t, 'format') as TeachingLesson['format'],
    pdfUrl: pick(t, 'pdfUrl') as string | undefined,
    pdfFileName: pick(t, 'pdfFileName') as string | undefined,
    videoUrl: pick(t, 'videoUrl') as string | undefined,
    audioUrl: pick(t, 'audioUrl') as string | undefined,
  };
}

export default function TeachingsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(''); // '' = all categories
  const [sort, setSort] = useState<SortKey>('latest');

  // Dynamic Teaching Categories managed by Admin
  const [categories, setCategories] = useState<TeachingCategory[]>(() => {
    if (typeof window !== 'undefined') {
      return getStoredTeachingCategories();
    }
    return INITIAL_TEACHING_CATEGORIES;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(getStoredTeachingCategories());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const categoryNames = useMemo(() => {
    return categories.map((c) => c.en);
  }, [categories]);

  // Load everything once; filtering/sorting is done below.
  const { teachings, isLoading } = useTeachingsData('all', 'All', '', 'all');

  const all = useMemo<TeachingLesson[]>(() => {
    const list = Array.isArray(teachings) ? teachings : [];
    return list.map(toLesson);
  }, [teachings]);

  const lessons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((l) => !category || l.category.toLowerCase() === category.toLowerCase())
      .filter((l) => !q || `${l.title} ${l.description} ${l.speaker}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === 'latest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [all, query, category, sort]);

  const reset = () => {
    setQuery('');
    setCategory('');
    setSort('latest');
  };

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
              categories={categoryNames}
              category={category}
              onCategory={setCategory}
              sort={sort}
              onSort={setSort}
            />
          </div>
          <TeachingsList lessons={lessons} isLoading={isLoading} onReset={reset} />
        </section>

        {/* Right column: quote banner */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <TeachingsScriptureSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
