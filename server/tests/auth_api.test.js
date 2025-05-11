import request from 'supertest';
import app from '../app.js';
import { connectDB, clearDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';

let server;
let agent;

const userData = {
  name: 'Test User',
  userName: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  age: 21,
  gender: 'male',
  genderPreference: 'female',
};

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();
  server = app.listen(0); // dynamic port
  agent = request.agent(server); // persistent session
});

afterAll(async () => {
  await clearDB();
  await disconnectDB();
  server.close();
});

describe('Auth Routes', () => {
  test('POST /api/auth/signup - should register a user', async () => {
    const res = await agent.post('/api/auth/signup').send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user._id).toBeDefined();
    expect(res.body.token).toBeDefined(); // for test only
  });

  test('POST /api/auth/signup - missing fields returns 400', async () => {
    const res = await agent
      .post('/api/auth/signup')
      .send({ email: 'test@example.com' }); // insufficient data

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/fill all the fields/i);
  });

  test('POST /api/auth/login - should log in with correct credentials', async () => {
    const res = await agent.post('/api/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined(); // for test only
  });

  test('POST /api/auth/login - wrong password returns 401', async () => {
    const res = await agent.post('/api/auth/login').send({
      email: userData.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  test('GET /api/auth/me - should return user if logged in', async () => {
    // Log in to get the token
    const loginRes = await agent.post('/api/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.headers['set-cookie']).toBeDefined();

    // Make the request to /api/auth/me
    const res = await agent.get('/api/auth/me');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(userData.email);
  });
});
