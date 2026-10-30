'use client';

import { useEffect, useState } from 'react';
import { getSession, type Session } from '@/lib/auth';

/** Reads the saved session in the browser. `ready` is false until the first read. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setReady(true);
  }, []);

  return { session, ready };
}