import { test, describe } from 'node:test';
import assert from 'node:assert/strict'; // Use default import
import app from '../app.js';
import supertest from 'supertest'; // Fix incorrect import
import User from '../models/User.js';

const api = supertest(app);

describe('AUTH API', () => {
  test('GET /api/auth', async () => {
    const response = await api.get('/api/auth');
    assert.strictEqual(response.status, 200);
  });
});
