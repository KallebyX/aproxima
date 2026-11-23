import type { NextApiRequest, NextApiResponse } from 'next';
import { ServerStore } from '../../../utils/serverStore';
import { randomUUID } from 'crypto';
const feedbackStorage = new ServerStore<FeedbackData & { createdAt: string }>('feedback');

interface FeedbackData {
  type: 'bug' | 'suggestion' | 'accessibility_issue' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userAgent?: string;
  screenReader?: string;
  assistiveTechnology?: string;
  reproductionSteps?: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  accessibility?: {
    wcagViolation?: string;
    impactLevel?: 'minor' | 'moderate' | 'serious' | 'critical';
    affectedUsers?: string[];
  };
}

interface FeedbackResponse {
  success: boolean;
  data?: {
    id: string;
    message: string;
    estimatedResponse: string;
  };
  error?: {
    code: string;
    message: string;
    timestamp: string;
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeedbackResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed',
        timestamp: new Date().toISOString(),
      },
    });
  }

  try {
    const feedback: FeedbackData = req.body;

    // Validate required fields
    if (!feedback || typeof feedback !== 'object' || Array.isArray(feedback) ||
        typeof feedback.title !== 'string' || !feedback.title.trim() || feedback.title.length > 200 ||
        typeof feedback.description !== 'string' || !feedback.description.trim() || feedback.description.length > 5000 ||
        !feedback.type) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: 'Type, title, and description are required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Validate feedback type
    const validTypes = ['bug', 'suggestion', 'accessibility_issue', 'general'];
    if (!validTypes.includes(feedback.type)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FEEDBACK_TYPE',
          message: `Type must be one of: ${validTypes.join(', ')}`,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (feedback.priority && !['low', 'medium', 'high', 'critical'].includes(feedback.priority)) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_PRIORITY', message: 'Invalid priority', timestamp: new Date().toISOString() } });
    }
    const feedbackId = randomUUID();
    feedbackStorage.set(feedbackId, {
      type: feedback.type,
      priority: feedback.priority || 'medium',
      title: feedback.title.trim(),
      description: feedback.description.trim(),
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: {
        id: feedbackId,
        message: 'Feedback received successfully. Thank you for helping us improve accessibility!',
        estimatedResponse: 'Não há prazo automático de resposta.',
      },
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while processing feedback',
        timestamp: new Date().toISOString(),
      },
    });
  }
}