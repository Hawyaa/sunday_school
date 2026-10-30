/**
 * types/gallery.ts
 */

export interface GalleryAlbum {
  id: string;
  title: string;
  titleAm: string;
  category: string;
  categoryAm: string;
  photoCount: number;
  coverUrl: string;
  previewImages: string[];
  date: string;
  description?: string;
  descriptionAm?: string;
}
