const request = require('supertest');
const app = require('../../src/app');

describe('Products API', () => {
  test('GET /api/products should return array (likely empty)', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
