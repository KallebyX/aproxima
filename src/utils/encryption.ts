import crypto from 'crypto';
import { logger } from './logger';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
let developmentKey: Buffer | undefined;

function getEncryptionKey(): Buffer {
  const configured = process.env.ENCRYPTION_KEY;
  if (configured) {
    if (!/^[a-fA-F0-9]{64}$/.test(configured)) {
      throw new Error('ENCRYPTION_KEY must contain exactly 64 hexadecimal characters');
    }
    return Buffer.from(configured, 'hex');
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY is required in production');
  }
  if (!developmentKey) {
    developmentKey = crypto.randomBytes(KEY_LENGTH);
    logger.warn('Using a temporary encryption key outside production.');
  }
  return developmentKey;
}

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
}

export function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const data = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return { data: data.toString('hex'), iv: iv.toString('hex'), tag: cipher.getAuthTag().toString('hex') };
}

export function decrypt(encryptedData: EncryptedData): string {
  if (!encryptedData || !/^[a-fA-F0-9]{24}$/.test(encryptedData.iv) ||
      !/^[a-fA-F0-9]{32}$/.test(encryptedData.tag) ||
      typeof encryptedData.data !== 'string' || !/^(?:[a-fA-F0-9]{2})*$/.test(encryptedData.data)) {
    throw new Error('Invalid encrypted data');
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), Buffer.from(encryptedData.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedData.data, 'hex')), decipher.final()]).toString('utf8');
}

// Hash passwords or sensitive data
export function hashData(data: string, salt?: string): { hash: string; salt: string } {
  try {
    const saltToUse = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, saltToUse, 10000, 64, 'sha256').toString('hex');
    
    return { hash, salt: saltToUse };
  } catch (error) {
    console.error('Hashing failed:', error);
    throw new Error('Hashing failed');
  }
}

// Verify hashed data
export function verifyHash(data: string, hash: string, salt: string): boolean {
  try {
    const computedHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha256').toString('hex');
    return secureCompare(computedHash, hash);
  } catch (error) {
    console.error('Hash verification failed:', error);
    return false;
  }
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Generate UUID v4
export function generateUUID(): string {
  return crypto.randomUUID();
}

// Create HMAC signature
export function createHMAC(data: string, secret?: string): string {
  try {
    const secretToUse = secret || process.env.HMAC_SECRET || 'default-secret';
    const hmac = crypto.createHmac('sha256', secretToUse);
    hmac.update(data);
    return hmac.digest('hex');
  } catch (error) {
    console.error('HMAC creation failed:', error);
    throw new Error('HMAC creation failed');
  }
}

// Verify HMAC signature
export function verifyHMAC(data: string, signature: string, secret?: string): boolean {
  try {
    const computedSignature = createHMAC(data, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));
  } catch (error) {
    console.error('HMAC verification failed:', error);
    return false;
  }
}

// Secure data comparison (timing-safe)
export function secureCompare(a: string, b: string): boolean {
  try {
    if (a.length !== b.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch (error) {
    console.error('Secure comparison failed:', error);
    return false;
  }
}

// Encrypt sensitive data for storage
export function encryptForStorage(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = encrypt(jsonString);
    return Buffer.from(JSON.stringify(encrypted)).toString('base64');
  } catch (error) {
    console.error('Storage encryption failed:', error);
    throw new Error('Storage encryption failed');
  }
}

// Decrypt data from storage
export function decryptFromStorage<T = any>(encryptedData: string): T {
  try {
    const encryptedObj = JSON.parse(Buffer.from(encryptedData, 'base64').toString());
    const decryptedString = decrypt(encryptedObj);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Storage decryption failed:', error);
    throw new Error('Storage decryption failed');
  }
}

// Mask sensitive data for logging
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars * 2) {
    return '*'.repeat(data.length);
  }
  
  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  const middle = '*'.repeat(data.length - visibleChars * 2);
  
  return `${start}${middle}${end}`;
}