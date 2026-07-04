/**
 * Unit tests for JWT utility class.
 * JwtUtil is responsible for:
 * - Signing tokens with a payload (user ID, username, role)
 * - Verifying tokens and extracting the payload
 * - Enforcing token expiration
 *
 * These tests ensure cryptographic operations work correctly
 * and invalid tokens are properly rejected.
 */
describe('JwtUtil', () => {
  beforeEach(() => {
    // Reset modules to ensure clean environment for each test
    jest.resetModules();
  });

  it('signs and verifies a payload', () => {
    // Set up test environment with a known secret
    process.env.JWT_SECRET = 'test-secret';
    jest.resetModules();
    const { JwtUtil } = require('../jwt');

    // Create a test user payload
    const payload = { userId: 1, username: 'alice', role: 'USER' };
    
    // Sign the payload into a JWT token
    const token = JwtUtil.sign(payload);
    
    // Verify the token and extract the payload
    const decoded = JwtUtil.verify(token);

    // Assert the decoded payload matches the original
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.username).toBe(payload.username);
    expect(decoded.role).toBe(payload.role);
  });

  it('throws on invalid token', () => {
    process.env.JWT_SECRET = 'test-secret';
    jest.resetModules();
    const { JwtUtil } = require('../jwt');

    // Verify that an invalid token string throws an error
    // This protects against tampering and malformed tokens
    expect(() => JwtUtil.verify('not-a-token')).toThrow();
  });
});
