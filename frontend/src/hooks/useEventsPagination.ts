'use client';

/**
 * useEventsPagination.ts
 *
 * Cuts a list into pages. Use it in the component that owns the filter/search state
 * (the one that renders EventsToolbar + EventsList + EventsPagination).
 */

import { useEffect, useMemo, useState } from 'react';

export function useEventsPagination<T>(
  items: T[],
  perPage = 6,
  resetKey = '' // pass something like `${category}|${search}|${sort}` -> goes back to page 1 when it changes
) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  // back to page 1 when filters / search / sort change
  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  // never stay on a page that no longer exists
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(
    () => items.slice((page - 1) * perPage, page * perPage),
    [items, page, perPage]
  );

  return { page, setPage, totalPages, pageItems };
}