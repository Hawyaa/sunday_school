import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

describe('Announcements Module Tests', () => {
  let adminToken: string;
  let testAnnouncementId: string;

  beforeAll(async () => {
    // Authenticate admin to obtain access token
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@hawyaasundayschool.org',
      password: 'SecureAdminPassword123!',
    });
    adminToken = loginRes.body.data.accessToken;

    // Clean up test announcements
    await prisma.announcement.deleteMany({
      where: { title: { contains: 'Test Announcement' } },
    });
  });

  afterAll(async () => {
    await prisma.announcement.deleteMany({
      where: { title: { contains: 'Test Announcement' } },
    });
    await prisma.$disconnect();
  });

  test('POST /api/admin/announcements - fails without authorization token', async () => {
    const res = await request(app).post('/api/admin/announcements').send({
      title: 'Test Announcement Unauthorized',
      content: 'This should fail.',
    });

    expect(res.status).toBe(401);
  });

  test('POST /api/admin/announcements - creates a published announcement', async () => {
    const res = await request(app)
      .post('/api/admin/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Announcement 1 - Published',
        content: 'Content for published test announcement.',
        summary: 'Short summary',
        category: 'Events',
        isPinned: false,
        isPublished: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.isPublished).toBe(true);
    expect(res.body.data.publishedAt).toBeDefined();

    testAnnouncementId = res.body.data.id;
  });

  test('POST /api/admin/announcements - creates a draft announcement (unpublished)', async () => {
    const res = await request(app)
      .post('/api/admin/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Announcement 2 - Draft',
        content: 'Draft content that should not be visible publicly.',
        isPublished: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.isPublished).toBe(false);
  });

  test('POST /api/admin/announcements - creates a scheduled announcement (future date)', async () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
      .post('/api/admin/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Announcement 3 - Scheduled',
        content: 'Future content that should not be visible publicly yet.',
        isPublished: true,
        publishedAt: futureDate,
      });

    expect(res.status).toBe(201);
  });

  test('POST /api/admin/announcements - creates an expired announcement', async () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
      .post('/api/admin/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Announcement 4 - Expired',
        content: 'Expired content that should not be visible publicly.',
        isPublished: true,
        expiresAt: pastDate,
      });

    expect(res.status).toBe(201);
  });

  test('GET /api/announcements - public endpoint returns ONLY published, non-draft, non-future, non-expired items', async () => {
    const res = await request(app).get('/api/announcements');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const titles = res.body.data.map((a: any) => a.title);

    // Published one should be visible
    expect(titles).toContain('Test Announcement 1 - Published');

    // Draft, scheduled future, and expired should NOT be visible
    expect(titles).not.toContain('Test Announcement 2 - Draft');
    expect(titles).not.toContain('Test Announcement 3 - Scheduled');
    expect(titles).not.toContain('Test Announcement 4 - Expired');
  });

  test('PATCH /api/admin/announcements/:id/pin - toggles pin status', async () => {
    const res = await request(app)
      .patch(`/api/admin/announcements/${testAnnouncementId}/pin`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isPinned).toBe(true);
  });

  test('GET /api/announcements - pinned items appear first in public listing', async () => {
    const res = await request(app).get('/api/announcements');
    expect(res.status).toBe(200);
    expect(res.body.data[0].isPinned).toBe(true);
  });

  test('PATCH /api/admin/announcements/:id/archive - archives announcement and removes it from public list', async () => {
    const res = await request(app)
      .patch(`/api/admin/announcements/${testAnnouncementId}/archive`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isArchived).toBe(true);

    // Verify it is no longer returned in public listing
    const publicRes = await request(app).get('/api/announcements');
    const titles = publicRes.body.data.map((a: any) => a.title);
    expect(titles).not.toContain('Test Announcement 1 - Published');
  });

  test('DELETE /api/admin/announcements/:id - deletes announcement', async () => {
    const res = await request(app)
      .delete(`/api/admin/announcements/${testAnnouncementId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
