import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(5, 'Description is required'),
  location: z.string().min(2, 'Location is required'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  category: z.string().default('General'),
  imageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
});

export const updateEventSchema = createEventSchema.partial();
