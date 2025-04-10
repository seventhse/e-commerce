import { verify, hash, Options } from '@node-rs/argon2';

// --- Default parameters ---
const SALT = Buffer.from(process.env.PASS_SALT || 'somesalt');

// Define a type for your options to ensure consistency
interface Argon2Options extends Options {
  salt: Buffer; // Ensure salt is always a Buffer
}

const DEFAULT_OPTIONS: Argon2Options = {
  timeCost: 3,
  memoryCost: 4096,
  parallelism: 1,
  salt: SALT,
};

export async function argon2Hash(
  plainText: string,
  options?: Argon2Options,
): Promise<string> {
  const mergedOptions: Argon2Options = { ...DEFAULT_OPTIONS, ...options }; // Apply defaults

  return hash(plainText, mergedOptions);
}

export async function argon2Verify(
  plainText: string,
  hashValue: string,
): Promise<boolean> {
  try {
    return await verify(plainText, hashValue, { salt: SALT });
  } catch (error) {
    console.error('Argon2 Verification Error:', error);
    return false;
  }
}
