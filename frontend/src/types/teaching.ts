/**
 * Teaching entity — mirrors backend Prisma model shape
 * and provides full multi-media support (Video, Audio, PDF Book, or Both).
 */

export interface TeachingCategory {
  key: string;
  en: string;
  am: string;
  icon?: string;
}

export const DEFAULT_TEACHING_COVER =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';

export const INITIAL_TEACHING_CATEGORIES: TeachingCategory[] = [
  { key: 'holy-bible', en: 'Holy Bible', am: 'መጽሐፍ ቅዱስ', icon: 'bible' },
  { key: 'dogma', en: 'Dogma', am: 'ነገረ መለኮት', icon: 'faith' },
  { key: 'church-history', en: 'Church History', am: 'የቤተክርስቲያን ታሪክ', icon: 'father' },
  { key: 'patristics', en: 'Patristics', am: 'የአበው ትምህርት', icon: 'father' },
  { key: 'spiritual-life', en: 'Spiritual Life', am: 'መንፈሳዊ ሕይወት', icon: 'flame' },
  { key: 'youth-teachings', en: 'Youth Teachings', am: 'የወጣቶች ትምህርት', icon: 'youth' },
];

export interface Teaching {
  id: string;
  title: string;
  titleAm?: string;
  content: string;
  author?: string | null;
  category?: string | null;
  subject?: string | null;
  format?: 'pdf' | 'audio' | 'video' | 'both';
  mediaUrl?: string | null;
  imageUrl?: string | null;
  metaExtra?: string; // e.g. "4 Pages", "32:45 min", "Video + Book"
  
  // Specific media fields for multi-format support
  pdfUrl?: string | null;
  pdfFileName?: string | null;
  pdfPages?: number | string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
  audioFileName?: string | null;
  durationMinutes?: number | null;
  description?: string;
  outline?: string[];

  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
