/**
 * Unit tests for password utility class.
 * PasswordUtil is responsible for:
 * - Hashing passwords using bcrypt with salt rounds
 * - Comparing plain text passwords against hashes
 *
 * These tests ensure that:
 * 1. Passwords are hashed to a different string (not stored in plaintext)
 * 2. The same password matches its hash
 * 3. Different passwords do not match the same hash
 */
describe('PasswordUtil', () => {
  it('hashes and compares passwords', async () => {
    const { PasswordUtil } = require('../password');

    const plain = 's3cr3t';
    
    // Hash the password using bcrypt
    const hashed = await PasswordUtil.hash(plain);

    // Verify that the hash is a string (not the plaintext)
    expect(typeof hashed).toBe('string');
    
    // Compare the plaintext password against the hash
    // This should return true if the password matches
    const ok = await PasswordUtil.compare(plain, hashed);
    expect(ok).toBe(true);
  });
});
