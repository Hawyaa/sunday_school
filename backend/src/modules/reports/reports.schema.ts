import { z } from 'zod';

export const createReportSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  summary: z.string().optional(),
  content: z.string().min(5, 'Content is required'),
  category: z.string().default('General'),
  fileUrl: z.string().optional().nullable(),
  reportDate: z.string().datetime(),
  isPublished: z.boolean().default(false),
});

export const updateReportSchema = createReportSchema.partial();
