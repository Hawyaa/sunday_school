import { z } from 'zod';

export const createContactMessageSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (at least 2 characters)'),
  contactInfo: z.string().min(3, 'Phone or email is required'),
  topic: z.string().optional().default('General question'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});
