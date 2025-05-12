import request from 'supertest';
import app, { httpServer } from '../app.js';
import { connectDB, clearDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

const agent = request.agent(httpServer);

const userA = {
  name: 'User A',
  userName: 'usera',
  email: 'usera@example.com',
  password: 'passwordA',
  age: 22,
  gender: 'male',
  genderPreference: 'female',
};

const userB = {
  name: 'User B',
  userName: 'userb',
  email: 'userb@example.com',
  password: 'passwordB',
  age: 23,
  gender: 'female',
  genderPreference: 'male',
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

describe('Message API', () => {
  let userAId, userBId;

  beforeEach(async () => {
    await clearDB();
    await agent.post('/api/auth/signup').send(userA);
    await agent.post('/api/auth/signup').send(userB);

    const a = await User.findOne({ email: userA.email });
    const b = await User.findOne({ email: userB.email });
    userAId = a._id.toString();
    userBId = b._id.toString();
  });

  it('should send a message from A to B and fetch conversation', async () => {
    await agent.post('/api/auth/login').send({
      email: userA.email,
      password: userA.password,
    });
    const sendRes = await agent
      .post('/api/messages/send')
      .send({ receiverId: userBId, content: 'Hello B!' });
    expect(sendRes.statusCode).toBe(200);
    expect(sendRes.body.success).toBe(true);
    expect(sendRes.body.message.content).toBe('Hello B!');

    await agent.post('/api/auth/logout');
    await agent.post('/api/auth/login').send({
      email: userB.email,
      password: userB.password,
    });

    const convRes = await agent.get(`/api/messages/conversation/${userAId}`);
    expect(convRes.statusCode).toBe(200);
    expect(convRes.body.success).toBe(true);
    expect(convRes.body.messages.length).toBe(1);
    expect(convRes.body.messages[0].content).toBe('Hello B!');
    expect(convRes.body.messages[0].sender.name).toBe('User A');
    expect(convRes.body.messages[0].receiver.name).toBe('User B');
  });
});
