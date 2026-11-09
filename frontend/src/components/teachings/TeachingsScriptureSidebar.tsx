'use client';

/** TeachingsScriptureSidebar.tsx — right column: daily quote banner. */

import React from 'react';
import { TeachingsQuoteBanner } from './TeachingsQuoteBanner';

export function TeachingsScriptureSidebar() {
  return (
    <aside className="flex flex-col gap-[17px]">
      <TeachingsQuoteBanner />
    </aside>
  );
}
