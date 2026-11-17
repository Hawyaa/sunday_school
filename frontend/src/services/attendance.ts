import { apiClient } from '@/lib/api';

export interface RosterStudent {
  id: string;
  fullName: string;
  christianName: string;
  registrationNumber: string;
  division: string;
  assignedClass: string | null;
  phoneNumber?: string | null;
  photoUrl?: string | null;
}

export interface AttendanceRecordPayload {
  memberId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  minutesLate?: number;
  remarks?: string;
}

export interface RecordSessionPayload {
  sessionType: 'SUNDAY_SERVICE' | 'SATURDAY_CLASS' | 'WEEKDAY_PRAYER' | 'SPECIAL_EVENT';
  date: string;
  academicYear: string;
  className: string;
  notes?: string;
  records: AttendanceRecordPayload[];
}

export interface AttendanceSession {
  id: string;
  sessionType: string;
  date: string;
  academicYear: string;
  className: string;
  notes?: string | null;
  recordedByAdminId: string;
  createdAt: string;
  records?: Array<{
    id: string;
    memberId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    minutesLate?: number | null;
    remarks?: string | null;
    member?: {
      id: string;
      fullName: string;
      registrationNumber: string;
      division: string;
    };
  }>;
}

export interface AttendanceStats {
  totalSessions: number;
  totalRecords: number;
  overallAttendanceRate: number;
  classBreakdown: Array<{
    className: string;
    sessionCount: number;
  }>;
}

export async function fetchAttendanceRoster(params?: {
  className?: string;
  division?: string;
}): Promise<RosterStudent[]> {
  try {
    const query = new URLSearchParams();
    if (params?.className) query.set('className', params.className);
    if (params?.division) query.set('division', params.division);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get<{ success: boolean; data: RosterStudent[] }>(
      `/attendance/roster${qs}`
    );
    return res.data?.data ?? [];
  } catch (error) {
    console.error('Failed to fetch attendance roster:', error);
    return [];
  }
}

export async function fetchAttendanceSessions(params?: {
  className?: string;
  sessionType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ sessions: AttendanceSession[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.className) query.set('className', params.className);
    if (params?.sessionType) query.set('sessionType', params.sessionType);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get<{
      success: boolean;
      data: AttendanceSession[];
      pagination?: { total: number };
    }>(`/attendance/sessions${qs}`);

    return {
      sessions: res.data?.data ?? [],
      total: res.data?.pagination?.total ?? res.data?.data?.length ?? 0,
    };
  } catch (error) {
    console.error('Failed to fetch attendance sessions:', error);
    return { sessions: [], total: 0 };
  }
}

export async function recordAttendanceSession(
  payload: RecordSessionPayload
): Promise<AttendanceSession> {
  const res = await apiClient.post<{ success: boolean; data: AttendanceSession }>(
    '/attendance/sessions',
    payload
  );
  return res.data.data;
}

export async function correctAttendanceRecord(
  sessionId: string,
  data: {
    recordId: string;
    newStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    reason: string;
    minutesLate?: number;
    remarks?: string;
  }
): Promise<void> {
  await apiClient.post(`/attendance/sessions/${sessionId}/correct`, data);
}

export async function fetchAttendanceStats(): Promise<AttendanceStats | null> {
  try {
    const res = await apiClient.get<{ success: boolean; data: AttendanceStats }>(
      '/attendance/stats'
    );
    return res.data?.data ?? null;
  } catch (error) {
    console.error('Failed to fetch attendance stats:', error);
    return null;
  }
}
