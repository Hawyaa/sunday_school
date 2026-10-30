/**
 * services/announcements.ts
 *
 * All API calls related to announcements, centralised here.
 * Components import from this service — never from apiClient directly.
 * This means swapping the HTTP layer never touches a component file.
 */

import { apiClient } from '@/lib/api';
import type { Announcement, PaginatedResponse } from '@/types/announcement';

/** Fetch the latest published announcements for the home page. */
export async function fetchLatestAnnouncements(limit = 4): Promise<Announcement[]> {
  const res = await apiClient.get<PaginatedResponse<Announcement>>(
    `/announcements?limit=${limit}`
  );
  return res.data?.data ?? [];
}

/** Fetch a single announcement by ID. */
export async function fetchAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const res = await apiClient.get<{ data: Announcement }>(`/announcements/${id}`);
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}
