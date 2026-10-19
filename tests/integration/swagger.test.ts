import request from 'supertest';
import { app } from '../../src/app';

describe('Swagger API Documentation (OpenAPI 3.0+)', () => {
  test('GET /api/docs/swagger.json returns valid OpenAPI 3.0 specification', async () => {
    const res = await request(app).get('/api/docs/swagger.json');

    expect(res.status).toBe(200);
    expect(res.body.openapi).toMatch(/^3\./);
    expect(res.body.info.title).toContain('Hawyaa Sunday School');
    expect(res.body.components.securitySchemes.bearerAuth).toBeDefined();
    expect(res.body.components.securitySchemes.bearerAuth.type).toBe('http');
    expect(res.body.components.securitySchemes.bearerAuth.scheme).toBe('bearer');

    // Verify documented paths include core modules
    expect(res.body.paths['/api/auth/login']).toBeDefined();
    expect(res.body.paths['/api/announcements']).toBeDefined();
    expect(res.body.paths['/api/events']).toBeDefined();
    expect(res.body.paths['/api/reports']).toBeDefined();
    expect(res.body.paths['/api/mezmur']).toBeDefined();
    expect(res.body.paths['/api/teachings']).toBeDefined();
    expect(res.body.paths['/api/gallery/albums']).toBeDefined();
    expect(res.body.paths['/api/schedule']).toBeDefined();
    expect(res.body.paths['/api/upload']).toBeDefined();
  });

  test('GET /api/docs/ loads Swagger UI HTML successfully', async () => {
    const res = await request(app).get('/api/docs/');

    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });
});
