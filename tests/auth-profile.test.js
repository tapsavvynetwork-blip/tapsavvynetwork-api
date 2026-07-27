import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tsn-test';

jest.setTimeout(30000);

describe('Register and Profile API', () => {
  beforeAll(async () => {
    const connection = await mongoose.connect(TEST_MONGO_URI);
    if (!connection.connection.db) {
      await new Promise((resolve) => connection.connection.once('open', resolve));
    }
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('registers a new user, logs in, and creates a profile', async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = 'Password123!';

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body.data.email).toBe(email);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data?.accessToken).toBeTruthy();

    const token = loginRes.body.data.accessToken;

    const profilePayload = {
      userType: 'ind',
      fullName: 'Test User',
      gender: 'female',
      jobTitle: 'Software Tester',
      phoneNumber: '+1234567890',
      website: 'https://example.com',
      bio: 'Automated test profile',
      username: 'testuser',
      instagramLink: 'https://instagram.com/testuser',
      twitterLink: 'https://twitter.com/testuser',
      linkedinLink: 'https://linkedin.com/in/testuser',
      keepMeSignedIn: true,
    };

    const profileRes = await request(app)
      .post('/api/profiles/me')
      .set('Authorization', `Bearer ${token}`)
      .send(profilePayload);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.success).toBe(true);
    expect(profileRes.body.data.fullName).toBe(profilePayload.fullName);
    expect(profileRes.body.data.userType).toBe(profilePayload.userType);
    expect(profileRes.body.data.username).toBe(profilePayload.username);
    expect(profileRes.body.data.instagramLink).toBe(profilePayload.instagramLink);
  });
});
