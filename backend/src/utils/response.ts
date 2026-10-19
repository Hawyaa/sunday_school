import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: any;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
  pagination?: PaginationMeta
): Response {
  const responseBody: ApiResponse<T> = {
    success: true,
  };

  if (message) responseBody.message = message;
  if (data !== undefined) responseBody.data = data;
  if (pagination) responseBody.pagination = pagination;

  return res.status(statusCode).json(responseBody);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: any
): Response {
  const responseBody: ApiResponse = {
    success: false,
    message,
  };

  if (errors !== undefined) responseBody.errors = errors;

  return res.status(statusCode).json(responseBody);
}
