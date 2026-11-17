import { apiClient } from '@/lib/api';

export interface MemberProfile {
  id: string;
  registrationNumber: string;
  fullName: string;
  christianName: string;
  gender: string;
  age: number;
  division: string;
  assignedClass?: string | null;
  phoneNumber?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyRelationship?: string | null;
  confessionFather?: string | null;
  confessionChurch?: string | null;
  address?: string | null;
  kebele?: string | null;
  houseNumber?: string | null;
  status: string;
  photoUrl?: string | null;
  createdAt: string;
  stats?: {
    totalSessions: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    excusedCount: number;
    attendanceRate: number;
  };
}

export interface StudentNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  createdAt: string;
}

export interface MemberAttendanceItem {
  id: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  minutesLate?: number;
  remarks?: string;
  createdAt: string;
  session: {
    id: string;
    date: string;
    sessionType: string;
    className: string;
    academicYear: string;
  };
}

export async function fetchMemberProfile(): Promise<MemberProfile | null> {
  try {
    const res = await apiClient.get<{ success: boolean; data: MemberProfile }>('/members/me');
    return res.data?.data ?? null;
  } catch (error) {
    console.error('Failed to fetch member profile:', error);
    return null;
  }
}

export async function updateMemberProfile(data: {
  phoneNumber?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyRelationship?: string;
  newPassword?: string;
}): Promise<MemberProfile | null> {
  const res = await apiClient.put<{ success: boolean; data: MemberProfile }>('/members/me', data);
  return res.data?.data ?? null;
}

export async function fetchMemberNotices(): Promise<StudentNotice[]> {
  try {
    const res = await apiClient.get<{ success: boolean; data: StudentNotice[] }>('/portal/notices');
    return res.data?.data ?? [];
  } catch (error) {
    console.error('Failed to fetch member notices:', error);
    return [];
  }
}

export async function fetchMemberAttendance(): Promise<MemberAttendanceItem[]> {
  try {
    const res = await apiClient.get<{ success: boolean; data: MemberAttendanceItem[] }>('/portal/attendance');
    return res.data?.data ?? [];
  } catch (error) {
    console.error('Failed to fetch member attendance:', error);
    return [];
  }
}
