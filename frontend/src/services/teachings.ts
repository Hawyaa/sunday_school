/**
 * services/teachings.ts
 *
 * All API calls related to teachings, centralised here.
 */

import { apiClient } from '@/lib/api';
import type { Teaching } from '@/types/teaching';
import type { PaginatedResponse } from '@/types/announcement';

/** Fetch the latest published teachings for the home page feature section. */
export async function fetchFeaturedTeachings(limit = 3): Promise<Teaching[]> {
  const res = await apiClient.get<PaginatedResponse<Teaching>>(
    `/teachings?limit=${limit}`
  );
  return res.data?.data ?? [];
}

/** Fetch a paginated list of teachings. */
export async function fetchTeachings(
  limit = 10,
  page = 1,
  category?: string
): Promise<{ teachings: Teaching[]; total: number }> {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
    ...(category && category !== 'All' ? { category } : {}),
  });
  const res = await apiClient.get<PaginatedResponse<Teaching>>(`/teachings?${params}`);
  return {
    teachings: res.data?.data ?? [],
    total: res.data?.meta?.total ?? 0,
  };
}
