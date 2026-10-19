import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma } from '@prisma/client';

export async function getPublicSchedule(req: Request, res: Response): Promise<void> {
  const { dayOfWeek, targetGroup } = req.query;

  const whereClause: Prisma.ScheduleWhereInput = {
    isPublished: true,
  };

  if (dayOfWeek && typeof dayOfWeek === 'string' && dayOfWeek !== 'All') {
    whereClause.dayOfWeek = dayOfWeek;
  }

  if (targetGroup && typeof targetGroup === 'string') {
    whereClause.targetGroup = targetGroup;
  }

  const schedules = await prisma.schedule.findMany({
    where: whereClause,
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });

  sendSuccess(res, schedules, 'Public schedule retrieved');
}

export async function getPublicScheduleById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const schedule = await prisma.schedule.findFirst({
    where: { id, isPublished: true },
  });

  if (!schedule) {
    sendError(res, 'Schedule item not found or not published', 404);
    return;
  }

  sendSuccess(res, schedule, 'Schedule item retrieved successfully');
}

export async function getAdminSchedules(req: Request, res: Response): Promise<void> {
  const { isPublished, dayOfWeek } = req.query;

  const whereClause: Prisma.ScheduleWhereInput = {};

  if (isPublished !== undefined) {
    whereClause.isPublished = isPublished === 'true';
  }

  if (dayOfWeek && typeof dayOfWeek === 'string' && dayOfWeek !== 'All') {
    whereClause.dayOfWeek = dayOfWeek;
  }

  const schedules = await prisma.schedule.findMany({
    where: whereClause,
    orderBy: [{ createdAt: 'desc' }],
  });

  sendSuccess(res, schedules, 'Admin schedules retrieved');
}

export async function createSchedule(req: Request, res: Response): Promise<void> {
  const {
    title,
    activity,
    dayOfWeek,
    specificDate,
    startTime,
    endTime,
    targetGroup,
    location,
    isPublished,
  } = req.body;

  const schedule = await prisma.schedule.create({
    data: {
      title,
      activity,
      dayOfWeek,
      specificDate: specificDate ? new Date(specificDate) : null,
      startTime,
      endTime,
      targetGroup,
      location,
      isPublished: isPublished ?? false,
    },
  });

  sendSuccess(res, schedule, 'Schedule item created successfully', 201);
}

export async function updateSchedule(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const {
    title,
    activity,
    dayOfWeek,
    specificDate,
    startTime,
    endTime,
    targetGroup,
    location,
    isPublished,
  } = req.body;

  const existing = await prisma.schedule.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Schedule item not found', 404);
    return;
  }

  const updated = await prisma.schedule.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(activity !== undefined && { activity }),
      ...(dayOfWeek !== undefined && { dayOfWeek }),
      ...(specificDate !== undefined && { specificDate: specificDate ? new Date(specificDate) : null }),
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      ...(targetGroup !== undefined && { targetGroup }),
      ...(location !== undefined && { location }),
      ...(isPublished !== undefined && { isPublished }),
    },
  });

  sendSuccess(res, updated, 'Schedule item updated successfully');
}

export async function deleteSchedule(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.schedule.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Schedule item not found', 404);
    return;
  }

  await prisma.schedule.delete({ where: { id } });

  sendSuccess(res, null, 'Schedule item deleted successfully');
}
