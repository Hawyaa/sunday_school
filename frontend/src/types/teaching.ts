/**
 * Teaching entity — mirrors backend Prisma model shape
 * returned by GET /api/teachings
 */
export interface Teaching {
  id: string;
  title: string;
  titleAm?: string;
  content: string;
  author?: string | null;
  category?: string | null;
  subject?: string | null;
  format?: 'pdf' | 'audio' | 'video';
  mediaUrl?: string | null;
  imageUrl?: string | null;
  metaExtra?: string; // e.g. "4 Pages", "32:45 min"
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
