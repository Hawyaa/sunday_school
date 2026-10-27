'use client';

/**
 * hooks/useMezmurData.ts
 */

import { useEffect, useState } from 'react';
import { fetchMezmurTracks } from '@/services/mezmur';
import type { MezmurTrack } from '@/types/mezmur';

export const FALLBACK_TRACKS: MezmurTrack[] = [
  {
    id: '1',
    title: 'God is My God',
    titleAm: 'አምላኬ አምላኬ ነህ',
    category: 'Mezmur',
    duration: '4:32',
  },
  {
    id: '2',
    title: 'Light of Faith',
    titleAm: 'የእምነት ብርሃን',
    category: 'Praise',
    duration: '5:18',
  },
  {
    id: '3',
    title: 'As Faith Begins',
    titleAm: 'እምነት ሲጀምር',
    category: 'Mezmur',
    duration: '3:45',
  },
  {
    id: '4',
    title: 'Sing to the Lord',
    titleAm: 'ለእግዚአብሔር ዘምሩ',
    category: 'Chanting',
    duration: '6:20',
  },
  {
    id: '5',
    title: 'Saint Michael Prayer',
    titleAm: 'የቅዱስ ሚካኤል ምልጃ',
    category: 'Praise',
    duration: '4:50',
  },
  {
    id: '6',
    title: 'Glory to God',
    titleAm: 'ክብር ለእግዚአብሔር',
    category: 'Mezmur',
    duration: '5:12',
  },
];

export function useMezmurData(category: string, search: string) {
  const [tracks, setTracks] = useState<MezmurTrack[]>(FALLBACK_TRACKS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchMezmurTracks(category, search);
        if (cancelled) return;

        if (data && data.length > 0) {
          setTracks(data);
        } else {
          // Filter fallback data client-side
          let filtered = FALLBACK_TRACKS;
          if (category && category !== 'All') {
            filtered = filtered.filter(
              (t) => t.category.toLowerCase() === category.toLowerCase()
            );
          }
          if (search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
              (t) =>
                t.title.toLowerCase().includes(q) ||
                (t.titleAm && t.titleAm.includes(q))
            );
          }
          setTracks(filtered);
        }
      } catch {
        if (!cancelled) {
          setTracks(FALLBACK_TRACKS);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [category, search]);

  return { tracks, isLoading };
}
