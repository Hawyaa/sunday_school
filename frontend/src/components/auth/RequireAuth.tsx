'use client';

/**
 * RequireAuth.tsx
 * Wrap any private page. Public pages never use it, so the website stays open.
 *
 *   <RequireAuth role="admin">...admin screens...</RequireAuth>
 *   <RequireAuth role="member">...student portal...</RequireAuth>
 */

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Role } from '@/lib/auth';
import { useSession } from './useSession';

export function RequireAuth({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, ready } = useSession();
  const allowed = !!session && session.role === role;

  useEffect(() => {
    if (ready && !allowed) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, allowed, router, pathname]);

  if (!ready || !allowed) {
    return (
      <div className="grid min-h-[50vh] place-items-center font-['Crimson_Text',Georgia,serif] text-[17px] text-[#35609a]">
        Checking access…
      </div>
    );
  }
  return <>{children}</>;
}