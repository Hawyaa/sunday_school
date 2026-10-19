import { z } from 'zod';

export const createScheduleSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  activity: z.string().min(2, 'Activity description is required'),
  dayOfWeek: z.string().optional().nullable(),
  specificDate: z.string().datetime().optional().nullable(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be HH:MM format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be HH:MM format'),
  targetGroup: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
});

export const updateScheduleSchema = createScheduleSchema.partial();
