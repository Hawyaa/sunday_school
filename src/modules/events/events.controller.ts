import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma } from '@prisma/client';

export async function getPublicEvents(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { category, search } = req.query;

  const whereClause: Prisma.EventWhereInput = {
    isPublished: true,
  };

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { description: { contains: search.trim() } },
      { location: { contains: search.trim() } },
    ];
  }

  const [total, events] = await Promise.all([
    prisma.event.count({ where: whereClause }),
    prisma.event.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { startDate: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, events, 'Public events retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function getPublicEventById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const event = await prisma.event.findFirst({
    where: { id, isPublished: true },
  });

  if (!event) {
    sendError(res, 'Event not found or is not published', 404);
    return;
  }

  sendSuccess(res, event, 'Event retrieved successfully');
}

export async function getAdminEvents(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { isPublished, category, search } = req.query;

  const whereClause: Prisma.EventWhereInput = {};

  if (isPublished !== undefined) {
    whereClause.isPublished = isPublished === 'true';
  }

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { description: { contains: search.trim() } },
      { location: { contains: search.trim() } },
    ];
  }

  const [total, events] = await Promise.all([
    prisma.event.count({ where: whereClause }),
    prisma.event.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { startDate: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, events, 'Admin events retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function createEvent(req: Request, res: Response): Promise<void> {
  const { title, description, location, startDate, endDate, category, imageUrl, isPublished } = req.body;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      location,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      category,
      imageUrl,
      isPublished: isPublished ?? false,
    },
  });

  sendSuccess(res, event, 'Event created successfully', 201);
}

export async function updateEvent(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, description, location, startDate, endDate, category, imageUrl, isPublished } = req.body;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Event not found', 404);
    return;
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(location !== undefined && { location }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      ...(category !== undefined && { category }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isPublished !== undefined && { isPublished }),
    },
  });

  sendSuccess(res, updated, 'Event updated successfully');
}

export async function deleteEvent(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Event not found', 404);
    return;
  }

  await prisma.event.delete({ where: { id } });

  sendSuccess(res, null, 'Event deleted successfully');
}
