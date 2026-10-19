import { z } from 'zod';

export const createTeachingSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  author: z.string().optional().nullable(),
  category: z.string().default('General'),
  mediaUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const updateTeachingSchema = createTeachingSchema.partial();
