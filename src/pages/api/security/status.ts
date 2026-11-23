import { NextApiRequest, NextApiResponse } from 'next';
import { validateAPIInput } from '../../../middleware/security';
import { logger } from '../../../utils/logger';
import { getRateLimitStatus } from '../../../utils/rateLimit';

interface SecurityCheckRequest {
  endpoint?: string;
  action?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (req.method === 'GET') {
      // Return current security status
      const securityStatus = {
        timestamp: new Date().toISOString(),
        status: 'operational',
        security_features: {
          input_validation: 'active',
          application_logging: 'active',
          vulnerability_scanning: 'not_configured'
        },
        last_security_scan: process.env.LAST_SECURITY_SCAN || null
      };

      // Check rate limiting status
      const rateLimitStatus = getRateLimitStatus(ip, '/api/security/status');
      
      res.status(200).json({
        ...securityStatus,
        rate_limit: {
          remaining: rateLimitStatus.remaining,
          reset_time: new Date(rateLimitStatus.resetTime).toISOString()
        }
      });

    } else if (req.method === 'POST') {
      // Perform security check for specific endpoint/action
      const validation = validateAPIInput(req.body, {
        endpoint: 'message',
        action: 'message'
      });

      if (!validation.isValid) {
        return res.status(400).json({ 
          error: 'Invalid input data',
          details: validation.errors 
        });
      }

      const { endpoint, action } = req.body as SecurityCheckRequest;

      // Input validation does not constitute a security audit of an endpoint.
      const securityCheck = {
        endpoint: validation.sanitized.endpoint,
        action: validation.sanitized.action,
        security_status: 'not_assessed',
        checks_performed: ['input_validation'],
        timestamp: new Date().toISOString()
      };

      logger.info('Security check performed', {
        endpoint,
        action,
        ip,
        userAgent,
        result: securityCheck.security_status
      });

      res.status(200).json(securityCheck);
    }

  } catch (error) {
    logger.error('Error in security status check', undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to check security status'
    });
  }
}