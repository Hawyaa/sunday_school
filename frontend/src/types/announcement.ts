/**
 * types/announcement.ts
 *
 * Announcement entity — mirrors backend Prisma model shape
 * returned by GET /api/announcements
 */
export interface Announcement {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  category: string;
  imageUrl?: string | null;
  isPinned: boolean;
  publishedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

/**
 * Paginated envelope returned by every list endpoint.
 * Generic so it can be used across all modules.
 */
export interface PaginatedResponse<T> {
  data: T[];
  message: string;
  success: boolean;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
