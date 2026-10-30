/**
 * services/events.ts
 *
 * All API calls related to church events, centralised here.
 */

import { apiClient } from '@/lib/api';
import type { ChurchEvent } from '@/types/event';
import type { PaginatedResponse } from '@/types/announcement';

/** Fetch the next upcoming published event (used on home sidebar). */
export async function fetchNextEvent(): Promise<ChurchEvent | null> {
  try {
    const res = await apiClient.get<PaginatedResponse<ChurchEvent>>(
      '/events?limit=1'
    );
    return res.data?.data?.[0] ?? null;
  } catch {
    return null;
  }
}

/** Fetch a paginated list of events. */
export async function fetchEvents(
  limit = 10,
  page = 1
): Promise<{ events: ChurchEvent[]; total: number }> {
  const res = await apiClient.get<PaginatedResponse<ChurchEvent>>(
    `/events?limit=${limit}&page=${page}`
  );
  return {
    events: res.data?.data ?? [],
    total: res.data?.meta?.total ?? 0,
  };
}
