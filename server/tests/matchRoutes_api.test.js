// tests/match.test.js
import {
  describe,
  it,
  before,
  after,
  beforeEach,
  afterEach,
  mock,
} from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Adjust paths based on your project structure
import app, { httpServer } from '../app.js'; // Assuming app.js is in the root
import { connectDB, disconnectDB, clearDB } from '../config/db.js'; // Assuming config/db.js is in the root
import User from '../models/User.js'; // Assuming models/User.js is in the root

describe('Match Routes API (/api/matches)', () => {
  let server;
  let testUser1,
    testUser2,
    testUser3,
    testUser4,
    testUser5,
    testUser6,
    testUser7;
  let token1, token2, token3;
  const agent = request.agent(app); // Use agent to persist cookies (for authentication)

  // Mocked socket instances
  let mockIoInstance;
  let mockConnectedUsersMap;

  before(async () => {
    process.env.NODE_ENV = 'test'; // Ensure test environment
    if (!process.env.JWT_SECRET) {
      // Provide a default JWT_SECRET for testing if not set in environment
      // In a real CI/CD environment, this should be set securely.
      process.env.JWT_SECRET = 'testsecretkey12345';
      console.warn(
        "JWT_SECRET was not set. Using a default for testing. Ensure it's set in your test environment."
      );
    }
    await connectDB(); // connectDB should handle MONGO_URI_TEST based on NODE_ENV
    server = httpServer.listen(); // Start server on a dynamic port
  });

  after(async () => {
    await disconnectDB();
    await new Promise((resolve) => server.close(resolve)); // Ensure server is closed
  });

  beforeEach(async () => {
    await clearDB(); // Clear database before each test
    await User.collection.dropIndexes();

    // Create test users with all required fields from the User model
    const usersData = [
      {
        name: 'Test User 1',
        email: 'user1@test.com',
        passwordHash: 'hashedpassword1',
        age: 25,
        gender: 'male',
        genderPreference: 'female',
        image: 'user1.jpg',
        biography: 'Bio for User 1',
      },
      {
        name: 'Test User 2',
        email: 'user2@test.com',
        passwordHash: 'hashedpassword2',
        age: 28,
        gender: 'female',
        genderPreference: 'male',
        image: 'user2.jpg',
        biography: 'Bio for User 2',
      },
      {
        name: 'Test User 3',
        email: 'user3@test.com',
        passwordHash: 'hashedpassword3',
        age: 30,
        gender: 'male',
        genderPreference: 'both',
        image: 'user3.jpg',
        biography: 'Bio for User 3',
      },
      {
        name: 'User4 F_PM',
        email: 'user4@test.com',
        passwordHash: 'hashedpassword4',
        age: 22,
        gender: 'female',
        genderPreference: 'male',
        image: 'user4.jpg',
        biography: 'Bio for User 4',
      },
      {
        name: 'User5 M_PF',
        email: 'user5@test.com',
        passwordHash: 'hashedpassword5',
        age: 27,
        gender: 'male',
        genderPreference: 'female',
        image: 'user5.jpg',
        biography: 'Bio for User 5',
      },
      {
        name: 'User6 F_PB',
        email: 'user6@test.com',
        passwordHash: 'hashedpassword6',
        age: 29,
        gender: 'female',
        genderPreference: 'both',
        image: 'user6.jpg',
        biography: 'Bio for User 6',
      },
      {
        name: 'User7 M_PB',
        email: 'user7@test.com',
        passwordHash: 'hashedpassword7',
        age: 32,
        gender: 'male',
        genderPreference: 'both',
        image: 'user7.jpg',
        biography: 'Bio for User 7',
      },
    ];
    [
      testUser1,
      testUser2,
      testUser3,
      testUser4,
      testUser5,
      testUser6,
      testUser7,
    ] = await User.create(usersData);

    // Generate JWT tokens
    token1 = jwt.sign(
      { id: testUser1.id, email: testUser1.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    token2 = jwt.sign(
      { id: testUser2.id, email: testUser2.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    token3 = jwt.sign(
      { id: testUser3.id, email: testUser3.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Initialize/Reset mocks for socket.io for each test, will be applied via t.mock.module
    mockIoInstance = {
      to: mock.fn(() => ({
        emit: mock.fn(),
      })),
    };
    mockConnectedUsersMap = new Map();
  });

  afterEach(async () => {
    mock.reset(); // Reset all mocks after each test
  });

  describe('POST /api/matches/swipe-right/:likedUserId', () => {
    it('should allow a user to like another user (no match yet)', async (t) => {
      // Mock socket.js for this test context
      t.mock.module('../socket/socket.js', () => ({
        getIO: () => mockIoInstance,
        getConnectedUsers: () => mockConnectedUsersMap,
      }));

      const response = await agent
        .post(`/api/matches/swipe-right/${testUser2.id}`)
        .set('Cookie', [`jwt=${token1}`]) // Authenticate as testUser1
        .expect(200);

      assert.strictEqual(
        response.body.success,
        true,
        'Response success should be true'
      );
      assert.strictEqual(
        response.body.message,
        'User liked successfully',
        'Incorrect success message'
      );
      assert.ok(
        response.body.user.likes.includes(testUser2.id.toString()),
        'Liked user ID not in current user likes array in response'
      );

      const updatedUser1 = await User.findById(testUser1.id);
      assert.ok(
        updatedUser1.likes.includes(testUser2.id.toString()),
        'Liked user ID not saved to current user in DB'
      );
      assert.strictEqual(
        mockIoInstance.to.mock.calls.length,
        0,
        'Socket.io should not be called for a simple like'
      );
    });

    it('should create a match if both users like each other and emit socket events', async (t) => {
      // Pre-condition: testUser2 already likes testUser1
      testUser2.likes.push(testUser1.id);
      await testUser2.save();

      // Simulate users are connected via socket
      const user1SocketId = 'socketIdForUser1_match_test';
      const user2SocketId = 'socketIdForUser2_match_test';
      mockConnectedUsersMap.set(testUser1.id.toString(), user1SocketId);
      mockConnectedUsersMap.set(testUser2.id.toString(), user2SocketId);

      // More robust mocking for emit within to()
      const emitMockFnUser1 = mock.fn();
      const emitMockFnUser2 = mock.fn();
      const toMockFn = mock.fn((socketIdArg) => {
        if (socketIdArg === user1SocketId) return { emit: emitMockFnUser1 };
        if (socketIdArg === user2SocketId) return { emit: emitMockFnUser2 };
        return { emit: mock.fn() }; // Default mock if unexpected ID
      });
      const currentMockIoInstance = { to: toMockFn };

      t.mock.module('../socket/socket.js', () => ({
        getIO: () => currentMockIoInstance,
        getConnectedUsers: () => mockConnectedUsersMap,
      }));

      const response = await agent
        .post(`/api/matches/swipe-right/${testUser2.id}`)
        .set('Cookie', [`jwt=${token1}`]) // testUser1 likes testUser2
        .expect(200);

      assert.strictEqual(
        response.body.success,
        true,
        'Response success should be true'
      );
      assert.strictEqual(
        response.body.message,
        'User matched successfully',
        'Incorrect match message'
      );
      assert.ok(
        response.body.user.likes.includes(testUser2.id.toString()),
        'Liked user ID not in current user likes (response)'
      );
      assert.ok(
        response.body.user.matches.includes(testUser2.id.toString()),
        'Matched user ID not in current user matches (response)'
      );

      const updatedUser1 = await User.findById(testUser1.id);
      const updatedUser2 = await User.findById(testUser2.id);

      assert.ok(
        updatedUser1.matches.includes(testUser2.id.toString()),
        'Match not saved for user1 in DB'
      );
      assert.ok(
        updatedUser2.matches.includes(testUser1.id.toString()),
        'Match not saved for user2 in DB'
      );

      // Verify socket emissions
      assert.strictEqual(
        toMockFn.mock.calls.length,
        2,
        'io.to() should be called twice for a match'
      );

      // Check emit to likedUser (testUser2)
      assert.ok(
        toMockFn.mock.calls.find((call) => call.arguments[0] === user2SocketId),
        "io.to() was not called with liked user's socket ID"
      );
      assert.strictEqual(
        emitMockFnUser2.mock.calls.length,
        1,
        'Emit for likedUser not called once'
      );
      assert.strictEqual(
        emitMockFnUser2.mock.calls[0].arguments[0],
        'newMatch',
        'Event name for likedUser is incorrect'
      );
      assert.deepStrictEqual(
        emitMockFnUser2.mock.calls[0].arguments[1],
        {
          _id: testUser1._id,
          name: testUser1.name,
          image: testUser1.image,
          message: 'You have a new match!',
        },
        'Payload for likedUser is incorrect'
      );

      // Check emit to currentUser (testUser1)
      assert.ok(
        toMockFn.mock.calls.find((call) => call.arguments[0] === user1SocketId),
        "io.to() was not called with current user's socket ID"
      );
      assert.strictEqual(
        emitMockFnUser1.mock.calls.length,
        1,
        'Emit for currentUser not called once'
      );
      assert.strictEqual(
        emitMockFnUser1.mock.calls[0].arguments[0],
        'newMatch',
        'Event name for currentUser is incorrect'
      );
      assert.deepStrictEqual(
        emitMockFnUser1.mock.calls[0].arguments[1],
        {
          _id: testUser2._id,
          name: testUser2.name,
          image: testUser2.image,
          message: 'You have a new match!',
        },
        'Payload for currentUser is incorrect'
      );
    });

    it('should return 400 if user already liked', async (t) => {
      t.mock.module('../socket/socket.js', () => ({
        getIO: () => mockIoInstance,
        getConnectedUsers: () => mockConnectedUsersMap,
      }));

      testUser1.likes.push(testUser2.id); // testUser1 already liked testUser2
      await testUser1.save();

      const response = await agent
        .post(`/api/matches/swipe-right/${testUser2.id}`)
        .set('Cookie', [`jwt=${token1}`])
        .expect(400);

      assert.strictEqual(
        response.body.success,
        false,
        'Success should be false for already liked'
      );
      assert.strictEqual(
        response.body.message,
        'User already liked',
        'Incorrect message for already liked'
      );
    });

    it('should return 404 if liked user not found', async (t) => {
      t.mock.module('../socket/socket.js', () => ({
        getIO: () => mockIoInstance,
        getConnectedUsers: () => mockConnectedUsersMap,
      }));
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const response = await agent
        .post(`/api/matches/swipe-right/${nonExistentUserId}`)
        .set('Cookie', [`jwt=${token1}`])
        .expect(404);

      assert.strictEqual(
        response.body.success,
        false,
        'Success should be false for non-existent user'
      );
      assert.strictEqual(
        response.body.message,
        'User not found',
        'Incorrect message for user not found'
      );
    });

    it('should return 401 if not authenticated (no token)', async () => {
      const response = await request(app) // Use request(app) directly, not agent, to avoid cookie persistence
        .post(`/api/matches/swipe-right/${testUser2.id}`)
        .expect(401);
      assert.strictEqual(
        response.body.success,
        false,
        'Success should be false for unauthorized'
      );
      assert.strictEqual(
        response.body.message,
        'Not authorized - No token provided',
        'Incorrect message for no token'
      );
    });

    it('should return 401 if token is invalid', async () => {
      const invalidToken = 'thisisnotavalidjwt';
      const response = await request(app)
        .post(`/api/matches/swipe-right/${testUser2.id}`)
        .set('Cookie', [`jwt=${invalidToken}`])
        .expect(401);
      assert.strictEqual(response.body.success, false);
      assert.strictEqual(
        response.body.message,
        'Not authorized - Invalid token'
      );
    });
  });

  describe('POST /api/matches/swipe-left/:dislikedUserId', () => {
    it('should allow a user to dislike another user', async () => {
      const response = await agent
        .post(`/api/matches/swipe-left/${testUser2.id}`)
        .set('Cookie', [`jwt=${token1}`]) // testUser1 dislikes testUser2
        .expect(200);

      assert.strictEqual(
        response.body.success,
        true,
        'Success should be true for dislike'
      );
      assert.strictEqual(
        response.body.message,
        'User disliked successfully',
        'Incorrect message for dislike'
      );
      assert.ok(
        response.body.user.dislikes.includes(testUser2.id.toString()),
        'Disliked user ID not in response dislikes array'
      );

      const updatedUser1 = await User.findById(testUser1.id);
      assert.ok(
        updatedUser1.dislikes.includes(testUser2.id.toString()),
        'Disliked user ID not saved to DB'
      );
    });

    it('should return 400 if user already disliked', async () => {
      testUser1.dislikes.push(testUser2.id); // testUser1 already disliked testUser2
      await testUser1.save();

      const response = await agent
        .post(`/api/matches/swipe-left/${testUser2.id}`)
        .set('Cookie', [`jwt=${token1}`])
        .expect(400);

      assert.strictEqual(
        response.body.success,
        false,
        'Success should be false for already disliked'
      );
      assert.strictEqual(
        response.body.message,
        'User already disliked',
        'Incorrect message for already disliked'
      );
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post(`/api/matches/swipe-left/${testUser2.id}`)
        .expect(401);
      assert.strictEqual(
        response.body.success,
        false,
        'Success should be false for unauthorized'
      );
      assert.strictEqual(
        response.body.message,
        'Not authorized - No token provided',
        'Incorrect message for no token'
      );
    });
  });

  describe('GET /api/matches/', () => {
    it("should return the current user's matches with populated fields", async () => {
      // Create a match between testUser1 and testUser2
      testUser1.matches.push(testUser2._id);
      testUser2.matches.push(testUser1._id); // Matches are mutual
      await Promise.all([testUser1.save(), testUser2.save()]);

      const response = await agent
        .get('/api/matches/')
        .set('Cookie', [`jwt=${token1}`]) // Authenticated as testUser1
        .expect(200);

      assert.strictEqual(
        response.body.success,
        true,
        'Success should be true for get matches'
      );
      assert.strictEqual(
        response.body.matches.length,
        1,
        'Should have 1 match'
      );
      const match = response.body.matches[0];
      assert.strictEqual(
        match._id.toString(),
        testUser2.id.toString(),
        'Match ID is incorrect'
      );
      assert.strictEqual(match.name, testUser2.name, 'Match name is incorrect');
      assert.strictEqual(
        match.image,
        testUser2.image,
        'Match image is incorrect'
      );
      assert.strictEqual(
        match.biography,
        testUser2.biography,
        'Match biography is incorrect'
      ); // Check populated field
    });

    it('should return an empty array if no matches', async () => {
      const response = await agent
        .get('/api/matches/')
        .set('Cookie', [`jwt=${token1}`])
        .expect(200);

      assert.strictEqual(
        response.body.success,
        true,
        'Success should be true for no matches'
      );
      assert.deepStrictEqual(
        response.body.matches,
        [],
        'Matches array should be empty'
      );
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/api/matches/').expect(401);
      assert.strictEqual(
        response.body.success,
        false,
        'Success should be false for unauthorized'
      );
      assert.strictEqual(
        response.body.message,
        'Not authorized - No token provided',
        'Incorrect message for no token'
      );
    });
  });

  describe('GET /api/matches/user-profiles', () => {
    // testUser1 (current): male, age 25, prefers female
    // testUser2: female, age 28, prefers male
    // testUser3: male, age 30, prefers both
    // testUser4: female, age 22, prefers male (User4 F_PM)
    // testUser5: male, age 27, prefers female (User5 M_PF)
    // testUser6: female, age 29, prefers both (User6 F_PB)
    // testUser7: male, age 32, prefers both (User7 M_PB)

    it('should return profiles for user1 (male, prefers female)', async () => {
      const response = await agent
        .get('/api/matches/user-profiles')
        .set('Cookie', [`jwt=${token1}`]) // Authenticated as testUser1
        .expect(200);

      assert.strictEqual(
        response.body.success,
        true,
        'Success should be true for user profiles'
      );
      const users = response.body.users;
      const userIds = users.map((u) => u._id.toString()).sort();

      // Expected: Females who prefer males OR prefer both
      // testUser2 (female, prefers male) - YES
      // testUser4 (female, prefers male) - YES
      // testUser6 (female, prefers both) - YES
      const expectedUserIds = [
        testUser2.id.toString(),
        testUser4.id.toString(),
        testUser6.id.toString(),
      ].sort();
      assert.deepStrictEqual(
        userIds,
        expectedUserIds,
        `User IDs mismatch. Expected: ${expectedUserIds}, Got: ${userIds}`
      );
      assert.strictEqual(
        users.length,
        3,
        'Incorrect number of profiles returned'
      );
    });

    it('should return profiles for user2 (female, prefers male)', async () => {
      const response = await agent
        .get('/api/matches/user-profiles')
        .set('Cookie', [`jwt=${token2}`]) // Authenticated as testUser2
        .expect(200);

      assert.strictEqual(response.body.success, true);
      const users = response.body.users;
      const userIds = users.map((u) => u._id.toString()).sort();

      // Expected: Males who prefer females OR prefer both
      // testUser1 (male, prefers female) - YES
      // testUser3 (male, prefers both) - YES
      // testUser5 (male, prefers female) - YES
      // testUser7 (male, prefers both) - YES
      const expectedUserIds = [
        testUser1.id.toString(),
        testUser3.id.toString(),
        testUser5.id.toString(),
        testUser7.id.toString(),
      ].sort();
      assert.deepStrictEqual(
        userIds,
        expectedUserIds,
        `User IDs mismatch. Expected: ${expectedUserIds}, Got: ${userIds}`
      );
      assert.strictEqual(
        users.length,
        4,
        'Incorrect number of profiles for user2'
      );
    });

    it('should return profiles for user3 (male, prefers both)', async () => {
      const response = await agent
        .get('/api/matches/user-profiles')
        .set('Cookie', [`jwt=${token3}`]) // Authenticated as testUser3
        .expect(200);

      assert.strictEqual(response.body.success, true);
      const users = response.body.users;
      const userIds = users.map((u) => u._id.toString()).sort();

      // Expected: Users of any gender who prefer males OR prefer both
      // testUser1 (male, pref female) - NO (theirPreference 'female' doesn't include me 'male')
      // testUser2 (female, pref male) - YES (theirPreference 'male' matches my gender 'male')
      // testUser4 (female, pref male) - YES (User4 F_PM, theirPreference 'male' matches my gender 'male')
      // testUser5 (male, pref female) - NO (User5 M_PF, theirPreference 'female' doesn't include me 'male')
      // testUser6 (female, pref both) - YES (User6 F_PB, theirPreference 'both' includes my gender 'male')
      // testUser7 (male, pref both) - YES (User7 M_PB, theirPreference 'both' includes my gender 'male')
      const expectedUserIds = [
        testUser2.id.toString(),
        testUser4.id.toString(),
        testUser6.id.toString(),
        testUser7.id.toString(),
      ].sort();
      assert.deepStrictEqual(
        userIds,
        expectedUserIds,
        `User IDs mismatch for user3. Expected: ${expectedUserIds}, Got: ${userIds}`
      );
      assert.strictEqual(
        users.length,
        4,
        'Incorrect number of profiles for user3'
      );
    });

    it('should exclude liked, disliked, and matched users from profiles', async () => {
      // Current user is testUser1 (male, prefers female)
      // Potential profiles initially: testUser2, testUser4, testUser6

      testUser1.likes = [testUser2.id]; // Like testUser2
      testUser1.dislikes = [testUser4.id]; // Dislike testUser4
      // For matches, user6 must also match user1
      testUser1.matches = [testUser6.id]; // Match with testUser6
      testUser6.matches = [testUser1.id];
      await Promise.all([testUser1.save(), testUser6.save()]);

      const response = await agent
        .get('/api/matches/user-profiles')
        .set('Cookie', [`jwt=${token1}`]) // Authenticated as testUser1
        .expect(200);

      assert.strictEqual(
        response.body.success,
        true,
        'Success should be true even with exclusions'
      );
      const users = response.body.users;
      const userIds = users.map((u) => u._id.toString());

      assert.ok(
        !userIds.includes(testUser2.id.toString()),
        'Liked user (testUser2) should be excluded'
      );
      assert.ok(
        !userIds.includes(testUser4.id.toString()),
        'Disliked user (testUser4) should be excluded'
      );
      assert.ok(
        !userIds.includes(testUser6.id.toString()),
        'Matched user (testUser6) should be excluded'
      );
      assert.strictEqual(
        users.length,
        0,
        `Expected 0 users after exclusions, got ${users.length}. Found: ${userIds.join(', ')}`
      );
    });

    it('should return 401 if not authenticated for user-profiles', async () => {
      const response = await request(app)
        .get('/api/matches/user-profiles')
        .expect(401);
      assert.strictEqual(
        response.body.success,
        false,
        'Success should be false for unauthorized'
      );
      assert.strictEqual(
        response.body.message,
        'Not authorized - No token provided',
        'Incorrect message for no token'
      );
    });
  });
});
