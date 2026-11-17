import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma } from '@prisma/client';

export async function submitContactMessage(req: Request, res: Response): Promise<void> {
  const { fullName, contactInfo, topic, message } = req.body;

  const newMessage = await prisma.contactMessage.create({
    data: {
      fullName: String(fullName).trim(),
      contactInfo: String(contactInfo).trim(),
      topic: topic ? String(topic).trim() : 'General question',
      message: String(message).trim(),
    },
  });

  sendSuccess(res, newMessage, 'Your message has been sent successfully. We will reply as soon as we can.', 201);
}

export async function getAdminContactMessages(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
  const skip = (page - 1) * limit;
  const { isRead, search } = req.query;

  const whereClause: Prisma.ContactMessageWhereInput = {};

  if (isRead !== undefined && isRead !== 'all') {
    whereClause.isRead = isRead === 'true';
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { fullName: { contains: search.trim() } },
      { contactInfo: { contains: search.trim() } },
      { topic: { contains: search.trim() } },
      { message: { contains: search.trim() } },
    ];
  }

  const [total, messages, unreadCount] = await Promise.all([
    prisma.contactMessage.count({ where: whereClause }),
    prisma.contactMessage.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, { messages, unreadCount }, 'Contact messages retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function toggleMessageReadStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { isRead } = req.body;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Message not found', 404);
    return;
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      isRead: typeof isRead === 'boolean' ? isRead : !existing.isRead,
    },
  });

  sendSuccess(res, updated, 'Message status updated');
}

export async function deleteContactMessage(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Message not found', 404);
    return;
  }

  await prisma.contactMessage.delete({ where: { id } });
  sendSuccess(res, null, 'Message deleted successfully');
}
