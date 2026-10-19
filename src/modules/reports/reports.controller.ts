import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { Prisma } from '@prisma/client';

export async function getPublicReports(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { category, search } = req.query;

  const whereClause: Prisma.ReportWhereInput = {
    isPublished: true,
  };

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { summary: { contains: search.trim() } },
      { content: { contains: search.trim() } },
    ];
  }

  const [total, reports] = await Promise.all([
    prisma.report.count({ where: whereClause }),
    prisma.report.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { reportDate: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, reports, 'Public reports retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function getPublicReportById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const report = await prisma.report.findFirst({
    where: { id, isPublished: true },
  });

  if (!report) {
    sendError(res, 'Report not found or not published', 404);
    return;
  }

  sendSuccess(res, report, 'Report retrieved successfully');
}

export async function getAdminReports(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  const { isPublished, category, search } = req.query;

  const whereClause: Prisma.ReportWhereInput = {};

  if (isPublished !== undefined) {
    whereClause.isPublished = isPublished === 'true';
  }

  if (category && typeof category === 'string' && category !== 'All') {
    whereClause.category = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { summary: { contains: search.trim() } },
      { content: { contains: search.trim() } },
    ];
  }

  const [total, reports] = await Promise.all([
    prisma.report.count({ where: whereClause }),
    prisma.report.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { reportDate: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, reports, 'Admin reports retrieved', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function createReport(req: Request, res: Response): Promise<void> {
  const { title, summary, content, category, fileUrl, reportDate, isPublished } = req.body;

  const report = await prisma.report.create({
    data: {
      title,
      summary,
      content,
      category,
      fileUrl,
      reportDate: new Date(reportDate),
      isPublished: isPublished ?? false,
    },
  });

  sendSuccess(res, report, 'Report created successfully', 201);
}

export async function updateReport(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, summary, content, category, fileUrl, reportDate, isPublished } = req.body;

  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Report not found', 404);
    return;
  }

  const updated = await prisma.report.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(summary !== undefined && { summary }),
      ...(content !== undefined && { content }),
      ...(category !== undefined && { category }),
      ...(fileUrl !== undefined && { fileUrl }),
      ...(reportDate !== undefined && { reportDate: new Date(reportDate) }),
      ...(isPublished !== undefined && { isPublished }),
    },
  });

  sendSuccess(res, updated, 'Report updated successfully');
}

export async function deleteReport(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    sendError(res, 'Report not found', 404);
    return;
  }

  await prisma.report.delete({ where: { id } });

  sendSuccess(res, null, 'Report deleted successfully');
}
