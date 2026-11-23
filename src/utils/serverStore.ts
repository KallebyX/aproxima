import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { encryptForStorage, decryptFromStorage } from './encryption';

// One synchronous read/modify/rename per operation avoids lost updates in this
// single-process service. The volume and encryption key must survive redeploys.
export function storageDirectory(): string {
  return process.env.DATA_DIR || path.join(process.cwd(), '.data');
}

export function checkStorage(): void {
  fs.mkdirSync(storageDirectory(), { recursive: true, mode: 0o700 });
  fs.accessSync(storageDirectory(), fs.constants.R_OK | fs.constants.W_OK);
}

export class ServerStore<T> {
  constructor(private readonly name: string) {
    if (!/^[a-z-]+$/.test(name)) throw new Error('Invalid store name');
  }
  private file(): string { return path.join(storageDirectory(), `${this.name}.encrypted`); }
  private read(): Record<string, T> {
    try {
      return decryptFromStorage<Record<string, T>>(fs.readFileSync(this.file(), 'utf8'));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
      throw error;
    }
  }
  private write(records: Record<string, T>): void {
    checkStorage();
    const temporary = `${this.file()}.${crypto.randomUUID()}.tmp`;
    try {
      fs.writeFileSync(temporary, encryptForStorage(records), { mode: 0o600, flag: 'wx' });
      fs.renameSync(temporary, this.file());
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
  }
  get(key: string): T | undefined {
    const records = this.read();
    return Object.prototype.hasOwnProperty.call(records, key) ? records[key] : undefined;
  }
  set(key: string, value: T): void {
    const records = this.read();
    Object.defineProperty(records, key, { value, enumerable: true, configurable: true, writable: true });
    this.write(records);
  }
  values(): T[] { return Object.values(this.read()); }
}
