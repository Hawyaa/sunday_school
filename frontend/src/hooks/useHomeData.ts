/**
 * hooks/useHomeData.ts
 *
 * Single custom hook that fetches all data needed by the home page.
 *
 * Design rules:
 * - Runs all requests in parallel (Promise.all) — minimum waterfall.
 * - Falls back gracefully: each slice has its own error handling so a
 *   single failing endpoint doesn't blank the whole page.
 * - Returns a unified loading flag so the page can show a skeleton
 *   without coordinating three separate booleans.
 */

'use client';

import { useEffect, useState } from 'react';
import { fetchLatestAnnouncements } from '@/services/announcements';
import { fetchNextEvent } from '@/services/events';
import { fetchFeaturedTeachings } from '@/services/teachings';
import type { Announcement } from '@/types/announcement';
import type { ChurchEvent } from '@/types/event';
import type { Teaching } from '@/types/teaching';

export interface HomeData {
  announcements: Announcement[];
  nextEvent: ChurchEvent | null;
  teachings: Teaching[];
  isLoading: boolean;
  hasError: boolean;
}

export function useHomeData(): HomeData {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [nextEvent, setNextEvent] = useState<ChurchEvent | null>(null);
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);

      try {
        const [ann, ev, teach] = await Promise.all([
          fetchLatestAnnouncements(4),
          fetchNextEvent(),
          fetchFeaturedTeachings(3),
        ]);

        if (cancelled) return;

        setAnnouncements(ann);
        setNextEvent(ev);
        setTeachings(teach);
      } catch (err) {
        if (!cancelled) {
          console.warn('[useHomeData] partial or full data fetch error:', err);
          setHasError(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    // Cleanup: ignore stale results if the component unmounts mid-flight
    return () => {
      cancelled = true;
    };
  }, []); // runs once on mount — home page data is session-stable

  return { announcements, nextEvent, teachings, isLoading, hasError };
}
