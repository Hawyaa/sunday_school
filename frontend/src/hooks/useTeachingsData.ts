'use client';

/**
 * hooks/useTeachingsData.ts
 */

import { useEffect, useState } from 'react';
import { fetchTeachings } from '@/services/teachings';
import type { Teaching } from '@/types/teaching';

export const FALLBACK_TEACHINGS: Teaching[] = [
  {
    id: '1',
    title: 'Spiritual Lessons from the Holy Bible',
    titleAm: 'መንፈሳዊ ትምህርቶች ከመጽሐፍ ቅዱስ',
    content:
      'Deep insights from the Holy Scriptures that guide us in our spiritual journey and daily life...',
    author: 'Abba Melke Sedek',
    category: 'Holy Bible',
    subject: 'Holy Bible',
    format: 'pdf',
    metaExtra: '4 Pages',
    imageUrl:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    isPublished: true,
    publishedAt: 'Megabit 12, 2017',
    createdAt: '2025-03-21T08:00:00.000Z',
    updatedAt: '2025-03-21T08:00:00.000Z',
  },
  {
    id: '2',
    title: 'Faith and Salvation',
    titleAm: 'እምነትና ድነት',
    content:
      'An inspiring teaching on faith, grace, and the path to eternal salvation...',
    author: 'Deacon Yared',
    category: 'Dogma',
    subject: 'Dogma',
    format: 'audio',
    metaExtra: '32:45 min',
    imageUrl:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    isPublished: true,
    publishedAt: 'Megabit 8, 2017',
    createdAt: '2025-03-17T08:00:00.000Z',
    updatedAt: '2025-03-17T08:00:00.000Z',
  },
  {
    id: '3',
    title: 'Orthodox Church History Overview',
    titleAm: 'የኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ታሪክ አጠቃላይ እይታ',
    content:
      'A comprehensive look at the history, faith, and legacy of the Orthodox Church...',
    author: 'Teacher Samuel',
    category: 'Church History',
    subject: 'Church History',
    format: 'video',
    metaExtra: '15:20 min',
    imageUrl:
      'https://images.unsplash.com/photo-1548625361-16a75f974274?auto=format&fit=crop&w=600&q=80',
    isPublished: true,
    publishedAt: 'Ginbot 2, 2017',
    createdAt: '2025-05-10T08:00:00.000Z',
    updatedAt: '2025-05-10T08:00:00.000Z',
  },
  {
    id: '4',
    title: 'The Path of Spiritual Life',
    titleAm: 'የመንፈሳዊ ሕይወት ጉዞ',
    content:
      'Practical guidance for living a holy and faithful life in Christ...',
    author: 'Abba Gebriel',
    category: 'Patristics',
    subject: 'Patristics',
    format: 'pdf',
    metaExtra: '6 Pages',
    imageUrl:
      'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80',
    isPublished: true,
    publishedAt: 'Ter 25, 2016',
    createdAt: '2024-02-03T08:00:00.000Z',
    updatedAt: '2024-02-03T08:00:00.000Z',
  },
];

export function useTeachingsData(
  formatFilter: string,
  categoryFilter: string,
  search: string,
  subjectFilter?: string
) {
  const [teachings, setTeachings] = useState<Teaching[]>(FALLBACK_TEACHINGS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchTeachings(
          20,
          1,
          categoryFilter !== 'All' ? categoryFilter : undefined
        );
        if (cancelled) return;

        let data =
          res.teachings && res.teachings.length > 0
            ? res.teachings
            : FALLBACK_TEACHINGS;

        // Apply format filter
        if (formatFilter && formatFilter !== 'all') {
          data = data.filter((t) => t.format === formatFilter);
        }

        // Apply category filter
        if (categoryFilter && categoryFilter !== 'All') {
          data = data.filter(
            (t) =>
              t.category?.toLowerCase() === categoryFilter.toLowerCase() ||
              t.subject?.toLowerCase() === categoryFilter.toLowerCase()
          );
        }

        // Apply subject filter if specified
        if (subjectFilter && subjectFilter !== 'all') {
          data = data.filter(
            (t) => t.subject?.toLowerCase() === subjectFilter.toLowerCase()
          );
        }

        // Apply search query
        if (search.trim()) {
          const q = search.toLowerCase();
          data = data.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              (t.titleAm && t.titleAm.includes(q)) ||
              (t.author && t.author.toLowerCase().includes(q)) ||
              (t.content && t.content.toLowerCase().includes(q))
          );
        }

        setTeachings(data);
      } catch {
        if (!cancelled) {
          setTeachings(FALLBACK_TEACHINGS);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [formatFilter, categoryFilter, search, subjectFilter]);

  return { teachings, isLoading };
}
