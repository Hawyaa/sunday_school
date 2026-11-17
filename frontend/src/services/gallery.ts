import { apiClient } from '@/lib/api';

export interface GalleryPhotoItem {
  id: string;
  albumId: string;
  title: string;
  caption?: string | null;
  imageUrl: string;
  sortOrder?: number;
  album?: {
    id: string;
    title: string;
    description?: string | null;
  };
}

export interface GalleryAlbumItem {
  id: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  eventDate?: string | null;
  photosCount?: number;
  photos?: GalleryPhotoItem[];
}

export async function fetchGalleryAlbums(page = 1, limit = 20): Promise<GalleryAlbumItem[]> {
  try {
    const res = await apiClient.get<{ success: boolean; data: GalleryAlbumItem[] }>(
      `/gallery/albums?page=${page}&limit=${limit}`
    );
    return res.data?.data ?? [];
  } catch (error) {
    console.error('Failed to fetch gallery albums:', error);
    return [];
  }
}

export async function fetchGalleryAlbumById(id: string): Promise<GalleryAlbumItem | null> {
  try {
    const res = await apiClient.get<{ success: boolean; data: GalleryAlbumItem }>(
      `/gallery/albums/${id}`
    );
    return res.data?.data ?? null;
  } catch (error) {
    console.error(`Failed to fetch gallery album ${id}:`, error);
    return null;
  }
}

export async function fetchGalleryPhotos(params?: {
  albumId?: string;
  category?: string;
}): Promise<GalleryPhotoItem[]> {
  try {
    const query = new URLSearchParams();
    if (params?.albumId) query.set('albumId', params.albumId);
    if (params?.category) query.set('category', params.category);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get<{ success: boolean; data: GalleryPhotoItem[] }>(
      `/gallery/photos${qs}`
    );
    return res.data?.data ?? [];
  } catch (error) {
    console.error('Failed to fetch gallery photos:', error);
    return [];
  }
}
