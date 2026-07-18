import { registerSchema, loginSchema } from '../auth.validator';

/**
 * Unit tests for auth validation schemas.
 * These tests ensure that the Zod schemas properly validate registration
 * and login input according to business rules.
 */
describe('Auth Validators', () => {
  /**
   * Test registration schema validation.
   * The schema enforces:
   * - Username: 3-20 characters
   * - Password: 8+ chars with uppercase, lowercase, and number
   */
  describe('registerSchema', () => {
    it('accepts valid registration input', () => {
      const valid = { username: 'testuser', password: 'Password123', role: 'USER' };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects username less than 3 characters', () => {
      const invalid = { username: 'ab', password: 'Password123' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3 characters');
      }
    });

    it('rejects password without uppercase letter', () => {
      const invalid = { username: 'testuser', password: 'password123' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase');
      }
    });

    it('rejects password without lowercase letter', () => {
      const invalid = { username: 'testuser', password: 'PASSWORD123' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects password without number', () => {
      const invalid = { username: 'testuser', password: 'PasswordABC' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('trims whitespace from username', () => {
      const input = { username: '  testuser  ', password: 'Password123', role: 'USER' };
      const result = registerSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe('testuser');
      }
    });

    it('rejects an unsupported role', () => {
      const invalid = { username: 'testuser', password: 'Password123', role: 'MANAGER' };
      expect(registerSchema.safeParse(invalid).success).toBe(false);
    });
  });

  /**
   * Test login schema validation.
   * The schema enforces:
   * - Username: 3+ characters
   * - Password: 8+ characters
   * (Note: login is less strict than registration, only checking length)
   */
  describe('loginSchema', () => {
    it('accepts valid login input', () => {
      const valid = { username: 'testuser', password: 'password123' };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates that username and password are required', () => {
      // Test missing username
      const missingUsername = { password: 'password123' };
      const result1 = loginSchema.safeParse(missingUsername);
      expect(result1.success).toBe(false);

      // Test missing password
      const missingPassword = { username: 'testuser' };
      const result = loginSchema.safeParse(missingPassword);
      expect(result.success).toBe(false);
    });


    it('allows login with simple password (no uppercase/number requirement)', () => {
      const input = { username: 'testuser', password: 'simplepassword' };
      const result = loginSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
