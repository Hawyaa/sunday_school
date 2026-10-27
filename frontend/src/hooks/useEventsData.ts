'use client';

/**
 * hooks/useEventsData.ts
 *
 * Dedicated hook for fetching events with pagination, error resilience,
 * and fallback to rich initial data.
 */

import { useEffect, useState } from 'react';
import { fetchEvents } from '@/services/events';
import type { ChurchEvent } from '@/types/event';

export const FALLBACK_EVENTS: (ChurchEvent & { tag?: string })[] = [
  {
    id: '1',
    title: 'Saint Gabriel Annual Feast',
    description: 'Annual feast celebration of Saint Gabriel with holy liturgy and spiritual fellowship.',
    location: 'Saint Gabriel Church Grounds',
    startDate: '2025-04-23T08:00:00.000Z',
    endDate: '2025-04-23T12:00:00.000Z',
    category: 'Feast',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    tag: 'Important',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Annual Sacred Hymns Concert',
    description: 'An evening of traditional Yaredic sacred hymns and chanting by Sunday school choirs.',
    location: 'Main Fellowship Hall',
    startDate: '2025-04-30T17:00:00.000Z',
    endDate: '2025-04-30T20:00:00.000Z',
    category: 'Concert',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Monthly Spiritual Teaching Session',
    description: 'In-depth teaching on Orthodox theology, liturgy, and spiritual life.',
    location: 'Saint Michael Church',
    startDate: '2025-05-13T14:00:00.000Z',
    endDate: '2025-05-13T17:00:00.000Z',
    category: 'Teaching',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'Youth Choir Gathering & Fellowship',
    description: 'Special youth conference, spiritual choir presentations, and youth mentoring.',
    location: 'Main Fellowship Hall',
    startDate: '2025-06-05T16:00:00.000Z',
    endDate: '2025-06-05T19:00:00.000Z',
    category: 'Youth',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

export function useEventsData(page = 1, limit = 10) {
  const [events, setEvents] = useState<(ChurchEvent & { tag?: string })[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);

      try {
        const res = await fetchEvents(limit, page);
        if (cancelled) return;

        if (res.events && res.events.length > 0) {
          setEvents(res.events);
          setTotal(res.total);
        } else {
          // Graceful fallback when DB is clean/empty
          setEvents(FALLBACK_EVENTS);
          setTotal(FALLBACK_EVENTS.length);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[useEventsData] network or server fallback loaded:', err);
          setHasError(true);
          setEvents(FALLBACK_EVENTS);
          setTotal(FALLBACK_EVENTS.length);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return { events, total, isLoading, hasError };
}
