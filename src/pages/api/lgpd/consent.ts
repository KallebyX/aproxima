import { NextApiRequest, NextApiResponse } from 'next';
import { validateAPIInput } from '../../../middleware/security';
import { logger } from '../../../utils/logger';
import { ServerStore } from '../../../utils/serverStore';

interface ConsentData {
  userId?: string;
  sessionId: string;
  cookies: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    personalization: boolean;
  };
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  version: string;
}

const consentStorage = new ServerStore<ConsentData>('consents');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Cache-Control', 'no-store');
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    switch (req.method) {
      case 'POST':
        return await handleConsentSubmission(req, res, ip, userAgent);
      
      case 'GET':
        return await handleConsentRetrieval(req, res);
      
      case 'PUT':
        return await handleConsentUpdate(req, res, ip, userAgent);
      
      case 'DELETE':
        return await handleConsentWithdrawal(req, res, ip, userAgent);
      
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('LGPD consent handler error', undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
      method: req.method,
      url: req.url
    });    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process consent request'
    });
  }
}

async function handleConsentSubmission(
  req: NextApiRequest, 
  res: NextApiResponse, 
  ip: string, 
  userAgent: string
) {
  const validation = validateAPIInput(req.body, {
    sessionId: 'message'
  });

  if (!validation.isValid) {
    return res.status(400).json({ 
      error: 'Invalid input data',
      details: validation.errors 
    });
  }

  const { sessionId, cookies } = req.body;
  if (!cookies || typeof cookies !== 'object' || Array.isArray(cookies) ||
      ['analytics', 'marketing', 'personalization'].some(key =>
        cookies[key] !== undefined && typeof cookies[key] !== 'boolean')) {
    return res.status(400).json({ error: 'Cookie preferences must contain boolean values' });
  }

  const consentData: ConsentData = {
    sessionId: validation.sanitized.sessionId,
    cookies: {
      necessary: true, // Always required
      analytics: cookies?.analytics || false,
      marketing: cookies?.marketing || false,
      personalization: cookies?.personalization || false
    },
    timestamp: new Date().toISOString(),
    ipAddress: ip,
    userAgent,
    version: '1.0'
  };

  // Encrypt and store consent
  consentStorage.set(consentData.sessionId, consentData);

  // Log consent for audit trail
  logger.info('LGPD consent recorded', {
    sessionId: consentData.sessionId,
    userId: consentData.userId,
    consentGiven: consentData.cookies,
    ip,
    timestamp: consentData.timestamp
  });

  res.status(200).json({
    success: true,
    message: 'Consent recorded successfully',
    consentId: consentData.sessionId,
    preferences: consentData.cookies,
    timestamp: consentData.timestamp
  });
}

async function handleConsentRetrieval(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId, userId } = req.query;

  if ((!sessionId && !userId) || (sessionId !== undefined && typeof sessionId !== 'string') || (userId !== undefined && typeof userId !== 'string')) {
    return res.status(400).json({ 
      error: 'Session ID or User ID required' 
    });
  }

  const identifier = (sessionId as string) || (userId as string);
  const encryptedData = consentStorage.get(identifier);

  if (!encryptedData) {
    return res.status(404).json({ 
      error: 'Consent record not found' 
    });
  }

  try {
    const consentData = encryptedData;
    
    res.status(200).json({
      success: true,
      consent: {
        preferences: consentData.cookies,
        timestamp: consentData.timestamp,
        version: consentData.version
      }
    });
  } catch (error) {
    logger.error('Failed to decrypt consent data', undefined, { identifier });
    return res.status(500).json({ 
      error: 'Failed to retrieve consent data' 
    });
  }
}

async function handleConsentUpdate(
  req: NextApiRequest, 
  res: NextApiResponse, 
  ip: string, 
  userAgent: string
) {
  const validation = validateAPIInput(req.body, {
    sessionId: 'message'
  });

  if (!validation.isValid) {
    return res.status(400).json({ 
      error: 'Invalid input data',
      details: validation.errors 
    });
  }

  const { sessionId, cookies } = req.body;
  if (!cookies || typeof cookies !== 'object' || Array.isArray(cookies) ||
      ['analytics', 'marketing', 'personalization'].some(key =>
        cookies[key] !== undefined && typeof cookies[key] !== 'boolean')) {
    return res.status(400).json({ error: 'Cookie preferences must contain boolean values' });
  }
  const identifier = validation.sanitized.sessionId;

  const existingData = consentStorage.get(identifier);
  if (!existingData) {
    return res.status(404).json({ 
      error: 'Consent record not found' 
    });
  }

  try {
    const existingConsent = existingData;
    
    const updatedConsent: ConsentData = {
      ...existingConsent,
      cookies: {
        necessary: true, // Always required
        analytics: cookies?.analytics || false,
        marketing: cookies?.marketing || false,
        personalization: cookies?.personalization || false
      },
      timestamp: new Date().toISOString(),
      ipAddress: ip,
      userAgent
    };

    consentStorage.set(identifier, updatedConsent);

    // Log consent update for audit trail
    logger.info('LGPD consent updated', {
      sessionId: identifier,
      userId: updatedConsent.userId,
      previousConsent: existingConsent.cookies,
      newConsent: updatedConsent.cookies,
      ip,
      timestamp: updatedConsent.timestamp
    });

    res.status(200).json({
      success: true,
      message: 'Consent updated successfully',
      preferences: updatedConsent.cookies,
      timestamp: updatedConsent.timestamp
    });
  } catch (error) {
    logger.error('Failed to update consent data', undefined, { identifier });
    return res.status(500).json({ 
      error: 'Failed to update consent data' 
    });
  }
}

async function handleConsentWithdrawal(
  req: NextApiRequest, 
  res: NextApiResponse, 
  ip: string, 
  userAgent: string
) {
  const { sessionId, userId } = req.query;

  if ((!sessionId && !userId) || (sessionId !== undefined && typeof sessionId !== 'string') || (userId !== undefined && typeof userId !== 'string')) {
    return res.status(400).json({ 
      error: 'Session ID or User ID required' 
    });
  }

  const identifier = (sessionId as string) || (userId as string);
  const existingData = consentStorage.get(identifier);

  if (!existingData) {
    return res.status(404).json({ 
      error: 'Consent record not found' 
    });
  }

  try {
    const existingConsent = existingData;

    // Create withdrawal record
    const withdrawalRecord: ConsentData = {
      ...existingConsent,
      cookies: {
        necessary: true, // Cannot withdraw necessary cookies
        analytics: false,
        marketing: false,
        personalization: false
      },
      timestamp: new Date().toISOString(),
      ipAddress: ip,
      userAgent
    };

    consentStorage.set(identifier, withdrawalRecord);

    // Log consent withdrawal for audit trail
    logger.info('LGPD consent withdrawn', {
      sessionId: identifier,
      userId: existingConsent.userId,
      previousConsent: existingConsent.cookies,
      ip,
      timestamp: withdrawalRecord.timestamp
    });

    res.status(200).json({
      success: true,
      message: 'Consent withdrawn successfully',
      preferences: withdrawalRecord.cookies,
      timestamp: withdrawalRecord.timestamp
    });
  } catch (error) {
    logger.error('Failed to withdraw consent', undefined, { identifier });
    return res.status(500).json({ 
      error: 'Failed to withdraw consent' 
    });
  }
}