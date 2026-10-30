/**
 * timeline-page.tsx   →  save as  src/app/about/timeline/page.tsx
 *
 * The page that opens when someone clicks "View Our Timeline".
 */

import type { Metadata } from 'next';
import { TimelineDetail } from '@/components/about/TimelineDetail';

export const metadata: Metadata = {
  title: 'Our Timeline | Abune Media',
  description: 'The story of Abune Media, year by year.',
};

export default function TimelinePage() {
  return <TimelineDetail />;
}