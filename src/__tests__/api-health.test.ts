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
    expect(data).toHaveProperty('accessibility');
  });

  it('returns accessibility compliance information', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    
    expect(data.accessibility).toHaveProperty('wcag_compliance', 'AAA');
    expect(data.accessibility).toHaveProperty('tested_screen_readers');
    expect(data.accessibility).toHaveProperty('last_audit');
    
    // Should include major screen readers
    expect(data.accessibility.tested_screen_readers).toContain('NVDA');
    expect(data.accessibility.tested_screen_readers).toContain('JAWS');
    expect(data.accessibility.tested_screen_readers).toContain('VoiceOver');
  });

  it('returns service status information', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    
    expect(data.services).toHaveProperty('database');
    expect(data.services).toHaveProperty('cache');
    expect(data.services).toHaveProperty('external');
    
    // Services should have valid status
    const validStatuses = ['healthy', 'unhealthy'];
    expect(validStatuses).toContain(data.services.database);
    expect(validStatuses).toContain(data.services.cache);
    expect(validStatuses).toContain(data.services.external);
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