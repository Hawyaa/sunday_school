import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../utils/bcrypt';
import { sendSuccess, sendError } from '../../utils/response';

export async function getProfile(req: Request, res: Response): Promise<void> {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin!.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    sendError(res, 'Administrator not found', 404);
    return;
  }

  sendSuccess(res, admin, 'Admin profile retrieved successfully');
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin!.id;

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin) {
    sendError(res, 'Administrator not found', 404);
    return;
  }

  const isCurrentValid = await comparePassword(currentPassword, admin.passwordHash);
  if (!isCurrentValid) {
    sendError(res, 'Current password is incorrect', 400);
    return;
  }

  // Hash new password using bcrypt cost factor 12
  const newPasswordHash = await hashPassword(newPassword);

  await prisma.admin.update({
    where: { id: adminId },
    data: { passwordHash: newPasswordHash },
  });

  // Revoke all existing refresh tokens for this admin
  await prisma.refreshToken.updateMany({
    where: { adminId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  sendSuccess(res, null, 'Password updated successfully. Please login again with your new password.');
}

export async function listAdmins(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;

  const [total, admins] = await Promise.all([
    prisma.admin.count(),
    prisma.admin.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, admins, 'Admins list retrieved successfully', 200, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  const { email, password, name, role } = req.body;

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.admin.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    sendError(res, 'An administrator with this email already exists', 409);
    return;
  }

  const passwordHash = await hashPassword(password);

  const newAdmin = await prisma.admin.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name.trim(),
      role,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  sendSuccess(res, newAdmin, 'Administrator created successfully', 201);
}

export async function updateAdmin(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, role, isActive } = req.body;

  const existing = await prisma.admin.findUnique({
    where: { id },
  });

  if (!existing) {
    sendError(res, 'Administrator not found', 404);
    return;
  }

  const updated = await prisma.admin.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(role !== undefined && { role }),
      ...(isActive !== undefined && { isActive }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  sendSuccess(res, updated, 'Administrator updated successfully');
}

export async function deleteAdmin(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (req.admin?.id === id) {
    sendError(res, 'Cannot delete your own administrator account', 400);
    return;
  }

  const existing = await prisma.admin.findUnique({
    where: { id },
  });

  if (!existing) {
    sendError(res, 'Administrator not found', 404);
    return;
  }

  await prisma.admin.delete({
    where: { id },
  });

  sendSuccess(res, null, 'Administrator deleted successfully');
}
