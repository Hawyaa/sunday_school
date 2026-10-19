import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma } from '@prisma/client';

/**
 * Public: List announcements that are published, visible, and not expired
 */
export async function getPublicAnnouncements(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { category, search } = req.query;

  const now = new Date();

  const whereClause: Prisma.AnnouncementWhereInput = {
    isPublished: true,
    isArchived: false,
    publishedAt: { lte: now },
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
  };

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.AND = [
      {
        OR: [
          { title: { contains: search.trim() } },
          { summary: { contains: search.trim() } },
          { content: { contains: search.trim() } },
        ],
      },
    ];
  }

  const [total, announcements] = await Promise.all([
    prisma.announcement.count({ where: whereClause }),
    prisma.announcement.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        category: true,
        imageUrl: true,
        isPinned: true,
        publishedAt: true,
        expiresAt: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, announcements, 'Public announcements retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

/**
 * Public: View single announcement
 */
export async function getPublicAnnouncementById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const now = new Date();

  const announcement = await prisma.announcement.findFirst({
    where: {
      id,
      isPublished: true,
      isArchived: false,
      publishedAt: { lte: now },
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: {
      id: true,
      title: true,
      summary: true,
      content: true,
      category: true,
      imageUrl: true,
      isPinned: true,
      publishedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  if (!announcement) {
    sendError(res, 'Announcement not found or is not currently published', 404);
    return;
  }

  sendSuccess(res, announcement, 'Announcement details retrieved');
}

/**
 * Admin: List all announcements with administrative filters
 */
export async function getAdminAnnouncements(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { category, search, isPublished, isArchived, isPinned } = req.query;

  const whereClause: Prisma.AnnouncementWhereInput = {};

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (isPublished !== undefined) {
    whereClause.isPublished = isPublished === 'true';
  }

  if (isArchived !== undefined) {
    whereClause.isArchived = isArchived === 'true';
  }

  if (isPinned !== undefined) {
    whereClause.isPinned = isPinned === 'true';
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { summary: { contains: search.trim() } },
      { content: { contains: search.trim() } },
    ];
  }

  const [total, announcements] = await Promise.all([
    prisma.announcement.count({ where: whereClause }),
    prisma.announcement.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, announcements, 'Admin announcements list retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

/**
 * Admin: Get single announcement
 */
export async function getAdminAnnouncementById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!announcement) {
    sendError(res, 'Announcement not found', 404);
    return;
  }

  sendSuccess(res, announcement, 'Announcement details retrieved');
}

/**
 * Admin: Create announcement
 */
export async function createAnnouncement(req: Request, res: Response): Promise<void> {
  const {
    title,
    content,
    summary,
    category,
    imageUrl,
    isPinned,
    isPublished,
    publishedAt,
    expiresAt,
  } = req.body;

  let effectivePublishedAt = publishedAt ? new Date(publishedAt) : null;
  if (isPublished && !effectivePublishedAt) {
    effectivePublishedAt = new Date();
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      summary,
      category,
      imageUrl,
      isPinned: isPinned ?? false,
      isPublished: isPublished ?? false,
      publishedAt: effectivePublishedAt,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdById: req.admin?.id,
    },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  sendSuccess(res, announcement, 'Announcement created successfully', 201);
}

/**
 * Admin: Update announcement
 */
export async function updateAnnouncement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const {
    title,
    content,
    summary,
    category,
    imageUrl,
    isPinned,
    isPublished,
    publishedAt,
    expiresAt,
    isArchived,
  } = req.body;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Announcement not found', 404);
    return;
  }

  let effectivePublishedAt = publishedAt !== undefined ? (publishedAt ? new Date(publishedAt) : null) : existing.publishedAt;
  if (isPublished === true && !effectivePublishedAt) {
    effectivePublishedAt = new Date();
  }

  const updated = await prisma.announcement.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(summary !== undefined && { summary }),
      ...(category !== undefined && { category }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isPinned !== undefined && { isPinned }),
      ...(isPublished !== undefined && { isPublished }),
      ...(effectivePublishedAt !== undefined && { publishedAt: effectivePublishedAt }),
      ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      ...(isArchived !== undefined && { isArchived }),
    },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  sendSuccess(res, updated, 'Announcement updated successfully');
}

/**
 * Admin: Toggle pin status
 */
export async function togglePinAnnouncement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Announcement not found', 404);
    return;
  }

  const updated = await prisma.announcement.update({
    where: { id },
    data: { isPinned: !existing.isPinned },
  });

  sendSuccess(res, updated, `Announcement ${updated.isPinned ? 'pinned' : 'unpinned'} successfully`);
}

/**
 * Admin: Toggle publish / schedule publication
 */
export async function togglePublishAnnouncement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { publishedAt, isPublished } = req.body;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Announcement not found', 404);
    return;
  }

  const targetPublished = isPublished !== undefined ? isPublished : !existing.isPublished;
  let targetPublishedAt = existing.publishedAt;

  if (publishedAt) {
    targetPublishedAt = new Date(publishedAt);
  } else if (targetPublished && !targetPublishedAt) {
    targetPublishedAt = new Date();
  }

  const updated = await prisma.announcement.update({
    where: { id },
    data: {
      isPublished: targetPublished,
      publishedAt: targetPublishedAt,
    },
  });

  sendSuccess(res, updated, `Announcement publication status updated`);
}

/**
 * Admin: Toggle archive status
 */
export async function toggleArchiveAnnouncement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Announcement not found', 404);
    return;
  }

  const updated = await prisma.announcement.update({
    where: { id },
    data: { isArchived: !existing.isArchived },
  });

  sendSuccess(res, updated, `Announcement ${updated.isArchived ? 'archived' : 'restored'} successfully`);
}

/**
 * Admin: Delete announcement
 */
export async function deleteAnnouncement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Announcement not found', 404);
    return;
  }

  await prisma.announcement.delete({ where: { id } });

  sendSuccess(res, null, 'Announcement deleted successfully');
}
