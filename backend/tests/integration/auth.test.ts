import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

describe('Authentication & Authorization Tests', () => {
  let accessToken: string;
  let refreshToken: string;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST /api/auth/login - fails with invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@hawyaasundayschool.org',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('POST /api/auth/login - fails with non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@hawyaasundayschool.org',
      password: 'AnyPassword123!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - succeeds with seeded admin credentials and does NOT return password hash', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@hawyaasundayschool.org',
      password: 'SecureAdminPassword123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.admin).toBeDefined();
    expect(res.body.data.admin.email).toBe('admin@hawyaasundayschool.org');

    // Never return password hashes in API responses!
    expect(res.body.data.admin.passwordHash).toBeUndefined();
    expect(res.body.data.admin.password).toBeUndefined();

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  test('GET /api/admin/me - fails without authorization token', async () => {
    const res = await request(app).get('/api/admin/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/admin/me - fails with invalid/malformed token', async () => {
    const res = await request(app)
      .get('/api/admin/me')
      .set('Authorization', 'Bearer invalid-token-string');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/admin/me - succeeds with valid access token', async () => {
    const res = await request(app)
      .get('/api/admin/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('admin@hawyaasundayschool.org');
    expect(res.body.data.role).toBe('SUPER_ADMIN');
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  test('POST /api/auth/refresh - rotates refresh token successfully', async () => {
    const res = await request(app).post('/api/auth/refresh').send({
      refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.refreshToken).not.toBe(refreshToken);

    const rotatedAccessToken = res.body.data.accessToken;
    const rotatedRefreshToken = res.body.data.refreshToken;

    // Verify new access token works
    const testRes = await request(app)
      .get('/api/admin/me')
      .set('Authorization', `Bearer ${rotatedAccessToken}`);
    expect(testRes.status).toBe(200);

    // Verify old refresh token cannot be reused
    const reuseRes = await request(app).post('/api/auth/refresh').send({
      refreshToken,
    });
    expect(reuseRes.status).toBe(401);

    // Update refreshToken for subsequent tests
    refreshToken = rotatedRefreshToken;
  });

  test('POST /api/auth/logout - revokes refresh token', async () => {
    const res = await request(app).post('/api/auth/logout').send({
      refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Token cannot be refreshed after logout
    const refreshRes = await request(app).post('/api/auth/refresh').send({
      refreshToken,
    });
    expect(refreshRes.status).toBe(401);
  });
});
