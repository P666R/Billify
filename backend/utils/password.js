import { promisify } from 'node:util';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';

const scryptAsync = promisify(scrypt);

/**
 * Hashes a password using native Node.js scrypt.
 * Standard: 16-byte salt, 64-byte key length.
 */
export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${salt}:${buf.toString('hex')}`;
};

/**
 * Verifies a password against a stored scrypt hash.
 * Includes a fallback for "dummy" hashes to prevent timing attacks.
 */
export const verifyPassword = async (password, storedHash) => {
  if (!storedHash?.includes(':')) return false;

  const [salt, hash] = storedHash.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const buf = await scryptAsync(password, salt, 64);

  return timingSafeEqual(hashBuffer, buf);
};
