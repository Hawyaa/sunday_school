import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../lib/prisma';
import { sendError } from '../utils/response';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT Bearer token
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authorization token missing or invalid format', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, email: true, role: true, name: true, isActive: true },
    });

    if (!admin) {
      sendError(res, 'Administrator not found', 401);
      return;
    }

    if (!admin.isActive) {
      sendError(res, 'Administrator account has been deactivated', 403);
      return;
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      sendError(res, 'Token has expired', 401);
      return;
    }
    sendError(res, 'Invalid or malformed authorization token', 401);
  }
}

/**
 * Middleware to restrict access to specific administrator roles
 */
export function authorizeRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.admin.role)) {
      sendError(
        res,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        403
      );
      return;
    }

    next();
  };
}
