'use client';

/**
 * SidebarWidgets.tsx
 *
 * Composes the three sidebar widgets: EventWidget + QuickLinks + DailyQuote.
 *
 * Props:
 *  - event     : ChurchEvent | null — passed from the home page via useHomeData
 *  - isLoading : bool — forwarded to EventWidget for skeleton state
 *
 * Why a wrapper? It keeps the home page JSX tidy and gives us one import
 * instead of three while still isolating each widget for reuse elsewhere.
 */

import React from 'react';
import { EventWidget } from '@/components/home/EventWidget';
import { QuickLinks } from '@/components/home/QuickLinks';
import { DailyQuote } from '@/components/home/DailyQuote';
import type { ChurchEvent } from '@/types/event';

interface Props {
  event?: ChurchEvent | null;
  isLoading?: boolean;
}

export function SidebarWidgets({ event, isLoading = false }: Props) {
  return (
    <aside className="space-y-8">
      <EventWidget event={event} isLoading={isLoading} />
      <QuickLinks />
      <DailyQuote />
    </aside>
  );
}
