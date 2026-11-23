/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/health';

describe('/api/health', () => {
  it('returns health status on GET request', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('status', 'OK');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('services');
    expect(data).not.toHaveProperty('accessibility');
  });

  it('reports actual application and storage checks without claiming external audits', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    const data = JSON.parse(res._getData());
    expect(data.services).toEqual({ application: 'healthy', storage: 'healthy' });
    expect(data.accessibility).toBeUndefined();
    expect(data.services.database).toBeUndefined();
  });

  it('rejects non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res.getHeader('Allow')).toEqual(['GET']);
  });

  it('includes proper cache headers', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res.getHeader('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
    expect(res.getHeader('Pragma')).toBe('no-cache');
    expect(res.getHeader('Expires')).toBe('0');
  });

  it('returns valid timestamp format', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    
    // Should be valid ISO timestamp
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  it('includes version information', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    
    expect(typeof data.version).toBe('string');
    expect(data.version.length).toBeGreaterThan(0);
  });
});