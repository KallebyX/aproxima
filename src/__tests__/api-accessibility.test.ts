/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/accessibility/settings';

describe('/api/accessibility/settings', () => {
  beforeEach(() => {
    // Reset any stored settings between tests
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('returns default accessibility settings', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          'x-user-id': 'test-user',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('highContrast');
      expect(data.data).toHaveProperty('largeText');
      expect(data.data).toHaveProperty('reducedMotion');
      expect(data.data).toHaveProperty('screenReader');
      expect(data.data).toHaveProperty('keyboardNavigation');
      expect(data.data).toHaveProperty('focusIndicator');
      expect(data.data).toHaveProperty('announcements');
    });

    it('returns settings for anonymous users', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  describe('POST/PUT requests', () => {
    it('updates accessibility settings', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'x-user-id': 'test-user',
        },
        body: {
          highContrast: true,
          largeText: true,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.highContrast).toBe(true);
      expect(data.data.largeText).toBe(true);
    });

    it('validates setting keys', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'x-user-id': 'test-user',
        },
        body: {
          invalidSetting: true,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_SETTINGS');
    });

    it('rejects invalid request body', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'x-user-id': 'test-user',
        },
        body: 'invalid-json',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_BODY');
    });
  });

  describe('DELETE requests', () => {
    it('resets settings to defaults', async () => {
      // First set some custom settings
      const { req: postReq, res: postRes } = createMocks({
        method: 'POST',
        headers: {
          'x-user-id': 'test-user',
        },
        body: {
          highContrast: true,
          largeText: true,
        },
      });

      await handler(postReq, postRes);
      expect(postRes._getStatusCode()).toBe(200);

      // Then reset them
      const { req, res } = createMocks({
        method: 'DELETE',
        headers: {
          'x-user-id': 'test-user',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.highContrast).toBe(false);
      expect(data.data.largeText).toBe(false);
      expect(data.data.keyboardNavigation).toBe(true); // Should be true by default
    });
  });

  describe('Error handling', () => {
    it('returns 405 for unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'PATCH',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res.getHeader('Allow')).toEqual(['GET', 'POST', 'PUT', 'DELETE']);
    });
  });

  describe('Accessibility features', () => {
    it('supports all WCAG-required settings', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      const settings = data.data;
      
      // Check for WCAG AAA related settings
      expect(settings).toHaveProperty('highContrast'); // For low vision users
      expect(settings).toHaveProperty('largeText'); // For low vision users
      expect(settings).toHaveProperty('reducedMotion'); // For vestibular disorders
      expect(settings).toHaveProperty('keyboardNavigation'); // For motor disabilities
      expect(settings).toHaveProperty('focusIndicator'); // For keyboard users
      expect(settings).toHaveProperty('screenReader'); // For blind users
      expect(settings).toHaveProperty('announcements'); // For screen reader users
    });

    it('has sensible defaults for accessibility', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      const settings = data.data;
      
      // Essential accessibility features should be enabled by default
      expect(settings.keyboardNavigation).toBe(true);
      expect(settings.focusIndicator).toBe(true);
      expect(settings.announcements).toBe(true);
    });
  });
});