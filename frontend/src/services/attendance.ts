import { apiClient } from '@/lib/api';

export type AttendanceDivision = 'CHILDREN' | 'INTERMEDIATE' | 'YOUTH';
export type AttendanceStatus = 'PRESENT' | 'ABSENT';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AttendanceMember {
  id: string;
  fullName: string;
  christianName?: string;
  registrationNumber: string;
  division: AttendanceDivision;
  preferredDepartment?: string | null;
}

export interface AttendanceCorrection {
  id: string;
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  reason: string;
  createdAt: string;
  correctedBy: { id: string; name: string };
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  status: AttendanceStatus;
  member: Pick<AttendanceMember, 'id' | 'fullName' | 'registrationNumber' | 'division'>;
  corrections: AttendanceCorrection[];
}

export interface AttendanceSession {
  id: string;
  sessionDate: string;
  division: AttendanceDivision;
  groupName: string;
  department: string;
  className: string;
  sessionType: string;
  createdBy: { id: string; name: string };
  records?: AttendanceRecord[];
  totalMembers?: number;
  presentCount?: number;
  absentCount?: number;
}

export interface AttendanceReport {
  sessions: number;
  present: number;
  absent: number;
  markedRecords: number;
  attendancePercent: number;
  byGroup: Array<{
    groupName: string;
    sessions: number;
    present: number;
    absent: number;
    attendancePercent: number;
  }>;
  byClass: Array<{
    division: AttendanceDivision;
    className: string;
    groupName: string;
    department: string;
    sessions: number;
    present: number;
    absent: number;
    attendancePercent: number;
  }>;
  byMember: Array<{
    memberId: string;
    name: string;
    registrationNumber: string;
    sessions: number;
    present: number;
    absent: number;
    attendancePercent: number;
  }>;
}

export interface AttendanceSessionInput {
  sessionDate: string;
  division: AttendanceDivision;
  groupName: string;
  department: string;
  className: string;
  sessionType: string;
  records: Array<{ memberId: string; status: AttendanceStatus }>;
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export async function fetchAttendanceRoster(division: AttendanceDivision) {
  const response = await apiClient.get<ApiResponse<AttendanceMember[]>>('/admin/attendance/roster', {
    params: { division },
  });
  return unwrap(response);
}

export async function fetchAttendanceSessions(params: {
  limit?: number;
  from?: string;
  to?: string;
  className?: string;
  sessionType?: string;
} = {}) {
  const response = await apiClient.get<ApiResponse<AttendanceSession[]>>('/admin/attendance/sessions', {
    params: { page: 1, limit: 100, ...params },
  });
  return unwrap(response);
}

export async function fetchAttendanceSession(id: string) {
  const response = await apiClient.get<ApiResponse<AttendanceSession>>(`/admin/attendance/sessions/${id}`);
  return unwrap(response);
}

export async function createAttendanceSession(input: AttendanceSessionInput) {
  const response = await apiClient.post<ApiResponse<AttendanceSession>>('/admin/attendance/sessions', input);
  return unwrap(response);
}

export async function correctAttendanceRecord(
  sessionId: string,
  recordId: string,
  status: AttendanceStatus,
  reason: string
) {
  const response = await apiClient.patch<ApiResponse<AttendanceRecord>>(
    `/admin/attendance/sessions/${sessionId}/records/${recordId}`,
    { status, reason }
  );
  return unwrap(response);
}

export async function fetchAttendanceReport(params: {
  from?: string;
  to?: string;
  className?: string;
  sessionType?: string;
} = {}) {
  const response = await apiClient.get<ApiResponse<AttendanceReport>>('/admin/attendance/reports', { params });
  return unwrap(response);
}