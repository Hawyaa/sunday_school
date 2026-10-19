import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma } from '@prisma/client';

// ================= ALBUMS =================

export async function getPublicAlbums(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;

  const whereClause: Prisma.GalleryAlbumWhereInput = {
    isPublished: true,
  };

  const [total, albums] = await Promise.all([
    prisma.galleryAlbum.count({ where: whereClause }),
    prisma.galleryAlbum.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { photos: true },
        },
      },
    }),
  ]);

  const formattedAlbums = albums.map((album) => ({
    ...album,
    photosCount: album._count.photos,
  }));

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, formattedAlbums, 'Public albums retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function getPublicAlbumById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const album = await prisma.galleryAlbum.findFirst({
    where: { id, isPublished: true },
    include: {
      photos: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!album) {
    sendError(res, 'Gallery album not found or not published', 404);
    return;
  }

  sendSuccess(res, album, 'Gallery album details retrieved');
}

export async function getAdminAlbums(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { isPublished } = req.query;

  const whereClause: Prisma.GalleryAlbumWhereInput = {};
  if (isPublished !== undefined) {
    whereClause.isPublished = isPublished === 'true';
  }

  const [total, albums] = await Promise.all([
    prisma.galleryAlbum.count({ where: whereClause }),
    prisma.galleryAlbum.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { photos: true },
        },
      },
    }),
  ]);

  const formattedAlbums = albums.map((album) => ({
    ...album,
    photosCount: album._count.photos,
  }));

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, formattedAlbums, 'Admin albums retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function createAlbum(req: Request, res: Response): Promise<void> {
  const { title, description, coverImageUrl, eventDate, isPublished } = req.body;

  const album = await prisma.galleryAlbum.create({
    data: {
      title,
      description,
      coverImageUrl,
      eventDate: eventDate ? new Date(eventDate) : null,
      isPublished: isPublished ?? false,
    },
  });

  sendSuccess(res, album, 'Gallery album created successfully', 201);
}

export async function updateAlbum(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, description, coverImageUrl, eventDate, isPublished } = req.body;

  const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Gallery album not found', 404);
    return;
  }

  const updated = await prisma.galleryAlbum.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(coverImageUrl !== undefined && { coverImageUrl }),
      ...(eventDate !== undefined && { eventDate: eventDate ? new Date(eventDate) : null }),
      ...(isPublished !== undefined && { isPublished }),
    },
  });

  sendSuccess(res, updated, 'Gallery album updated successfully');
}

export async function deleteAlbum(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Gallery album not found', 404);
    return;
  }

  await prisma.galleryAlbum.delete({ where: { id } });

  sendSuccess(res, null, 'Gallery album deleted successfully');
}

// ================= PHOTOS =================

export async function addPhotoToAlbum(req: Request, res: Response): Promise<void> {
  const { albumId } = req.params;
  const { title, imageUrl, caption, sortOrder } = req.body;

  const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
  if (!album) {
    sendError(res, 'Gallery album not found', 404);
    return;
  }

  const photo = await prisma.galleryPhoto.create({
    data: {
      albumId,
      title,
      imageUrl,
      caption,
      sortOrder: sortOrder ?? 0,
    },
  });

  sendSuccess(res, photo, 'Photo added to album successfully', 201);
}

export async function updatePhoto(req: Request, res: Response): Promise<void> {
  const { photoId } = req.params;
  const { title, imageUrl, caption, sortOrder } = req.body;

  const existing = await prisma.galleryPhoto.findUnique({ where: { id: photoId } });
  if (!existing) {
    sendError(res, 'Gallery photo not found', 404);
    return;
  }

  const updated = await prisma.galleryPhoto.update({
    where: { id: photoId },
    data: {
      ...(title !== undefined && { title }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(caption !== undefined && { caption }),
      ...(sortOrder !== undefined && { sortOrder }),
    },
  });

  sendSuccess(res, updated, 'Gallery photo updated successfully');
}

export async function deletePhoto(req: Request, res: Response): Promise<void> {
  const { photoId } = req.params;

  const existing = await prisma.galleryPhoto.findUnique({ where: { id: photoId } });
  if (!existing) {
    sendError(res, 'Gallery photo not found', 404);
    return;
  }

  await prisma.galleryPhoto.delete({ where: { id: photoId } });

  sendSuccess(res, null, 'Gallery photo deleted successfully');
}
