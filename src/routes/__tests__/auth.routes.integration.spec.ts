import request from 'supertest';
import { env } from '../../config/env';

// The app is exported from src/app.ts.
// Using `require(...).default` keeps compatibility with the codebase's TS/ESM setup.
const app = require('../../app').default;

describe('Auth Endpoints Integration', () => {
  const adminPassword = 'ValidPassword123';

  async function getAdminToken() {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD ?? adminPassword });

    expect(response.status).toBe(200);
    return response.body.data.token as string;
  }
  // These are integration tests:
  // - They spin up the real Express app in-memory (no server listen)
  // - They hit real route handlers using supertest
  // - They validate request/response behavior and payload shapes
  //
  // NOTE: We intentionally avoid over-coupling the assertions to internal response
  // DTO structure (for example, whether the user is at data.user vs data).
  // This makes the tests resilient to harmless implementation changes.

  describe('POST /api/auth/register', () => {
    it('successfully registers a new user with valid input', async () => {
      const username = 'newuser' + Date.now();
      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username,
          password: 'ValidPassword123',
          role: 'USER',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.username).toContain('newuser');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('rejects registration with missing username', async () => {
      const token = await getAdminToken();
      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'ValidPassword123',
          role: 'USER',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('rejects registration with password that lacks uppercase letter', async () => {
      const token = await getAdminToken();
      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'anotheruser' + Date.now(),
          password: 'invalidpassword123',
          role: 'USER',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('rejects registration with a duplicate username', async () => {
      // Duplicate username behavior can vary across implementations:
      // some return 400 (Bad Request) and others return 409 (Conflict).
      // The important contract for this endpoint is: it must not succeed.
      // So we accept either status as long as `success` is false.

      const username = 'duplicateuser' + Date.now();
      const token = await getAdminToken();

      await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ username, password: 'ValidPassword123', role: 'USER' });

      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ username, password: 'ValidPassword123', role: 'USER' });

      // Depending on implementation, duplicate may be returned as 400 or 409.
      expect([400, 409]).toContain(response.status);
      // Some implementations may use different error shapes; just ensure it is not successful.
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('successfully logs in with valid credentials', async () => {
      const testUsername = 'meuser' + Date.now();
      const token = await getAdminToken();


      await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: testUsername, password: 'ValidPassword123', role: 'USER' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: testUsername, password: 'ValidPassword123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
    });

    it('rejects login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent' + Date.now(),
          password: 'AnyPassword123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('rejects login with missing password (validation)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'missingpass' + Date.now() });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('rejects request without authentication token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('rejects request with malformed token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-here');

      expect(response.status).toBe(401);
    });

    it('returns the current user profile with a valid token', async () => {
      // Flow:
      // 1) Register a user
      // 2) Login to get JWT token
      // 3) Call /api/auth/me with Authorization: Bearer <token>
      //
      // Response payload shape may differ slightly between DTO versions.
      // We assert on the stable fields (username/id) instead of exact nesting.

      const username = 'meuser2' + Date.now();
      const adminToken = await getAdminToken();

      await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username, password: 'ValidPassword123', role: 'USER' });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ username, password: 'ValidPassword123' });

      const token = loginResponse.body?.data?.token;
      expect(token).toBeTruthy();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      // Implementation may return the user object directly under data.
      // Ensure at least username/id exist.
      expect(response.body.data).toHaveProperty('username');
      expect(response.body.data).toHaveProperty('id');

    });
  });
});

