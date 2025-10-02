import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../utils/logger';
import { rateLimit } from '../utils/rateLimit';

// Security headers configuration
const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vlibras.gov.br https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://api.github.com https://www.google-analytics.com;
    frame-src 'self' https://vlibras.gov.br;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),
  
  // HTTP Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // X-Frame-Options
  'X-Frame-Options': 'DENY',
  
  // X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // X-DNS-Prefetch-Control
  'X-DNS-Prefetch-Control': 'off',
  
  // Permissions Policy
  'Permissions-Policy': `
    camera=(),
    microphone=(),
    geolocation=(self),
    payment=(),
    usb=(),
    magnetometer=(),
    gyroscope=(),
    speaker=(),
    fullscreen=(self),
    sync-xhr=()
  `.replace(/\s+/g, ' ').trim(),
  
  // Cross-Origin Embedder Policy
  'Cross-Origin-Embedder-Policy': 'credentialless',
  
  // Cross-Origin Opener Policy
  'Cross-Origin-Opener-Policy': 'same-origin',
  
  // Cross-Origin Resource Policy
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// Input validation patterns
const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
  phone: /^[\d\s\-\+\(\)]{10,20}$/,
  message: /^[\s\S]{1,1000}$/,
  filename: /^[a-zA-Z0-9._-]{1,255}$/,
};

// Sanitization functions
export function sanitizeInput(input: string, type: keyof typeof validationPatterns): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Basic HTML entity encoding
  const sanitized = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  // Type-specific validation
  if (!validationPatterns[type]?.test(sanitized)) {
    logger.warn('Input validation failed', { type, input: input.substring(0, 100) });
    return '';
  }
  
  return sanitized.trim();
}

// SQL injection prevention (for database queries)
export function escapeSQL(input: string): string {
  return input.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

// XSS prevention for JSON responses
export function sanitizeJSON(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return sanitizeInput(obj, 'message');
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeJSON);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeJSON(value);
    }
    return sanitized;
  }
  
  return obj;
}

// Security middleware
export async function securityMiddleware(req: NextRequest): Promise<NextResponse | null> {
  const startTime = Date.now();
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const path = req.nextUrl.pathname;
  
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(ip, path);
    if (!rateLimitResult.success) {
      logger.warn('Rate limit exceeded', { ip, path, userAgent });
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
          ...securityHeaders
        }
      });
    }
    
    // Block suspicious patterns
    const suspiciousPatterns = [
      /(<script|javascript:|vbscript:|onload=|onerror=)/i,
      /(union\s+select|insert\s+into|delete\s+from|drop\s+table)/i,
      /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/i,
      /(\beval\b|\bexec\b|\bsystem\b)/i,
    ];
    
    const requestBody = await getRequestBody(req);
    const queryParams = req.nextUrl.searchParams.toString();
    const fullUrl = `${path}?${queryParams}`;
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(fullUrl) || pattern.test(requestBody)) {
        logger.error('Suspicious request detected', undefined, { 
          ip, 
          path, 
          userAgent, 
          pattern: pattern.source,
          fullUrl: fullUrl.substring(0, 200),
          body: requestBody.substring(0, 200)
        });
        
        return new NextResponse('Forbidden', { 
          status: 403,
          headers: securityHeaders
        });
      }
    }
    
    // Log security events
    logger.info('Security check passed', {
      ip,
      path,
      userAgent,
      duration: Date.now() - startTime
    });
    
    return null; // Continue to next middleware
    
  } catch (error) {
    logger.error('Security middleware error', undefined, { 
      error: error instanceof Error ? error.message : 'Unknown error',
      ip,
      path,
      userAgent
    });
    
    return new NextResponse('Internal Server Error', { 
      status: 500,
      headers: securityHeaders
    });
  }
}

// Helper function to get request body safely
async function getRequestBody(req: NextRequest): Promise<string> {
  try {
    if (req.method === 'GET' || req.method === 'HEAD') {
      return '';
    }
    
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const json = await req.json();
      return JSON.stringify(json);
    }
    
    if (contentType.includes('application/x-www-form-urlencoded') || 
        contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const entries = Array.from(formData.entries());
      return entries.map(([key, value]) => `${key}=${value}`).join('&');
    }
    
    return await req.text();
  } catch {
    return '';
  }
}

// Apply security headers to response
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Validate API input
export function validateAPIInput(data: any, schema: Record<string, keyof typeof validationPatterns>): {
  isValid: boolean;
  errors: string[];
  sanitized: Record<string, string>;
} {
  const errors: string[] = [];
  const sanitized: Record<string, string> = {};
  
  for (const [field, type] of Object.entries(schema)) {
    const value = data[field];
    
    if (!value) {
      errors.push(`${field} is required`);
      continue;
    }
    
    const sanitizedValue = sanitizeInput(value, type);
    
    if (!sanitizedValue) {
      errors.push(`${field} is invalid`);
      continue;
    }
    
    sanitized[field] = sanitizedValue;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

export { securityHeaders };