import { NextApiRequest, NextApiResponse } from 'next';
import { validateAPIInput } from '../../../middleware/security';
import { logger } from '../../../utils/logger';
import { generateUUID } from '../../../utils/encryption';

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

// In-memory storage for demonstration (use database in production)
const dataRequests = new Map<string, DataRequest>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        return await handleDataRequestUpdate(req, res, ip, userAgent);
      
      default:
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

  const { type, userId, email, description, metadata } = req.body;

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
    userId,
    email: validation.sanitized.email,
    description: validation.sanitized.description,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    metadata: {
      ...metadata,
      ipAddress: ip,
      userAgent,
      source: 'api'
    }
  };

  dataRequests.set(requestId, dataRequest);

  // Log data request for audit trail
  logger.info('LGPD data request submitted', {
    requestId,
    type,
    email: validation.sanitized.email,
    userId,
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
    estimatedCompletion: getEstimatedCompletion(type),
    reference: `LGPD-${requestId.slice(0, 8).toUpperCase()}`
  });

  // In production, trigger notification to data protection team
  notifyDataProtectionTeam(dataRequest);
}

async function handleDataRequestRetrieval(req: NextApiRequest, res: NextApiResponse) {
  const { requestId, email } = req.query;

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
      ...metadata,
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

  // Notify user of status change if completed
  if (updatedRequest.status === 'completed') {
    notifyUserOfCompletion(updatedRequest);
  }
}

function getEstimatedCompletion(type: string): string {
  const days = {
    access: 15,
    rectification: 15,
    erasure: 15,
    portability: 15,
    objection: 15
  };

  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + (days[type as keyof typeof days] || 15));
  
  return completionDate.toISOString();
}

function notifyDataProtectionTeam(request: DataRequest): void {
  // In production, send email/notification to DPO team
  logger.info('Data protection team notification sent', {
    requestId: request.id,
    type: request.type,
    priority: request.type === 'erasure' ? 'high' : 'normal'
  });
}

function notifyUserOfCompletion(request: DataRequest): void {
  // In production, send completion notification to user
  logger.info('User completion notification sent', {
    requestId: request.id,
    email: request.email,
    type: request.type
  });
}