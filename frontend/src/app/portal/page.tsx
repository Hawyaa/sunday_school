'use client';

/**
 * src/app/portal/page.tsx  ->  /portal   (students / members only)
 * Starter student portal. Add real sections (registration status, materials) later.
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useSession } from '@/components/auth/useSession';
import { logout } from '@/lib/auth';

const LINKS = [
  { href: '/announcements', title: 'Announcements', text: 'Latest news from the Sunday School.' },
  { href: '/teachings', title: 'Teachings', text: 'Lessons and spiritual materials.' },
  { href: '/events', title: 'Events', text: 'Upcoming gatherings and feasts.' },
];

const STATUS = {
  PENDING: { label: 'Waiting for approval', cls: 'bg-[#fdf3dc] text-[#8a5a00] border-[#f0d9a0]' },
  APPROVED: { label: 'Approved', cls: 'bg-[#e6f4ea] text-[#1e6b35] border-[#bfe0c9]' },
  REJECTED: { label: 'Not approved', cls: 'bg-[#fdf1ef] text-[#a03a2c] border-[#f0c9c4]' },
} as const;

function PortalContent() {
  const router = useRouter();
  const { session } = useSession();

  async function onLogout() {
    await logout();
    router.replace('/');
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[.12em] text-[#5a6479]">Student portal</p>
          <h1 className="font-['Playfair_Display',Georgia,serif] text-[32px] font-bold text-[#0f2352]">
            Welcome, {session?.user.name}
          </h1>
        </div>
        <button onClick={onLogout} className="rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] px-5 py-2 font-sans text-[12.5px] font-semibold text-[#b9852a]">
          Sign out
        </button>
      </div>

      {session?.user.registrationNumber && (
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border border-[#ece5d8] bg-[#fffdf9] p-5 font-sans text-[13px] text-[#1c2740] shadow-[0_3px_14px_rgba(15,35,82,.06)]">
          <span>Registration No: <b className="text-[#0f2352]">{session.user.registrationNumber}</b></span>
          {session.user.division && <span>Division: <b className="text-[#0f2352]">{session.user.division}</b></span>}
          {session.user.status && (
            <span className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${STATUS[session.user.status].cls}`}>
              {STATUS[session.user.status].label}
            </span>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-xl border border-[#ece5d8] bg-[#fffdf9] p-5 shadow-[0_3px_14px_rgba(15,35,82,.06)] transition hover:-translate-y-0.5">
            <h3 className="font-['Playfair_Display',Georgia,serif] text-[17px] font-bold text-[#0f2352]">{l.title}</h3>
            <p className="mt-1 font-['Crimson_Text',Georgia,serif] text-[15.5px] text-[#35609a]">{l.text}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default function PortalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5eee1]">
      <Header />
      <RequireAuth role="member">
        <PortalContent />
      </RequireAuth>
      <Footer />
    </div>
  );
}