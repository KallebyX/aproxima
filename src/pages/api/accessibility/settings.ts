import type { NextApiRequest, NextApiResponse } from 'next';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicator: boolean;
  announcements: boolean;
}

interface AccessibilityResponse {
  success: boolean;
  data?: AccessibilitySettings;
  error?: {
    code: string;
    message: string;
    timestamp: string;
  };
}

// In-memory storage for demo (in production, use database)
const userSettings: Record<string, AccessibilitySettings> = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccessibilityResponse>
) {
  const { method } = req;
  const userId = req.headers['x-user-id'] as string || 'anonymous';

  try {
    switch (method) {
      case 'GET':
        // Get user accessibility settings
        const settings = userSettings[userId] || {
          highContrast: false,
          largeText: false,
          reduceMotion: false,
          screenReader: false,
          keyboardNavigation: false,
          colorBlind: false,
          focusIndicators: true,
          altText: true,
          autoplay: false,
          timeout: 0
        };

        res.status(200).json({
          success: true,
          data: settings,
        });
        break;

      case 'POST':
      case 'PUT':
        // Update user accessibility settings
        const { body } = req;
        
        if (!body || typeof body !== 'object') {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_BODY',
              message: 'Request body must be a valid object',
              timestamp: new Date().toISOString(),
            },
          });
        }

        // Validate settings
        const allowedKeys = [
          'highContrast',
          'largeText',
          'reducedMotion',
          'screenReader',
          'keyboardNavigation',
          'focusIndicator',
          'announcements',
        ];

        const invalidKeys = Object.keys(body).filter(
          key => !allowedKeys.includes(key)
        );

        if (invalidKeys.length > 0) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_SETTINGS',
              message: `Invalid setting keys: ${invalidKeys.join(', ')}`,
              timestamp: new Date().toISOString(),
            },
          });
        }

        // Update settings
        const currentSettings = userSettings[userId] || {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          screenReader: false,
          keyboardNavigation: true,
          focusIndicator: true,
          announcements: true,
        };

        const updatedSettings = { ...currentSettings, ...body };
        userSettings[userId] = updatedSettings;

        res.status(200).json({
          success: true,
          data: updatedSettings,
        });
        break;

      case 'DELETE':
        // Reset accessibility settings to defaults
        const defaultSettings: AccessibilitySettings = {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          screenReader: false,
          keyboardNavigation: true,
          focusIndicator: true,
          announcements: true,
        };

        userSettings[userId] = defaultSettings;

        res.status(200).json({
          success: true,
          data: defaultSettings,
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: `Method ${method} not allowed`,
            timestamp: new Date().toISOString(),
          },
        });
        break;
    }
  } catch (error) {
    console.error('Accessibility API error:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      },
    });
  }
}