/**
 * Performance monitoring utility
 * Tracks and reports performance metrics for enterprise monitoring
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte

  // Custom metrics
  pageLoadTime?: number;
  apiResponseTime?: number;
  renderTime?: number;
  jsHeapSize?: number;
  
  // Accessibility metrics
  accessibilityScore?: number;
  screenReaderTime?: number;
  keyboardNavigationTime?: number;
}

export interface UserMetrics {
  userId?: string;
  sessionId: string;
  userAgent: string;
  accessibility: {
    screenReader?: boolean;
    highContrast?: boolean;
    keyboardNavigation?: boolean;
    reducedMotion?: boolean;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private userMetrics: UserMetrics;
  private startTime: number;

  constructor() {
    this.startTime = performance.now();
    this.userMetrics = this.detectUserEnvironment();
    this.setupPerformanceObserver();
    this.trackCoreWebVitals();
  }

  private detectUserEnvironment(): UserMetrics {
    const userAgent = navigator.userAgent;
    
    return {
      sessionId: this.generateSessionId(),
      userAgent,
      accessibility: {
        screenReader: this.detectScreenReader(),
        highContrast: this.detectHighContrast(),
        keyboardNavigation: this.detectKeyboardNavigation(),
        reducedMotion: this.detectReducedMotion(),
      },
      device: {
        type: this.detectDeviceType(),
        os: this.detectOS(),
        browser: this.detectBrowser(),
      },
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private detectScreenReader(): boolean {
    // Check for common screen reader indicators
    return !!(
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      (window as any).speechSynthesis ||
      document.querySelector('[aria-hidden]')
    );
  }

  private detectHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  private detectKeyboardNavigation(): boolean {
    let keyboardUsed = false;
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        keyboardUsed = true;
      }
    }, { once: true, passive: true });

    return keyboardUsed;
  }

  private detectReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private detectOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      try {
        // Observe layout shifts (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let cls = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          this.metrics.cls = cls;
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // Observe paint metrics (LCP, FCP)
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'largest-contentful-paint') {
              this.metrics.lcp = entry.startTime;
            }
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
          }
        });
        paintObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        paintObserver.observe({ type: 'paint', buffered: true });

        // Observe first input delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.fid = (entry as any).processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

      } catch (error) {
        console.warn('Performance Observer setup failed:', error);
      }
    }
  }

  private trackCoreWebVitals(): void {
    // Track TTFB
    if ('navigation' in performance) {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
    }

    // Track memory usage
    if ('memory' in performance) {
      this.metrics.jsHeapSize = (performance as any).memory.usedJSHeapSize;
    }
  }

  startTimer(label: string): () => number {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordCustomMetric(label, duration);
      return duration;
    };
  }

  recordCustomMetric(name: string, value: number): void {
    (this.metrics as any)[name] = value;
  }

  recordApiCall(endpoint: string, duration: number, status: number): void {
    this.recordCustomMetric(`api_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}_duration`, duration);
    this.recordCustomMetric(`api_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}_status`, status);
  }

  recordAccessibilityInteraction(type: string, duration: number): void {
    this.recordCustomMetric(`a11y_${type}_duration`, duration);
  }

  recordPageLoad(): void {
    this.metrics.pageLoadTime = performance.now() - this.startTime;
  }

  getMetrics(): PerformanceMetrics & UserMetrics {
    return {
      ...this.metrics,
      ...this.userMetrics,
    };
  }

  sendMetrics(): void {
    const allMetrics = this.getMetrics();
    
    // Send to analytics service
    this.sendToAnalytics(allMetrics);
    
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.group('📊 Performance Metrics');
      console.log('Core Web Vitals:', {
        LCP: allMetrics.lcp,
        FID: allMetrics.fid,
        CLS: allMetrics.cls,
        FCP: allMetrics.fcp,
        TTFB: allMetrics.ttfb,
      });
      console.log('Custom Metrics:', {
        pageLoadTime: allMetrics.pageLoadTime,
        jsHeapSize: allMetrics.jsHeapSize,
      });
      console.log('User Environment:', {
        device: allMetrics.device,
        accessibility: allMetrics.accessibility,
      });
      console.groupEnd();
    }
  }

  private sendToAnalytics(metrics: PerformanceMetrics & UserMetrics): void {
    // Send to Google Analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'performance_metrics', {
        custom_map: metrics,
      });
    }

    // Send to custom analytics endpoint
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        type: 'performance',
        timestamp: new Date().toISOString(),
        metrics,
      });
      
      navigator.sendBeacon('/api/analytics/performance', data);
    }
  }

  // Monitor specific accessibility features
  monitorAccessibilityFeature(feature: string): () => number {
    const timer = this.startTimer(`accessibility_${feature}`);
    
    // Return a function to stop timing
    return timer;
  }

  // Monitor screen reader usage
  monitorScreenReaderUsage(): void {
    let interactions = 0;
    
    // Listen for screen reader specific events
    document.addEventListener('focusin', () => {
      interactions++;
      this.recordCustomMetric('screen_reader_interactions', interactions);
    });
  }

  // Generate performance report
  generateReport(): string {
    const metrics = this.getMetrics();
    
    let report = '📊 Performance Report\n';
    report += '='.repeat(50) + '\n\n';
    
    report += '🎯 Core Web Vitals:\n';
    report += `  LCP: ${metrics.lcp?.toFixed(2)}ms\n`;
    report += `  FID: ${metrics.fid?.toFixed(2)}ms\n`;
    report += `  CLS: ${metrics.cls?.toFixed(4)}\n`;
    report += `  FCP: ${metrics.fcp?.toFixed(2)}ms\n`;
    report += `  TTFB: ${metrics.ttfb?.toFixed(2)}ms\n\n`;
    
    report += '♿ Accessibility:\n';
    report += `  Screen Reader: ${metrics.accessibility.screenReader ? 'Yes' : 'No'}\n`;
    report += `  High Contrast: ${metrics.accessibility.highContrast ? 'Yes' : 'No'}\n`;
    report += `  Keyboard Nav: ${metrics.accessibility.keyboardNavigation ? 'Yes' : 'No'}\n`;
    report += `  Reduced Motion: ${metrics.accessibility.reducedMotion ? 'Yes' : 'No'}\n\n`;
    
    report += '💻 Device Info:\n';
    report += `  Type: ${metrics.device.type}\n`;
    report += `  OS: ${metrics.device.os}\n`;
    report += `  Browser: ${metrics.device.browser}\n`;
    
    return report;
  }
}

// Create singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (typeof window === 'undefined') {
    // Return a no-op monitor for server-side rendering
    return {
      startTimer: () => () => 0,
      recordCustomMetric: () => {},
      recordApiCall: () => {},
      recordAccessibilityInteraction: () => {},
      recordPageLoad: () => {},
      getMetrics: () => ({} as any),
      sendMetrics: () => {},
      monitorAccessibilityFeature: () => {},
      monitorScreenReaderUsage: () => {},
      generateReport: () => 'Performance monitoring not available on server',
    } as any;
  }

  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }

  return performanceMonitor;
}

export default getPerformanceMonitor;