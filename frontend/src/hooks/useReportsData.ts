'use client';

/**
 * hooks/useReportsData.ts
 *
 * The first render uses INITIAL_REPORTS (same on server and browser) so hydration matches.
 * Stored / API reports are loaded in the effect, after the page has mounted.
 */

import { useEffect, useState } from 'react';
import { fetchReports } from '@/services/reports';
import type { ChurchReport } from '@/types/report';
import { getStoredReports, INITIAL_REPORTS } from '@/lib/contentStore';

export const FALLBACK_REPORTS: ChurchReport[] = INITIAL_REPORTS;

export function useReportsData(year: string, category: string, search: string) {
  // Deterministic first render (no localStorage here!)
  const [reports, setReports] = useState<ChurchReport[]>(INITIAL_REPORTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    function applyFilter(baseReports: ChurchReport[]) {
      let filtered = baseReports;
      if (year && year !== 'All') {
        filtered = filtered.filter((r) => r.dateStr.includes(year));
      }
      if (category && category !== 'All Types' && category !== 'All') {
        filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            (r.titleAm && r.titleAm.includes(q)) ||
            (r.description && r.description.toLowerCase().includes(q)),
        );
      }
      return filtered;
    }

    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchReports(year, category, search);
        if (cancelled) return;
        setReports(data && data.length > 0 ? data : applyFilter(getStoredReports()));
      } catch {
        if (!cancelled) setReports(applyFilter(getStoredReports()));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    const handleUpdate = () => setReports(applyFilter(getStoredReports()));
    window.addEventListener('abune_content_store_updated', handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, [year, category, search]);

  return { reports, isLoading };
}