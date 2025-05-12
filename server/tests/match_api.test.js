import mongoose from 'mongoose';
import request from 'supertest';
import app, { httpServer } from '../app.js'; // Ensure httpServer is exported from app.js
import { connectDB, clearDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';

let userA, userB;
const agent = request.agent(httpServer); // Use httpServer for persistent session
const userAdata = {
  name: 'Test User A',
  userName: 'testuserA',
  email: 'testA@example.com',
  password: 'password123A',
  age: 21,
  gender: 'male',
  genderPreference: 'female',
};

const userBdata = {
  name: 'Test User B',
  userName: 'testuserB',
  email: 'testB@example.com',
  password: 'password123B',
  age: 21,
  gender: 'female',
  genderPreference: 'male',
};

beforeAll(async () => {
  await connectDB(true);
  await clearDB();
  console.log('Connected to MongoDB for testing');
});

beforeEach(async () => {
  await clearDB();
  const usersAfterClear = await User.find();
  console.log('Users after clearDB:', usersAfterClear);

  const signupA = await agent.post('/api/auth/signup').send(userAdata);
  expect(signupA.statusCode).toBe(201);
  console.log('User A created:', signupA.body.user);

  const signupB = await agent.post('/api/auth/signup').send(userBdata);
  expect(signupB.statusCode).toBe(201);
  console.log('User B created:', signupB.body.user);

  const allUsers = await User.find();
  console.log('All users in DB before login:', allUsers);

  const loginRes = await agent.post('/api/auth/login').send({
    email: userAdata.email,
    password: userAdata.password,
  });
  expect(loginRes.statusCode).toBe(200);
  console.log('Login successful for User A');

  userA = await User.findOne({ email: userAdata.email });
  userB = await User.findOne({ email: userBdata.email });
  console.log('Fetched User A from DB:', userA);
  console.log('Fetched User B from DB:', userB);
});

afterAll(async () => {
  await clearDB();
  await disconnectDB();
  httpServer.close(); // Ensure httpServer is properly closed
});

describe('Match API', () => {
  it('Swipe right on a user', async () => {
    const res = await agent
      .post(`/api/matches/swipe-right/${userB._id}`) // A swipes right on B
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User liked successfully');
    expect(res.body.user.likes).toContain(userB._id.toString());
  });
});
