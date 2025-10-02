/**
 * Environment configuration utility
 * Provides type-safe access to environment variables
 */

interface EnvironmentConfig {
  // App
  NODE_ENV: 'development' | 'production' | 'test';
  APP_NAME: string;
  APP_VERSION: string;
  APP_URL: string;
  API_URL: string;

  // Security
  JWT_SECRET: string;
  API_SECRET_KEY: string;
  ENCRYPTION_KEY: string;

  // Database
  DATABASE_URL?: string;
  DATABASE_SSL: boolean;

  // Cache
  REDIS_URL?: string;
  REDIS_PASSWORD?: string;

  // Email
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  EMAIL_FROM?: string;

  // Monitoring
  SENTRY_DSN?: string;
  GOOGLE_ANALYTICS_ID?: string;
  HOTJAR_ID?: string;

  // Accessibility
  VLIBRAS_API_KEY?: string;
  ACCESSIBILITY_AUDIT_KEY?: string;

  // Feature Flags
  FEATURE_NOTIFICATIONS: boolean;
  FEATURE_OFFLINE_MODE: boolean;
  FEATURE_AI_RECOMMENDATIONS: boolean;
  FEATURE_TELEMEDICINE: boolean;

  // Internationalization
  DEFAULT_LOCALE: string;
  SUPPORTED_LOCALES: string[];

  // Performance
  BUNDLE_ANALYZE: boolean;
  PERFORMANCE_MONITORING: boolean;
}

function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

function parseNumber(value: string | undefined, defaultValue?: number): number | undefined {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseArray(value: string | undefined, separator = ','): string[] {
  if (!value) return [];
  return value.split(separator).map(item => item.trim()).filter(Boolean);
}

export const env: EnvironmentConfig = {
  // App
  NODE_ENV: (process.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) || 'development',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Aproxima',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '2.1.0',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',

  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  API_SECRET_KEY: process.env.API_SECRET_KEY || 'fallback-api-key',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'fallback-encryption-key-32-chars',

  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_SSL: parseBoolean(process.env.DATABASE_SSL),

  // Cache
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // Email
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseNumber(process.env.SMTP_PORT),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,

  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN,
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
  HOTJAR_ID: process.env.HOTJAR_ID,

  // Accessibility
  VLIBRAS_API_KEY: process.env.VLIBRAS_API_KEY,
  ACCESSIBILITY_AUDIT_KEY: process.env.ACCESSIBILITY_AUDIT_KEY,

  // Feature Flags
  FEATURE_NOTIFICATIONS: parseBoolean(process.env.FEATURE_NOTIFICATIONS, true),
  FEATURE_OFFLINE_MODE: parseBoolean(process.env.FEATURE_OFFLINE_MODE),
  FEATURE_AI_RECOMMENDATIONS: parseBoolean(process.env.FEATURE_AI_RECOMMENDATIONS),
  FEATURE_TELEMEDICINE: parseBoolean(process.env.FEATURE_TELEMEDICINE),

  // Internationalization
  DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'pt-BR',
  SUPPORTED_LOCALES: parseArray(process.env.NEXT_PUBLIC_SUPPORTED_LOCALES, ',') || ['pt-BR'],

  // Performance
  BUNDLE_ANALYZE: parseBoolean(process.env.BUNDLE_ANALYZE),
  PERFORMANCE_MONITORING: parseBoolean(process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING, true),
};

/**
 * Validates required environment variables
 */
export function validateEnvironment(): void {
  const requiredVars: (keyof EnvironmentConfig)[] = [
    'NODE_ENV',
    'APP_NAME',
    'APP_VERSION',
    'APP_URL',
    'API_URL',
  ];

  const missing = requiredVars.filter(key => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Warn about development secrets in production
  if (env.NODE_ENV === 'production') {
    const defaultSecrets = [
      'fallback-secret-change-in-production',
      'fallback-api-key',
      'fallback-encryption-key-32-chars',
    ];

    if (defaultSecrets.includes(env.JWT_SECRET)) {
      console.warn('⚠️  WARNING: Using fallback JWT_SECRET in production!');
    }

    if (defaultSecrets.includes(env.API_SECRET_KEY)) {
      console.warn('⚠️  WARNING: Using fallback API_SECRET_KEY in production!');
    }

    if (defaultSecrets.includes(env.ENCRYPTION_KEY)) {
      console.warn('⚠️  WARNING: Using fallback ENCRYPTION_KEY in production!');
    }
  }
}

/**
 * Checks if we're running in development mode
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Checks if we're running in production mode
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Checks if we're running in test mode
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Gets feature flag value
 */
export function getFeatureFlag(flag: keyof Pick<EnvironmentConfig, 
  'FEATURE_NOTIFICATIONS' | 
  'FEATURE_OFFLINE_MODE' | 
  'FEATURE_AI_RECOMMENDATIONS' | 
  'FEATURE_TELEMEDICINE'
>): boolean {
  return env[flag];
}

export default env;