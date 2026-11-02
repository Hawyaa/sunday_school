/**
 * services/mezmur.ts
 */

import { apiClient } from '@/lib/api';
import type { MezmurTrack } from '@/types/mezmur';
import type { PaginatedResponse } from '@/types/announcement';

export async function fetchMezmurTracks(
  category?: string,
  search?: string
): Promise<MezmurTrack[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const res = await apiClient.get<PaginatedResponse<MezmurTrack>>(
      `/mezmur?${params.toString()}`
    );
    return res.data?.data ?? [];
  } catch {
    return [];
  }
}
