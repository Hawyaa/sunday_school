import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().optional(),
    name: z.string().optional(),
    identifier: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((data) => data.email || data.name || data.identifier, {
    message: 'Please enter your name or email address',
    path: ['identifier'],
  });

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
