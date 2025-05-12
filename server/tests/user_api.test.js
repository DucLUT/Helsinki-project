import request from 'supertest';
import app, { httpServer } from '../app.js';
import { connectDB, clearDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';

const agent = request.agent(httpServer);
const userData = {
  name: 'Test User',
  userName: 'testuser',
  email: 'testuser@example.com',
  password: 'password123',
  age: 25,
  gender: 'male',
  genderPreference: 'female',
};

beforeAll(async () => {
  await connectDB(true);
  await clearDB();
});

afterAll(async () => {
  await clearDB();
  await disconnectDB();
  httpServer.close();
});

describe('User API', () => {
  let userId;

  beforeEach(async () => {
    await clearDB();
    await agent.post('/api/auth/signup').send(userData);
    const user = await User.findOne({ email: userData.email });
    userId = user._id.toString();
    await agent.post('/api/auth/login').send({
      email: userData.email,
      password: userData.password,
    });
  });

  it('should update user profile fields', async () => {
    const res = await agent.put('/api/users/update').send({
      name: 'Updated Name',
      age: 30,
      gender: 'male',
      genderPreference: 'female',
      bio: 'Updated bio',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe('Updated Name');
    expect(res.body.user.age).toBe(30);
    expect(res.body.user.biography).toBe('Updated bio');
  });
});
