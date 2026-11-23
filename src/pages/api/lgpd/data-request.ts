import { NextApiRequest, NextApiResponse } from 'next';
import { validateAPIInput } from '../../../middleware/security';
import { logger } from '../../../utils/logger';
import { generateUUID, secureCompare } from '../../../utils/encryption';
import { ServerStore } from '../../../utils/serverStore';

interface DataRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection';
  userId?: string;
  email: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

const dataRequests = new ServerStore<DataRequest>('data-requests');
function hasStaffAccess(req: NextApiRequest): boolean {
  const secret = process.env.API_SECRET_KEY;
  return Boolean(secret && secureCompare(req.headers.authorization || '', `Bearer ${secret}`));
}

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
        return await handleDataRequestSubmission(req, res, ip, userAgent);
      
      case 'GET':
        return await handleDataRequestRetrieval(req, res);
      
      case 'PUT':
        if (!hasStaffAccess(req)) return res.status(401).json({ error: 'Staff authentication required' });
        if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ error: 'Request body must be a JSON object' });
        return await handleDataRequestUpdate(req, res, ip, userAgent);
      
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    logger.error('Error handling data request', undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
      method: req.method,
      ip,
      userAgent
    });

    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process data request'
    });
  }
}

async function handleDataRequestSubmission(
  req: NextApiRequest, 
  res: NextApiResponse, 
  ip: string, 
  userAgent: string
) {
  const validation = validateAPIInput(req.body, {
    email: 'email',
    description: 'message'
  });

  if (!validation.isValid) {
    return res.status(400).json({ 
      error: 'Invalid input data',
      details: validation.errors 
    });
  }

  const { type } = req.body;

  // Validate request type
  const validTypes = ['access', 'rectification', 'erasure', 'portability', 'objection'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ 
      error: 'Invalid request type',
      validTypes 
    });
  }

  const requestId = generateUUID();
  const now = new Date().toISOString();

  const dataRequest: DataRequest = {
    id: requestId,
    type,
    email: validation.sanitized.email,
    description: validation.sanitized.description,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    metadata: {
      source: 'api'
    }
  };

  dataRequests.set(requestId, dataRequest);

  // Log data request for audit trail
  logger.info('LGPD data request submitted', {
    requestId,
    type,
    email: validation.sanitized.email,
    ip,
    timestamp: now
  });

  // Send confirmation response
  res.status(201).json({
    success: true,
    message: 'Data request submitted successfully',
    requestId,
    type,
    status: 'pending',
    reference: `LGPD-${requestId.slice(0, 8).toUpperCase()}`
  });

  // The request is stored locally. No email is sent by this endpoint.
}

async function handleDataRequestRetrieval(req: NextApiRequest, res: NextApiResponse) {
  const { requestId, email } = req.query;

  if (requestId !== undefined && typeof requestId !== 'string') return res.status(400).json({ error: 'Invalid request ID' });
  if (email !== undefined && typeof email !== 'string') return res.status(400).json({ error: 'Invalid email' });
  if (requestId) {
    // Get specific request by ID
    const request = dataRequests.get(requestId as string);
    
    if (!request) {
      return res.status(404).json({ 
        error: 'Data request not found' 
      });
    }

    res.status(200).json({
      success: true,
      request: {
        id: request.id,
        type: request.type,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        completedAt: request.completedAt,
        reference: `LGPD-${request.id.slice(0, 8).toUpperCase()}`
      }
    });
  } else if (email) {
    if (!hasStaffAccess(req)) return res.status(401).json({ error: 'Staff authentication required; use your request ID to check its status' });
    // Get all requests for an email
    const userRequests = Array.from(dataRequests.values())
      .filter(request => request.email === email)
      .map(request => ({
        id: request.id,
        type: request.type,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        completedAt: request.completedAt,
        reference: `LGPD-${request.id.slice(0, 8).toUpperCase()}`
      }));

    res.status(200).json({
      success: true,
      requests: userRequests
    });
  } else {
    return res.status(400).json({ 
      error: 'Request ID or email required' 
    });
  }
}

async function handleDataRequestUpdate(
  req: NextApiRequest, 
  res: NextApiResponse, 
  ip: string, 
  userAgent: string
) {
  const requestIdQuery = req.query.requestId;
  const requestId = Array.isArray(requestIdQuery) ? requestIdQuery[0] : requestIdQuery;
  const { status, completedAt, metadata } = req.body;

  if (!requestId) {
    return res.status(400).json({ 
      error: 'Request ID required' 
    });
  }

  const request = dataRequests.get(requestId as string);
  if (!request) {
    return res.status(404).json({ 
      error: 'Data request not found' 
    });
  }

  const validStatuses = ['pending', 'processing', 'completed', 'rejected'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status',
      validStatuses 
    });
  }

  const updatedRequest: DataRequest = {
    ...request,
    status: status || request.status,
    updatedAt: new Date().toISOString(),
    completedAt: completedAt || (status === 'completed' ? new Date().toISOString() : request.completedAt),
    metadata: {
      ...request.metadata,
      lastUpdatedBy: 'system',
      lastUpdateIp: ip,
      lastUpdateUserAgent: userAgent
    }
  };

  dataRequests.set(requestId as string, updatedRequest);

  // Log status update for audit trail
  logger.info('LGPD data request updated', {
    requestId,
    previousStatus: request.status,
    newStatus: updatedRequest.status,
    updatedBy: 'system',
    ip,
    timestamp: updatedRequest.updatedAt
  });

  res.status(200).json({
    success: true,
    message: 'Data request updated successfully',
    request: {
      id: updatedRequest.id,
      type: updatedRequest.type,
      status: updatedRequest.status,
      updatedAt: updatedRequest.updatedAt,
      completedAt: updatedRequest.completedAt
    }
  });

}
