import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../lib/prisma';
import { sendError } from '../utils/response';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: string;
  name: string;
  canTakeAttendance?: boolean;
  assignedClasses?: string | null;
}

export interface AuthenticatedMember {
  id: string;
  fullName: string;
  christianName: string;
  division: string;
  registrationNumber: string;
  assignedClass?: string | null;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
      member?: AuthenticatedMember;
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
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        isActive: true,
        canTakeAttendance: true,
        assignedClasses: true,
      },
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
      canTakeAttendance: admin.canTakeAttendance,
      assignedClasses: admin.assignedClasses,
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

/**
 * Middleware to enforce attendance taking permissions.
 * Allowed if:
 * 1. User has SUPER_ADMIN or ADMIN role.
 * 2. User has canTakeAttendance === true.
 */
export function authorizeAttendanceTaker(req: Request, res: Response, next: NextFunction): void {
  if (!req.admin) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const isSuperOrAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(req.admin.role);
  if (!isSuperOrAdmin && !req.admin.canTakeAttendance) {
    sendError(
      res,
      'Access denied. You are not authorized to take or modify attendance. Contact a Super Administrator.',
      403
    );
    return;
  }

  next();
}

/**
 * Middleware to authenticate student / Sunday school members using JWT Bearer token
 */
export async function authenticateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authorization token missing or invalid format', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded.memberId) {
      sendError(res, 'Member authentication required', 401);
      return;
    }

    const member = await prisma.memberRegistration.findUnique({
      where: { id: decoded.memberId },
      select: {
        id: true,
        fullName: true,
        christianName: true,
        division: true,
        registrationNumber: true,
        assignedClass: true,
        status: true,
      },
    });

    if (!member) {
      sendError(res, 'Member record not found', 401);
      return;
    }

    if (member.status !== 'APPROVED') {
      sendError(res, 'Member registration is not approved', 403);
      return;
    }

    req.member = member;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      sendError(res, 'Token has expired', 401);
      return;
    }
    sendError(res, 'Invalid or malformed authorization token', 401);
  }
}

