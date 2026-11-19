const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: System Health API', () => {
  it('GET / should return service metadata', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.service).toBe('DF TaskManager Backend API');
    expect(res.body.status).toBe('online');
  });

  it('GET /api/v1/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });

  it('GET /non-existent-route should return 404', async () => {
    const res = await request(app).get('/api/v1/non-existent-path-for-testing');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
