/**
 * services/reports.ts
 */

import { apiClient } from '@/lib/api';
import type { ChurchReport } from '@/types/report';
import type { PaginatedResponse } from '@/types/announcement';

export async function fetchReports(
  year?: string,
  category?: string,
  search?: string
): Promise<ChurchReport[]> {
  try {
    const params = new URLSearchParams();
    if (year && year !== 'All') params.append('year', year);
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const res = await apiClient.get<PaginatedResponse<ChurchReport>>(
      `/reports?${params.toString()}`
    );
    return res.data?.data ?? [];
  } catch {
    return [];
  }
}
