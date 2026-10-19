import { z } from 'zod';

export const createAlbumSchema = z.object({
  title: z.string().min(2, 'Album title is required'),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  eventDate: z.string().datetime().optional().nullable(),
  isPublished: z.boolean().default(false),
});

export const updateAlbumSchema = createAlbumSchema.partial();

export const createPhotoSchema = z.object({
  title: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  caption: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const updatePhotoSchema = createPhotoSchema.partial();
