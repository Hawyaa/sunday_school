'use client';

/**
 * hooks/useTeachingsData.ts
 */

import { useEffect, useState, useCallback } from 'react';
import { fetchTeachings } from '@/services/teachings';
import type { Teaching } from '@/types/teaching';
import { getStoredTeachings, INITIAL_TEACHINGS } from '@/lib/contentStore';

export const FALLBACK_TEACHINGS: Teaching[] = INITIAL_TEACHINGS;

export function useTeachingsData(
  formatFilter: string,
  categoryFilter: string,
  search: string,
  subjectFilter?: string
) {
  const [teachings, setTeachings] = useState<Teaching[]>(() => {
    if (typeof window !== 'undefined') {
      return getStoredTeachings();
    }
    return INITIAL_TEACHINGS;
  });
  const [isLoading, setIsLoading] = useState(false);

  const applyFilters = useCallback(
    (source: Teaching[]) => {
      let data = [...source];

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
            (t.titleAm && t.titleAm.toLowerCase().includes(q)) ||
            (t.author && t.author.toLowerCase().includes(q)) ||
            (t.content && t.content.toLowerCase().includes(q)) ||
            (t.description && t.description.toLowerCase().includes(q))
        );
      }

      return data;
    },
    [formatFilter, categoryFilter, search, subjectFilter]
  );

  const reload = useCallback(async () => {
    const local = getStoredTeachings();
    setTeachings(applyFilters(local));

    try {
      const res = await fetchTeachings(
        20,
        1,
        categoryFilter !== 'All' ? categoryFilter : undefined
      );
      if (res.teachings && res.teachings.length > 0) {
        // Merge with local teachings (giving priority to local if edited)
        const localIds = new Set(local.map((t) => t.id));
        const merged = [
          ...local,
          ...res.teachings.filter((t) => !localIds.has(t.id)),
        ];
        setTeachings(applyFilters(merged));
      }
    } catch {
      // Offline or network error: gracefully keep local data
    }
  }, [applyFilters, categoryFilter]);

  useEffect(() => {
    reload();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string }>;
      if (!customEvent.detail?.key || customEvent.detail.key === 'teachings') {
        reload();
      }
    };

    window.addEventListener('abune_content_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [reload]);

  return { teachings, isLoading, reload };
}
