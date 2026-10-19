import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma } from '@prisma/client';

export async function getPublicTeachings(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { category, search } = req.query;

  const whereClause: Prisma.TeachingWhereInput = {
    isPublished: true,
  };

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { content: { contains: search.trim() } },
      { author: { contains: search.trim() } },
    ];
  }

  const [total, teachings] = await Promise.all([
    prisma.teaching.count({ where: whereClause }),
    prisma.teaching.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, teachings, 'Public teachings retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function getPublicTeachingById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const teaching = await prisma.teaching.findFirst({
    where: { id, isPublished: true },
  });

  if (!teaching) {
    sendError(res, 'Teaching not found or not published', 404);
    return;
  }

  sendSuccess(res, teaching, 'Teaching retrieved successfully');
}

export async function getAdminTeachings(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { isPublished, category, search } = req.query;

  const whereClause: Prisma.TeachingWhereInput = {};

  if (isPublished !== undefined) {
    whereClause.isPublished = isPublished === 'true';
  }

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { content: { contains: search.trim() } },
      { author: { contains: search.trim() } },
    ];
  }

  const [total, teachings] = await Promise.all([
    prisma.teaching.count({ where: whereClause }),
    prisma.teaching.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, teachings, 'Admin teachings retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function createTeaching(req: Request, res: Response): Promise<void> {
  const { title, content, author, category, mediaUrl, isPublished, publishedAt } = req.body;

  const teaching = await prisma.teaching.create({
    data: {
      title,
      content,
      author,
      category,
      mediaUrl,
      isPublished: isPublished ?? false,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    },
  });

  sendSuccess(res, teaching, 'Teaching created successfully', 201);
}

export async function updateTeaching(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, content, author, category, mediaUrl, isPublished, publishedAt } = req.body;

  const existing = await prisma.teaching.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Teaching not found', 404);
    return;
  }

  const updated = await prisma.teaching.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(author !== undefined && { author }),
      ...(category !== undefined && { category }),
      ...(mediaUrl !== undefined && { mediaUrl }),
      ...(isPublished !== undefined && { isPublished }),
      ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : new Date() }),
    },
  });

  sendSuccess(res, updated, 'Teaching updated successfully');
}

export async function deleteTeaching(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.teaching.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Teaching not found', 404);
    return;
  }

  await prisma.teaching.delete({ where: { id } });

  sendSuccess(res, null, 'Teaching deleted successfully');
}
