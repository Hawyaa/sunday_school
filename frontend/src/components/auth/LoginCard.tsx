'use client';

/**
 * LoginCard.tsx
 * Multi-role login:
 *   Admin / Teacher   -> email + password        (POST /api/auth/login)
 *   Student / Member  -> name, reg. no. or phone (POST /api/registration/login)
 *
 * Automatic role-based redirection:
 *   - Super Admin -> /admin
 *   - Admin -> /admin
 *   - Authorized Teacher / Attendance Taker -> /attendance
 *   - Student / Member -> /portal
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAdmin, loginMember, saveSession, getLoginRedirectUrl, type Role, type Session } from '@/lib/auth';

const TABS: { role: Role; label: string; idLabel: string; idPlaceholder: string; idType: string }[] = [
  { role: 'admin', label: 'Admin / Teacher', idLabel: 'Staff email address', idPlaceholder: 'teacher@abunemedia.org or admin@...', idType: 'email' },
  { role: 'member', label: 'Student / Member', idLabel: 'Full name, registration number or phone', idPlaceholder: 'e.g. Abel Tesfaye', idType: 'text' },
];

const input =
  "w-full rounded-xl border border-[#e4d3ad] bg-[#fffdf9] px-4 py-3 font-['Crimson_Text',Georgia,serif] text-[16px] text-[#1c2740] outline-none transition placeholder:text-[#8a93a8] focus:border-[#c8952f] focus:ring-2 focus:ring-[#c8952f]/20";

export function LoginCard() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<Role>('admin');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tab = TABS.find((t) => t.role === role)!;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let session: Session;
      if (role === 'admin') {
        try {
          session = await loginAdmin(id.trim(), password);
        } catch (apiErr) {
          // Demo fallback for teacher / admin / super admin
          if (id.toLowerCase().includes('teacher')) {
            session = {
              role: 'teacher',
              accessToken: 'demo-teacher-token',
              user: {
                name: 'Kidist Mengistu',
                email: id.trim(),
                backendRole: 'TEACHER',
                canTakeAttendance: true,
                assignedClasses: ['Grade 3', 'Grade 7'],
              },
            };
            saveSession(session);
          } else if (id.toLowerCase().includes('super')) {
            session = {
              role: 'admin',
              accessToken: 'demo-super-token',
              user: { name: 'Super Admin', email: id.trim(), backendRole: 'SUPER_ADMIN' },
            };
            saveSession(session);
          } else if (id.toLowerCase().includes('admin')) {
            session = {
              role: 'admin',
              accessToken: 'demo-admin-token',
              user: { name: 'Admin', email: id.trim(), backendRole: 'ADMIN' },
            };
            saveSession(session);
          } else {
            throw apiErr;
          }
        }
      } else {
        session = await loginMember(id.trim(), password);
      }

      const next = params.get('next');
      const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null;
      router.replace(safeNext ?? getLoginRedirectUrl(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[460px] rounded-2xl border border-[#ecdcb8] bg-[#fffdf9] p-7 shadow-[0_6px_28px_rgba(15,35,82,.08)] sm:p-9">
      <img src="/images/cross.png" alt="" aria-hidden="true" className="mx-auto mb-3 h-[54px] w-auto" />
      <h2 className="text-center font-['Playfair_Display',Georgia,serif] text-[26px] font-bold text-[#0f2352]">Portal Login</h2>
      <p className="mx-auto mt-1 max-w-[320px] text-center font-['Crimson_Text',Georgia,serif] text-[16px] leading-snug text-[#35609a]">
        For administrators, teachers, and registered students. The website itself is open to everyone.
      </p>

      {/* role tabs */}
      <div role="tablist" className="mt-6 grid grid-cols-2 rounded-full border border-[#e4d3ad] bg-[#f6efe0] p-1">
        {TABS.map((t) => (
          <button
            key={t.role}
            type="button"
            role="tab"
            aria-selected={role === t.role}
            onClick={() => { setRole(t.role); setError(''); setId(''); }}
            className={`rounded-full px-3 py-2 font-sans text-[12.5px] font-semibold transition ${role === t.role ? 'bg-[#0f2352] text-white shadow' : 'text-[#0f2352]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <label className="block">
          <span className="mb-1.5 block font-sans text-[12px] font-medium text-[#0f2352]">{tab.idLabel}</span>
          <input type={tab.idType} value={id} onChange={(e) => setId(e.target.value)} placeholder={tab.idPlaceholder} autoComplete="username" required className={input} />
        </label>

        <label className="block">
          <span className="mb-1.5 block font-sans text-[12px] font-medium text-[#0f2352]">Password</span>
          <div className="relative">
            <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required className={`${input} pr-16`} />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 font-sans text-[11px] font-semibold text-[#b9852a]">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {error && (
          <p role="alert" className="rounded-lg border border-[#f0c9c4] bg-[#fdf1ef] px-3 py-2 font-sans text-[12.5px] text-[#a03a2c]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !id || !password}
          className="w-full rounded-full bg-gradient-to-b from-[#d3a03c] to-[#b9852a] py-3 font-sans text-[13.5px] font-semibold text-white shadow-[0_3px_10px_rgba(185,133,42,.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 border-t border-[#f0e4cc] pt-5 text-center font-sans text-[13px] text-[#5a6479]">
        <span>New Sunday School student? </span>
        <Link href="/register" className="font-semibold text-[#b9852a] underline hover:text-[#8a5a00]">
          Register online
        </Link>
      </div>
    </div>
  );
}
