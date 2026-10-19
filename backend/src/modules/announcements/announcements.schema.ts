import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.string().min(5, 'Content must be at least 5 characters long'),
  summary: z.string().optional(),
  category: z.string().default('General'),
  imageUrl: z.string().url().or(z.string().startsWith('/uploads/')).optional().nullable(),
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export const queryAnnouncementsSchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 10)),
  category: z.string().optional(),
  search: z.string().optional(),
  isPublished: z.string().optional().transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  isArchived: z.string().optional().transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  isPinned: z.string().optional().transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
});
