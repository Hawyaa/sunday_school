import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { comparePassword } from '../../utils/bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../../utils/jwt';
import { sendSuccess, sendError } from '../../utils/response';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!admin) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  const isPasswordValid = await comparePassword(password, admin.passwordHash);
  if (!isPasswordValid) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  if (!admin.isActive) {
    sendError(res, 'Administrator account has been deactivated', 403);
    return;
  }

  // Update last login timestamp
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const payload = {
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store hashed refresh token in database (expires in 7 days)
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      adminId: admin.id,
      expiresAt,
    },
  });

  sendSuccess(
    res,
    {
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    },
    'Login successful'
  );
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { refreshToken: rawRefreshToken } = req.body;

  try {
    verifyRefreshToken(rawRefreshToken);
  } catch (_err) {
    sendError(res, 'Invalid or expired refresh token', 401);
    return;
  }

  const tokenHash = hashToken(rawRefreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { admin: true },
  });

  if (!storedToken) {
    sendError(res, 'Invalid refresh token', 401);
    return;
  }

  // Token reuse detection: if a revoked token is used, compromise is suspected. Revoke all tokens for this admin.
  if (storedToken.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { adminId: storedToken.adminId },
      data: { revokedAt: new Date() },
    });
    sendError(res, 'Token reuse detected. All sessions revoked for security.', 401);
    return;
  }

  if (storedToken.expiresAt < new Date()) {
    sendError(res, 'Refresh token has expired', 401);
    return;
  }

  if (!storedToken.admin.isActive) {
    sendError(res, 'Administrator account has been deactivated', 403);
    return;
  }

  // Issue new tokens & rotate
  const payload = {
    adminId: storedToken.admin.id,
    email: storedToken.admin.email,
    role: storedToken.admin.role,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);
  const newHashedToken = hashToken(newRefreshToken);
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Revoke old token and link to new one
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      revokedAt: new Date(),
      replacedByTokenHash: newHashedToken,
    },
  });

  // Create new refresh token
  await prisma.refreshToken.create({
    data: {
      tokenHash: newHashedToken,
      adminId: storedToken.admin.id,
      expiresAt: newExpiresAt,
    },
  });

  sendSuccess(
    res,
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
    'Token refreshed successfully'
  );
}

export async function logout(req: Request, res: Response): Promise<void> {
  const { refreshToken: rawRefreshToken } = req.body;

  if (rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  sendSuccess(res, null, 'Logged out successfully');
}
