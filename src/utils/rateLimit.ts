// Rate limiting implementation
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

// In-memory store (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations by path
const rateLimitConfigs = {
  '/api/': { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  '/api/contact': { requests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
  '/api/accessibility/feedback': { requests: 20, windowMs: 60 * 1000 }, // 20 requests per minute
  '/api/health': { requests: 200, windowMs: 60 * 1000 }, // 200 requests per minute
  default: { requests: 60, windowMs: 60 * 1000 }, // 60 requests per minute
};

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export async function rateLimit(identifier: string, path: string): Promise<RateLimitResult> {
  // Determine rate limit config
  let config = rateLimitConfigs.default;
  
  for (const [configPath, configSettings] of Object.entries(rateLimitConfigs)) {
    if (configPath !== 'default' && path.startsWith(configPath)) {
      config = configSettings;
      break;
    }
  }
  
  const key = `${identifier}:${path}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Clean up old entries
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupExpiredEntries();
  }
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime <= now) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false
    };
    rateLimitStore.set(key, entry);
    
    return {
      success: true,
      remaining: config.requests - 1,
      resetTime: entry.resetTime
    };
  }
  
  // Check if blocked
  if (entry.blocked && entry.resetTime > now) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    };
  }
  
  // Increment counter
  entry.count++;
  
  if (entry.count > config.requests) {
    entry.blocked = true;
    rateLimitStore.set(key, entry);
    
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    };
  }
  
  rateLimitStore.set(key, entry);
  
  return {
    success: true,
    remaining: config.requests - entry.count,
    resetTime: entry.resetTime
  };
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

// Get current rate limit status
export function getRateLimitStatus(identifier: string, path: string): RateLimitResult {
  const key = `${identifier}:${path}`;
  const entry = rateLimitStore.get(key);
  const now = Date.now();
  
  if (!entry || entry.resetTime <= now) {
    return {
      success: true,
      remaining: rateLimitConfigs.default.requests,
      resetTime: now + rateLimitConfigs.default.windowMs
    };
  }
  
  const config = rateLimitConfigs.default; // Simplified for status check
  
  return {
    success: !entry.blocked,
    remaining: Math.max(0, config.requests - entry.count),
    resetTime: entry.resetTime,
    retryAfter: entry.blocked ? Math.ceil((entry.resetTime - now) / 1000) : undefined
  };
}