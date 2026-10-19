import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

describe('Additional Content Modules Integration Tests', () => {
  let adminToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@hawyaasundayschool.org',
      password: 'SecureAdminPassword123!',
    });
    adminToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.event.deleteMany({ where: { title: { contains: 'Test' } } });
    await prisma.report.deleteMany({ where: { title: { contains: 'Test' } } });
    await prisma.mezmur.deleteMany({ where: { title: { contains: 'Test' } } });
    await prisma.teaching.deleteMany({ where: { title: { contains: 'Test' } } });
    await prisma.galleryAlbum.deleteMany({ where: { title: { contains: 'Test' } } });
    await prisma.schedule.deleteMany({ where: { title: { contains: 'Test' } } });
    await prisma.$disconnect();
  });

  // ================= EVENTS =================
  test('Events: Admin create, public list, public get', async () => {
    const createRes = await request(app)
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Event Meskel',
        description: 'Feast of the Holy Cross',
        location: 'Church Grounds',
        startDate: new Date(Date.now() + 86400000).toISOString(),
        isPublished: true,
      });

    expect(createRes.status).toBe(201);
    const eventId = createRes.body.data.id;

    const publicRes = await request(app).get('/api/events');
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.data.some((e: any) => e.id === eventId)).toBe(true);

    const getRes = await request(app).get(`/api/events/${eventId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.title).toBe('Test Event Meskel');
  });

  // ================= REPORTS =================
  test('Reports: Admin create, public list, public get', async () => {
    const createRes = await request(app)
      .post('/api/admin/reports')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Q3 Sunday School Report',
        summary: 'Progress report',
        content: 'Detailed content of the quarterly review...',
        reportDate: new Date().toISOString(),
        isPublished: true,
      });

    expect(createRes.status).toBe(201);
    const reportId = createRes.body.data.id;

    const publicRes = await request(app).get('/api/reports');
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.data.some((r: any) => r.id === reportId)).toBe(true);
  });

  // ================= MEZMUR =================
  test('Mezmur: Admin create, public list, public get', async () => {
    const createRes = await request(app)
      .post('/api/admin/mezmur')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Mezmur Egziabher Birhane New',
        lyrics: 'Egziabher birhane ena medhanite new...',
        category: 'Praise',
        isPublished: true,
      });

    expect(createRes.status).toBe(201);
    const mezmurId = createRes.body.data.id;

    const publicRes = await request(app).get('/api/mezmur');
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.data.some((m: any) => m.id === mezmurId)).toBe(true);
  });

  // ================= TEACHINGS =================
  test('Teachings: Admin create, public list, public get', async () => {
    const createRes = await request(app)
      .post('/api/admin/teachings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Teaching on Prayer',
        content: 'Prayer is communicating directly with the Almighty...',
        author: 'Priest Test',
        isPublished: true,
      });

    expect(createRes.status).toBe(201);
    const teachingId = createRes.body.data.id;

    const publicRes = await request(app).get('/api/teachings');
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.data.some((t: any) => t.id === teachingId)).toBe(true);
  });

  // ================= GALLERY =================
  test('Gallery: Admin create album & photo, public get album with photos', async () => {
    const createAlbumRes = await request(app)
      .post('/api/admin/gallery/albums')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Album 2026',
        description: 'Test gallery description',
        isPublished: true,
      });

    expect(createAlbumRes.status).toBe(201);
    const albumId = createAlbumRes.body.data.id;

    const addPhotoRes = await request(app)
      .post(`/api/admin/gallery/albums/${albumId}/photos`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        imageUrl: '/uploads/test-photo.jpg',
        title: 'Test Photo 1',
        caption: 'First photo caption',
        sortOrder: 1,
      });

    expect(addPhotoRes.status).toBe(201);

    const publicAlbumRes = await request(app).get(`/api/gallery/albums/${albumId}`);
    expect(publicAlbumRes.status).toBe(200);
    expect(publicAlbumRes.body.data.photos).toBeDefined();
    expect(publicAlbumRes.body.data.photos.length).toBe(1);
    expect(publicAlbumRes.body.data.photos[0].title).toBe('Test Photo 1');
  });

  // ================= SCHEDULE =================
  test('Schedule: Admin create, public list', async () => {
    const createRes = await request(app)
      .post('/api/admin/schedule')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Sunday Morning Schedule',
        activity: 'Hymn practice & lesson',
        dayOfWeek: 'Sunday',
        startTime: '08:30',
        endTime: '10:30',
        targetGroup: 'Youth',
        isPublished: true,
      });

    expect(createRes.status).toBe(201);
    const scheduleId = createRes.body.data.id;

    const publicRes = await request(app).get('/api/schedule?dayOfWeek=Sunday');
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.data.some((s: any) => s.id === scheduleId)).toBe(true);
  });
});
