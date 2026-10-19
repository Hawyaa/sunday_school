import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';

export interface TokenPayload {
  adminId: string;
  email: string;
  role: string;
  tokenVersion?: number;
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

/**
 * Generates a signed JWT Access Token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    }
  );
}

/**
 * Generates a signed JWT Refresh Token with unique jti
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    }
  );
}

/**
 * Verifies and decodes an Access Token
 */
export function verifyAccessToken(token: string): DecodedToken {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as DecodedToken;
}

/**
 * Verifies and decodes a Refresh Token
 */
export function verifyRefreshToken(token: string): DecodedToken {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as DecodedToken;
}

/**
 * Creates a SHA-256 hash of a refresh token to securely store in the database
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
