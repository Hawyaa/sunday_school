/**
 * src/services/contact.ts
 * Contact submissions and admin message retrieval via native fetch.
 * Using native fetch avoids AxiosError rejections and dev-overlay interceptions on 401.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('abune_access_token') || '';
}

export interface ContactSubmission {
  fullName: string;
  contactInfo: string;
  topic?: string;
  message: string;
}

export interface ContactMessageRecord extends ContactSubmission {
  id: string;
  isRead: boolean;
  createdAt: string;
}

export async function submitContactMessage(data: ContactSubmission): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      message: json?.message || (res.ok ? 'Message sent successfully' : 'Failed to send message'),
    };
  } catch {
    return { success: false, message: 'Could not connect to the server' };
  }
}

export async function fetchAdminContactMessages(params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}): Promise<{ messages: ContactMessageRecord[]; total: number; unreadCount: number }> {
  const token = getAuthToken();
  if (!token) {
    return { messages: [], total: 0, unreadCount: 0 };
  }

  try {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.isRead !== undefined) query.set('isRead', String(params.isRead));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/admin/messages${qs}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('abune_access_token');
        localStorage.removeItem('abune_session');
        localStorage.removeItem('abune_admin_user');
      }
      return { messages: [], total: 0, unreadCount: 0 };
    }

    const json = await res.json().catch(() => ({}));
    const d = json?.data;
    const messagesList: ContactMessageRecord[] = Array.isArray(d) ? d : (d?.messages ?? []);
    const unread = typeof d?.unreadCount === 'number' ? d.unreadCount : (json?.meta?.unreadCount ?? 0);
    const total = json?.meta?.total ?? json?.pagination?.total ?? messagesList.length;

    return {
      messages: messagesList,
      total,
      unreadCount: unread,
    };
  } catch {
    return {
      messages: [],
      total: 0,
      unreadCount: 0,
    };
  }
}

export async function toggleMessageReadStatus(id: string, isRead: boolean): Promise<ContactMessageRecord | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isRead }),
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => ({}));
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}
