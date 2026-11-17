import { apiClient } from '@/lib/api';

export interface ScheduleItem {
  id: string;
  title: string;
  activity: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  targetGroup?: string | null;
  location?: string | null;
  isPublished?: boolean;
}

export async function fetchSchedules(params?: {
  dayOfWeek?: string;
  targetGroup?: string;
}): Promise<ScheduleItem[]> {
  try {
    const query = new URLSearchParams();
    if (params?.dayOfWeek) query.set('dayOfWeek', params.dayOfWeek);
    if (params?.targetGroup) query.set('targetGroup', params.targetGroup);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get<{ success: boolean; data: ScheduleItem[] }>(
      `/schedule${qs}`
    );
    return res.data?.data ?? [];
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return [];
  }
}

export async function fetchScheduleById(id: string): Promise<ScheduleItem | null> {
  try {
    const res = await apiClient.get<{ success: boolean; data: ScheduleItem }>(
      `/schedule/${id}`
    );
    return res.data?.data ?? null;
  } catch (error) {
    console.error(`Failed to fetch schedule ${id}:`, error);
    return null;
  }
}
