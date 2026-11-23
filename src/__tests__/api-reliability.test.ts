/** @jest-environment node */
import { createMocks } from 'node-mocks-http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import consent from '../pages/api/lgpd/consent';
import dataRequest from '../pages/api/lgpd/data-request';
import settings from '../pages/api/accessibility/settings';
import feedback from '../pages/api/accessibility/feedback';
import securityEvents from '../pages/api/security/events';
import securityStatus from '../pages/api/security/status';
import { ServerStore } from '../utils/serverStore';
import { encrypt, decrypt } from '../utils/encryption';
import { logger } from '../utils/logger';

let dataDir: string;
beforeEach(() => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aproxima-api-'));
  process.env.DATA_DIR = dataDir;
  process.env.ENCRYPTION_KEY = '13'.repeat(32);
  process.env.API_SECRET_KEY = 'test-staff-key';
});
afterEach(() => fs.rmSync(dataDir, { recursive: true, force: true }));

async function call(handler: any, body: unknown, method = 'POST', query = {}, headers = {}) {
  const { req, res } = createMocks({ method: method as any, body: body as any, query, headers });
  req.body = body;
  await handler(req, res);
  return { status: res._getStatusCode(), body: res._getJSONData() };
}

describe('Malformed API inputs', () => {
  it.each([null, [], 'invalid'])('returns 400 for invalid body %p', async body => {
    for (const handler of [consent, dataRequest, settings, feedback, securityEvents, securityStatus]) {
      expect((await call(handler, body)).status).toBe(400);
    }
  });
  it('rejects a forged event type and string preferences', async () => {
    expect((await call(securityEvents, { type: 'invented', severity: 'low', description: 'Event' })).status).toBe(400);
    expect((await call(consent, { sessionId: 'session', cookies: { analytics: 'true' } })).status).toBe(400);
    expect((await call(settings, { highContrast: 'true' })).status).toBe(400);
  });
});

describe('Encryption and durable storage', () => {
  it('uses authenticated encryption and a fresh nonce for each record', () => {
    const first = encrypt('sensitive');
    const second = encrypt('sensitive');
    expect(decrypt(first)).toBe('sensitive');
    expect(first.iv).not.toBe(second.iv);
    expect(first.data).not.toContain('sensitive');
    expect(() => decrypt({ ...first, tag: '00'.repeat(16) })).toThrow();
    process.env.ENCRYPTION_KEY = '14'.repeat(32);
    expect(() => decrypt(first)).toThrow();
    process.env.ENCRYPTION_KEY = 'invalid';
    expect(() => encrypt('x')).toThrow('64 hexadecimal');
  });
  it('rejects missing production key and redacts secrets from logs', () => {
    const oldEnvironment = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    delete process.env.ENCRYPTION_KEY;
    try { expect(() => encrypt('x')).toThrow('required in production'); }
    finally { (process.env as Record<string, string | undefined>).NODE_ENV = oldEnvironment; }
    const output = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('Test', { nested: { generatedKey: 'do-not-log', password: 'private-value' } });
    expect(JSON.stringify(output.mock.calls)).not.toContain('do-not-log');
    expect(JSON.stringify(output.mock.calls)).not.toContain('private-value');
    output.mockRestore();
  });
  it('reads encrypted data from a new store instance and does not lose other keys', () => {
    new ServerStore<any>('test').set('first', { private: 'email@example.com' });
    new ServerStore<any>('test').set('second', { value: 2 });
    expect(new ServerStore<any>('test').get('first')).toEqual({ private: 'email@example.com' });
    expect(new ServerStore<any>('test').values()).toHaveLength(2);
    const file = path.join(dataDir, 'test.encrypted');
    expect(fs.readFileSync(file, 'utf8')).not.toContain('email@example.com');
    expect(fs.statSync(file).mode & 0o777).toBe(0o600);
  });
  it('retains and withdraws consent', async () => {
    const body = { sessionId: 'unique-session', cookies: { analytics: true } };
    expect((await call(consent, body)).status).toBe(200);
    const retrieved = await call(consent, undefined, 'GET', { sessionId: body.sessionId });
    expect(retrieved.body.consent.preferences.analytics).toBe(true);
    expect((await call(consent, undefined, 'DELETE', { sessionId: body.sessionId })).status).toBe(200);
    const withdrawn = await call(consent, undefined, 'GET', { sessionId: body.sessionId });
    expect(withdrawn.body.consent.preferences.analytics).toBe(false);
  });
  it('persists feedback and data requests without claiming email was sent', async () => {
    const received = await call(feedback, { type: 'bug', priority: 'low', title: 'Link', description: 'A link does not work.' });
    expect(received.status).toBe(201);
    expect(new ServerStore<any>('feedback').get(received.body.data.id)?.title).toBe('Link');
    const submission = await call(dataRequest, { type: 'access', email: 'test@example.com', description: 'Access my data.' });
    expect(submission.status).toBe(201);
    const status = await call(dataRequest, undefined, 'GET', { requestId: submission.body.requestId });
    expect(status.body.request.status).toBe('pending');
    expect(status.body.request.email).toBeUndefined();
    expect((await call(dataRequest, undefined, 'GET', { email: 'test@example.com' })).status).toBe(401);
    expect((await call(dataRequest, { status: 'completed' }, 'PUT', { requestId: submission.body.requestId })).status).toBe(401);
    expect((await call(dataRequest, { status: 'completed' }, 'PUT', { requestId: submission.body.requestId }, { authorization: 'Bearer test-staff-key' })).status).toBe(200);
  });
});
