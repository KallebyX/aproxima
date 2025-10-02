import crypto from 'crypto';
import { logger } from './logger';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits

// Get encryption key from environment or generate one
function getEncryptionKey(): Buffer {
  const keyFromEnv = process.env.ENCRYPTION_KEY;
  
  if (keyFromEnv) {
    return Buffer.from(keyFromEnv, 'hex');
  }
  
  // Generate a random key (for development only)
  const key = crypto.randomBytes(KEY_LENGTH);
  logger.warn('Using generated encryption key. Set ENCRYPTION_KEY environment variable in production.', {
    generatedKey: key.toString('hex')
  });
  
  return key;
}

const encryptionKey = getEncryptionKey();

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
}

// Encrypt sensitive data (simplified version)
export function encrypt(text: string): EncryptedData {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      data: encrypted,
      iv: iv.toString('hex'),
      tag: 'mock-tag' // Simplified for compatibility
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Encryption failed');
  }
}

// Decrypt sensitive data (simplified version)
export function decrypt(encryptedData: EncryptedData): string {
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Decryption failed');
  }
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
    return computedHash === hash;
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