'use client';

/**
 * useSiteLogo.ts   →  src/lib/useSiteLogo.ts
 *
 * One shared source for the site logo URL. Header, Footer (and anything else)
 * call useSiteLogo(); when the admin uploads a new logo, notifyLogoChanged()
 * makes every mounted component refresh instantly.
 */

import { useEffect, useState } from 'react';

/** Put your abun.jpg in  public/abun.jpg  — it is used until an admin uploads another one. */
export const DEFAULT_LOGO = '/abun.jpg';

const EVENT = 'site-logo-changed';

let cached: string | null = null;
let inflight: Promise<string> | null = null;

function load(): Promise<string> {
  if (!inflight) {
    inflight = fetch('/api/site-logo', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => (cached = j.url || DEFAULT_LOGO))
      .catch(() => (cached = DEFAULT_LOGO))
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Call after uploading / resetting the logo so header + footer update right away. */
export function notifyLogoChanged() {
  cached = null;
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT));
}

export function useSiteLogo(): string {
  const [url, setUrl] = useState<string>(cached ?? DEFAULT_LOGO);

  useEffect(() => {
    let alive = true;
    const run = () => {
      (cached ? Promise.resolve(cached) : load()).then((u) => {
        if (alive) setUrl(u);
      });
    };
    run();
    window.addEventListener(EVENT, run);
    return () => {
      alive = false;
      window.removeEventListener(EVENT, run);
    };
  }, []);

  return url;
}