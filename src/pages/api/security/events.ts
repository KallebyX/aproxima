import { NextApiRequest, NextApiResponse } from 'next';
import { validateAPIInput } from '../../../middleware/security';
import { logger } from '../../../utils/logger';

interface SecurityEventData {
  type: 'vulnerability' | 'attack' | 'anomaly' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate and sanitize input
    const validation = validateAPIInput(req.body, {
      type: 'message',
      severity: 'message',
      description: 'message'
    });

    if (!validation.isValid) {
      logger.warn('Invalid security event data', { errors: validation.errors });
      return res.status(400).json({ 
        error: 'Invalid input data',
        details: validation.errors 
      });
    }

    const { type, severity, description, metadata } = req.body as SecurityEventData;

    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    
    // Log security event
    logger.error('Security event reported', undefined, {
      type,
      severity,
      description,
      metadata,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: clientIp || req.socket.remoteAddress,
      url: req.url
    });

    // In a production environment, you might want to:
    // - Send alerts to security team
    // - Store in security incident database
    // - Trigger automated response procedures
    // - Integrate with SIEM systems

    // For now, we'll simulate these actions
    if (severity === 'critical' || severity === 'high') {
      // Simulate alert to security team
      logger.error('HIGH PRIORITY SECURITY ALERT', undefined, {
        type,
        severity,
        description,
        immediate_action_required: true
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Security event logged successfully',
      eventId: generateEventId()
    });

  } catch (error) {
    logger.error('Error processing security event', undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process security event'
    });
  }
}

function generateEventId(): string {
  return `SEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}