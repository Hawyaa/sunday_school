import bcrypt from 'bcrypt';

export const BCRYPT_SALT_ROUNDS = 12;

// Standard bcrypt hash format: $2a$, $2b$, or $2y$ followed by cost factor (e.g. 12$) and 53 chars of salt+hash
const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

/**
 * Checks if a string is already a valid bcrypt hash
 */
export function isBcryptHash(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return BCRYPT_HASH_REGEX.test(value);
}

/**
 * Hashes a plaintext password using bcrypt with salt rounds = 12.
 * Throws an error if the password is empty or already hashed to prevent double-hashing.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    throw new Error('Password must be a non-empty string');
  }

  if (isBcryptHash(password)) {
    throw new Error('Password is already a bcrypt hash; double-hashing is prevented');
  }

  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compare(password, hash);
}
