import { z } from 'zod';

export const createMezmurSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  originalTitle: z.string().optional().nullable(),
  lyrics: z.string().min(5, 'Lyrics are required'),
  category: z.string().default('General'),
  artistChoir: z.string().optional().nullable(),
  audioUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
});

export const updateMezmurSchema = createMezmurSchema.partial();
