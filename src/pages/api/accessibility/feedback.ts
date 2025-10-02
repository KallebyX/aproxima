import type { NextApiRequest, NextApiResponse } from 'next';

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
    if (!feedback.type || !feedback.title || !feedback.description) {
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

    // Generate feedback ID
    const feedbackId = `${feedback.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Determine response time based on priority and type
    let estimatedResponse = '3-5 business days';
    
    if (feedback.type === 'accessibility_issue') {
      estimatedResponse = feedback.priority === 'critical' ? '4-8 hours' : '1-2 business days';
    } else if (feedback.priority === 'critical') {
      estimatedResponse = '8-24 hours';
    } else if (feedback.priority === 'high') {
      estimatedResponse = '1-2 business days';
    }

    // In a real application, save to database and send notifications
    console.log('Feedback received:', {
      id: feedbackId,
      ...feedback,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    // Special handling for accessibility issues
    if (feedback.type === 'accessibility_issue') {
      console.log('🚨 ACCESSIBILITY ISSUE REPORTED:', {
        id: feedbackId,
        priority: feedback.priority,
        wcagViolation: feedback.accessibility?.wcagViolation,
        impactLevel: feedback.accessibility?.impactLevel,
      });
    }

    res.status(201).json({
      success: true,
      data: {
        id: feedbackId,
        message: 'Feedback received successfully. Thank you for helping us improve accessibility!',
        estimatedResponse,
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