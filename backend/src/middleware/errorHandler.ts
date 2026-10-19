import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { sendError } from '../utils/response';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, formattedErrors);
    return;
  }

  // Handle Prisma Database Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      sendError(res, `A record with this ${target} already exists.`, 409);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 'Resource not found', 404);
      return;
    }
  }

  // Handle JSON Syntax Errors in request body
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
    sendError(res, 'Malformed JSON in request body', 400);
    return;
  }

  // Handle generic error
  const message = err.message || 'Internal server error';
  const statusCode = err.statusCode || 500;

  // In production, mask 500 details
  const responseMessage =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : message;

  sendError(res, responseMessage, statusCode);
}
