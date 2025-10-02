/**
 * Enterprise-grade logging utility
 * Provides structured logging with different levels and contexts
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
  accessibility?: {
    screenReader?: string;
    highContrast?: boolean;
    keyboardNavigation?: boolean;
  };
  performance?: {
    timing?: number;
    memory?: number;
  };
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  tags?: string[];
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    tags?: string[]
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    if (tags && tags.length > 0) {
      entry.tags = tags;
    }

    return entry;
  }

  private formatForConsole(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const message = entry.message;
    
    let formatted = `[${timestamp}] ${level} ${message}`;
    
    if (entry.context) {
      formatted += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
    }
    
    if (entry.error) {
      formatted += `\n  Error: ${entry.error.name} - ${entry.error.message}`;
      if (entry.error.stack) {
        formatted += `\n  Stack: ${entry.error.stack}`;
      }
    }
    
    if (entry.tags) {
      formatted += `\n  Tags: ${entry.tags.join(', ')}`;
    }

    return formatted;
  }

  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty console output for development
      const formatted = this.formatForConsole(entry);
      
      switch (entry.level) {
        case 'debug':
          console.debug(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'error':
        case 'fatal':
          console.error(formatted);
          break;
      }
    } else {
      // Structured JSON output for production
      console.log(JSON.stringify(entry));
    }

    // Send to external logging service in production
    if (this.isProduction) {
      this.sendToExternalLogger(entry);
    }
  }

  private sendToExternalLogger(entry: LogEntry): void {
        console.log('External logging integration pending...');
    // This is where you would send logs to your logging service
    
    // Example: Send critical errors to Sentry
    if (entry.level === 'error' || entry.level === 'fatal') {
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(new Error(entry.message), {
          extra: entry.context,
          tags: entry.tags,
        });
      }
    }
  }

  debug(message: string, context?: LogContext, tags?: string[]): void {
    if (this.isDevelopment) {
      const entry = this.createLogEntry('debug', message, context, undefined, tags);
      this.output(entry);
    }
  }

  info(message: string, context?: LogContext, tags?: string[]): void {
    const entry = this.createLogEntry('info', message, context, undefined, tags);
    this.output(entry);
  }

  warn(message: string, context?: LogContext, tags?: string[]): void {
    const entry = this.createLogEntry('warn', message, context, undefined, tags);
    this.output(entry);
  }

  error(message: string, error?: Error, context?: LogContext, tags?: string[]): void {
    const entry = this.createLogEntry('error', message, context, error, tags);
    this.output(entry);
  }

  fatal(message: string, error?: Error, context?: LogContext, tags?: string[]): void {
    const entry = this.createLogEntry('fatal', message, context, error, tags);
    this.output(entry);
  }

  // Specialized logging methods for accessibility
  accessibility(message: string, context?: LogContext): void {
    this.info(message, context, ['accessibility', 'a11y']);
  }

  // Specialized logging methods for performance
  performance(message: string, timing: number, context?: LogContext): void {
    const perfContext = {
      ...context,
      performance: {
        timing,
        memory: this.getMemoryUsage(),
      },
    };
    this.info(message, perfContext, ['performance']);
  }

  // Specialized logging methods for security
  security(message: string, context?: LogContext): void {
    this.warn(message, context, ['security']);
  }

  // Specialized logging methods for user interactions
  userInteraction(action: string, context?: LogContext): void {
    this.info(`User interaction: ${action}`, context, ['user', 'interaction']);
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience functions for common use cases
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context),
  fatal: (message: string, error?: Error, context?: LogContext) => logger.fatal(message, error, context),
  accessibility: (message: string, context?: LogContext) => logger.accessibility(message, context),
  performance: (message: string, timing: number, context?: LogContext) => logger.performance(message, timing, context),
  security: (message: string, context?: LogContext) => logger.security(message, context),
  userInteraction: (action: string, context?: LogContext) => logger.userInteraction(action, context),
};

export default logger;