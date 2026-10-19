import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma } from '@prisma/client';

export async function getPublicMezmurs(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { category, search } = req.query;

  const whereClause: Prisma.MezmurWhereInput = {
    isPublished: true,
  };

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { originalTitle: { contains: search.trim() } },
      { lyrics: { contains: search.trim() } },
      { artistChoir: { contains: search.trim() } },
    ];
  }

  const [total, mezmurs] = await Promise.all([
    prisma.mezmur.count({ where: whereClause }),
    prisma.mezmur.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, mezmurs, 'Public mezmurs retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function getPublicMezmurById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const mezmur = await prisma.mezmur.findFirst({
    where: { id, isPublished: true },
  });

  if (!mezmur) {
    sendError(res, 'Mezmur not found or not published', 404);
    return;
  }

  sendSuccess(res, mezmur, 'Mezmur retrieved successfully');
}

export async function getAdminMezmurs(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { isPublished, category, search } = req.query;

  const whereClause: Prisma.MezmurWhereInput = {};

  if (isPublished !== undefined) {
    whereClause.isPublished = isPublished === 'true';
  }

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { originalTitle: { contains: search.trim() } },
      { lyrics: { contains: search.trim() } },
      { artistChoir: { contains: search.trim() } },
    ];
  }

  const [total, mezmurs] = await Promise.all([
    prisma.mezmur.count({ where: whereClause }),
    prisma.mezmur.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, mezmurs, 'Admin mezmurs retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function createMezmur(req: Request, res: Response): Promise<void> {
  const { title, originalTitle, lyrics, category, artistChoir, audioUrl, isPublished } = req.body;

  const mezmur = await prisma.mezmur.create({
    data: {
      title,
      originalTitle,
      lyrics,
      category,
      artistChoir,
      audioUrl,
      isPublished: isPublished ?? false,
    },
  });

  sendSuccess(res, mezmur, 'Mezmur created successfully', 201);
}

export async function updateMezmur(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, originalTitle, lyrics, category, artistChoir, audioUrl, isPublished } = req.body;

  const existing = await prisma.mezmur.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Mezmur not found', 404);
    return;
  }

  const updated = await prisma.mezmur.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(originalTitle !== undefined && { originalTitle }),
      ...(lyrics !== undefined && { lyrics }),
      ...(category !== undefined && { category }),
      ...(artistChoir !== undefined && { artistChoir }),
      ...(audioUrl !== undefined && { audioUrl }),
      ...(isPublished !== undefined && { isPublished }),
    },
  });

  sendSuccess(res, updated, 'Mezmur updated successfully');
}

export async function deleteMezmur(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.mezmur.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Mezmur not found', 404);
    return;
  }

  await prisma.mezmur.delete({ where: { id } });

  sendSuccess(res, null, 'Mezmur deleted successfully');
}
