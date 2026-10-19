import { hashPassword, comparePassword, isBcryptHash } from '../../src/utils/bcrypt';

describe('Bcrypt Password Hashing & Verification (Cost 12)', () => {
  const plainPassword = 'SuperSecretPassword2026!';

  test('should hash password with bcrypt cost factor of 12', async () => {
    const hash = await hashPassword(plainPassword);

    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    // Verifies cost factor 12 in the bcrypt prefix $2a$12$ or $2b$12$
    expect(hash).toMatch(/^\$2[ab]\$12\$/);
    expect(isBcryptHash(hash)).toBe(true);
  });

  test('should verify correct password with bcrypt compare', async () => {
    const hash = await hashPassword(plainPassword);
    const isMatch = await comparePassword(plainPassword, hash);
    expect(isMatch).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const hash = await hashPassword(plainPassword);
    const isMatch = await comparePassword('WrongPassword123!', hash);
    expect(isMatch).toBe(false);
  });

  test('should prevent double-hashing an already-hashed password', async () => {
    const hash = await hashPassword(plainPassword);

    await expect(hashPassword(hash)).rejects.toThrow(
      'Password is already a bcrypt hash; double-hashing is prevented'
    );
  });

  test('should reject empty or whitespace-only passwords', async () => {
    await expect(hashPassword('')).rejects.toThrow();
    await expect(hashPassword('   ')).rejects.toThrow();
  });
});
