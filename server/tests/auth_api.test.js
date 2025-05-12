import request from 'supertest';
import app, { httpServer } from '../app.js';
import { connectDB, clearDB, disconnectDB } from '../config/db.js';
import mongoose from 'mongoose';

const agent = request.agent(httpServer); // Use agent to persist cookies

const validUser = {
  name: 'Test User',
  userName: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  age: 25,
  gender: 'male',
  genderPreference: 'female',
};

await connectDB(true);

afterAll(async () => {
  await disconnectDB();
  httpServer.close();
});

beforeEach(async () => {
  await clearDB();
});

describe('Auth API', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user and set cookie', async () => {
      const res = await agent.post('/api/auth/signup').send(validUser);
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.headers['set-cookie']).toBeDefined();
    });
    it('should not allow signup with missing fields', async () => {
      const res = await agent.post('/api/auth/signup').send({
        ...validUser,
        email: '',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/fill all the fields/i);
    });

    it('should not allow underage signup', async () => {
      const res = await agent.post('/api/auth/signup').send({
        ...validUser,
        age: 17,
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/at least 18/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await agent.post('/api/auth/signup').send(validUser);
    });

    it('should login successfully and set cookie', async () => {
      const res = await agent.post('/api/auth/login').send({
        email: validUser.email,
        password: validUser.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should fail login with wrong password', async () => {
      const res = await agent.post('/api/auth/login').send({
        email: validUser.email,
        password: 'wrongpassword',
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });

    it('should fail login with unknown email', async () => {
      const res = await agent.post('/api/auth/login').send({
        email: 'notfound@example.com',
        password: 'password123',
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user if authenticated', async () => {
      await agent.post('/api/auth/signup').send(validUser);
      const res = await agent.get('/api/auth/me');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(validUser.email);
    });

    it('should return 401 if not authenticated', async () => {
      const unauthAgent = request.agent(httpServer);
      const res = await unauthAgent.get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear the cookie on logout', async () => {
      await agent.post('/api/auth/signup').send(validUser);
      const res = await agent.post('/api/auth/logout');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/logged out/i);
    });
  });
});
