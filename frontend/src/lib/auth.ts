/**
 * src/lib/auth.ts
 * Tiny auth layer for the portal.
 * Talks to backend:
 *   POST /api/auth/login          -> admin / teacher login (email + password)
 *   POST /api/registration/login  -> student / member login (name | reg. number | phone + password)
 *   POST /api/auth/refresh        -> new access token
 *   POST /api/auth/logout         -> revoke refresh token
 */

export type Role = 'admin' | 'member';

export interface Session {
  role: Role;
  accessToken: string;
  refreshToken?: string;
  user: {
    name: string;
    email?: string;
    backendRole?: string;
    registrationNumber?: string;
    division?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  };
}

const KEY = 'abune_session';
const RAW_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
// Normalize so API base does not double the /api prefix if path already has /api
export const API = RAW_API.replace(/\/api\/?$/, '');

/* ── session storage (browser only) ─────────────────────────────────────── */

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(s: Session) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(s));
  if (s.accessToken) {
    localStorage.setItem('abune_access_token', s.accessToken);
  }
  if (s.user) {
    localStorage.setItem('abune_admin_user', JSON.stringify(s.user));
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
  localStorage.removeItem('abune_access_token');
  localStorage.removeItem('abune_admin_user');
}

/* ── helpers ────────────────────────────────────────────────────────────── */

async function post(path: string, body: unknown) {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again.');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.message || json?.message || 'Login failed. Please try again.');
  }
  return json;
}

/* ── logins ─────────────────────────────────────────────────────────────── */

export async function loginAdmin(email: string, password: string): Promise<Session> {
  const json = await post('/api/auth/login', { email, password });
  const d = json.data ?? {};
  const admin = d.admin ?? {};
  const session: Session = {
    role: 'admin',
    accessToken: d.accessToken,
    refreshToken: d.refreshToken,
    user: { name: admin.name ?? email, email: admin.email ?? email, backendRole: admin.role },
  };
  saveSession(session);
  return session;
}

export async function loginMember(name: string, password: string): Promise<Session> {
  const json = await post('/api/registration/login', { name, password });
  const d = json.data ?? json;
  const m = d.member ?? {};
  const session: Session = {
    role: 'member',
    accessToken: d.accessToken ?? d.token ?? '',
    refreshToken: d.refreshToken,
    user: {
      name: m.fullName ?? name,
      registrationNumber: m.registrationNumber,
      division: m.division,
      status: m.status,
    },
  };
  saveSession(session);
  return session;
}

export async function logout(): Promise<void> {
  const session = getSession();
  if (session?.refreshToken) {
    await post('/api/auth/logout', { refreshToken: session.refreshToken }).catch(() => {});
  }
  clearSession();
}
