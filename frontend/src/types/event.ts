/**
 * Event entity — mirrors backend Prisma model shape
 * returned by GET /api/events
 */
export interface ChurchEvent {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
