// 🚀 APROXIMA - Real-time Performance Monitor
// FASE 3: Advanced Performance Tracking & Bundle Optimization

import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  bundleSize: number;
  cacheHitRate: number;
  serviceWorkerStatus: string;
}

interface BundleAnalysis {
  mainBundle: number;
  vendorBundle: number;
  chunks: Array<{ name: string; size: number }>;
  totalSize: number;
  compressionRatio: number;
}

export class PerformanceTracker {
  private metrics: PerformanceMetrics;
  private observers: Map<string, PerformanceObserver>;
  private startTime: number;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.observers = new Map();
    this.startTime = performance.now();
    this.initializeObservers();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      loadTime: 0,
      fcp: 0,
      lcp: 0,
      cls: 0,
      fid: 0,
      bundleSize: 0,
      cacheHitRate: 0,
      serviceWorkerStatus: 'unknown'
    };
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    this.createObserver('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          console.log(`🎨 FCP: ${entry.startTime.toFixed(2)}ms`);
        }
      });
    });

    // Largest Contentful Paint
    this.createObserver('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      console.log(`🖼️ LCP: ${lastEntry.startTime.toFixed(2)}ms`);
    });

    // Cumulative Layout Shift
    this.createObserver('layout-shift', (entries) => {
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          this.metrics.cls += (entry as any).value;
        }
      });
      console.log(`📐 CLS: ${this.metrics.cls.toFixed(4)}`);
    });

    // First Input Delay
    this.createObserver('first-input', (entries) => {
      const firstInput = entries[0];
      this.metrics.fid = (firstInput as any).processingStart - firstInput.startTime;
      console.log(`⚡ FID: ${this.metrics.fid.toFixed(2)}ms`);
    });

    // Navigation timing
    this.trackNavigationTiming();
  }

  private createObserver(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries());
        });
        observer.observe({ entryTypes: [type] });
        this.observers.set(type, observer);
      } catch (error) {
        console.warn(`⚠️ Performance observer for ${type} not supported:`, error);
      }
    }
  }

  private trackNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
        console.log(`⏱️ Total Load Time: ${this.metrics.loadTime.toFixed(2)}ms`);
      }
    });
  }

  public async analyzeBundleSize(): Promise<BundleAnalysis> {
    if (typeof window === 'undefined') {
      return {
        mainBundle: 0,
        vendorBundle: 0,
        chunks: [],
        totalSize: 0,
        compressionRatio: 0
      };
    }

    // Estimate bundle sizes from resource timing
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    let mainBundle = 0;
    let vendorBundle = 0;
    const chunks: Array<{ name: string; size: number }> = [];
    let totalSize = 0;

    resources.forEach((resource) => {
      if (resource.name.includes('/_next/static/js/')) {
        const size = resource.transferSize || 0;
        totalSize += size;

        if (resource.name.includes('vendor')) {
          vendorBundle += size;
        } else if (resource.name.includes('main') || resource.name.includes('app')) {
          mainBundle += size;
        } else {
          chunks.push({
            name: resource.name.split('/').pop() || 'unknown',
            size: size
          });
        }
      }
    });

    // Estimate compression ratio
    const uncompressedSize = resources.reduce((sum, r) => sum + (r.decodedBodySize || 0), 0);
    const compressedSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const compressionRatio = compressedSize > 0 ? uncompressedSize / compressedSize : 1;

    const analysis: BundleAnalysis = {
      mainBundle,
      vendorBundle,
      chunks: chunks.sort((a, b) => b.size - a.size),
      totalSize,
      compressionRatio
    };

    console.log('📦 Bundle Analysis:', analysis);
    return analysis;
  }

  public async checkServiceWorkerStatus(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      this.metrics.serviceWorkerStatus = 'not-supported';
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        if (registration.active) {
          this.metrics.serviceWorkerStatus = 'active';
          // Request cache statistics
          this.requestCacheStatistics();
        } else {
          this.metrics.serviceWorkerStatus = 'installing';
        }
      } else {
        this.metrics.serviceWorkerStatus = 'not-registered';
      }
    } catch (error) {
      console.error('❌ Error checking service worker status:', error);
      this.metrics.serviceWorkerStatus = 'error';
    }
  }

  private requestCacheStatistics(): void {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        const { cacheStatus } = event.data;
        if (cacheStatus) {
          const total = cacheStatus.cacheHits + cacheStatus.cacheMisses;
          this.metrics.cacheHitRate = total > 0 ? (cacheStatus.cacheHits / total) * 100 : 0;
          console.log(`💾 Cache Hit Rate: ${this.metrics.cacheHitRate.toFixed(1)}%`);
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [channel.port2]
      );
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public generatePerformanceScore(): number {
    let score = 100;

    // FCP scoring (0-2s excellent, 2-4s good, >4s poor)
    if (this.metrics.fcp > 4000) score -= 20;
    else if (this.metrics.fcp > 2000) score -= 10;

    // LCP scoring (0-2.5s excellent, 2.5-4s good, >4s poor)
    if (this.metrics.lcp > 4000) score -= 25;
    else if (this.metrics.lcp > 2500) score -= 15;

    // CLS scoring (0-0.1 excellent, 0.1-0.25 good, >0.25 poor)
    if (this.metrics.cls > 0.25) score -= 20;
    else if (this.metrics.cls > 0.1) score -= 10;

    // FID scoring (0-100ms excellent, 100-300ms good, >300ms poor)
    if (this.metrics.fid > 300) score -= 15;
    else if (this.metrics.fid > 100) score -= 8;

    // Cache hit rate bonus
    if (this.metrics.cacheHitRate > 80) score += 5;
    if (this.metrics.cacheHitRate > 90) score += 5;

    // Service worker bonus
    if (this.metrics.serviceWorkerStatus === 'active') score += 10;

    return Math.max(0, Math.min(100, score));
  }

  public async generateReport(): Promise<any> {
    const bundleAnalysis = await this.analyzeBundleSize();
    await this.checkServiceWorkerStatus();

    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.getMetrics(),
      bundleAnalysis,
      performanceScore: this.generatePerformanceScore(),
      recommendations: this.generateRecommendations(),
      webVitals: {
        fcp: { value: this.metrics.fcp, rating: this.getRating('fcp', this.metrics.fcp) },
        lcp: { value: this.metrics.lcp, rating: this.getRating('lcp', this.metrics.lcp) },
        cls: { value: this.metrics.cls, rating: this.getRating('cls', this.metrics.cls) },
        fid: { value: this.metrics.fid, rating: this.getRating('fid', this.metrics.fid) }
      }
    };

    console.log('📊 Performance Report Generated:', report);
    return report;
  }

  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      fcp: [2000, 4000],
      lcp: [2500, 4000],
      cls: [0.1, 0.25],
      fid: [100, 300]
    };

    const [good, poor] = thresholds[metric as keyof typeof thresholds] || [0, 0];
    
    if (metric === 'cls') {
      if (value <= good) return 'good';
      if (value <= poor) return 'needs-improvement';
      return 'poor';
    } else {
      if (value <= good) return 'good';
      if (value <= poor) return 'needs-improvement';
      return 'poor';
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.fcp > 4000) {
      recommendations.push('Optimize critical rendering path to improve First Contentful Paint');
    }

    if (this.metrics.lcp > 4000) {
      recommendations.push('Optimize largest element loading to improve Largest Contentful Paint');
    }

    if (this.metrics.cls > 0.25) {
      recommendations.push('Reduce layout shifts by setting dimensions for images and ads');
    }

    if (this.metrics.fid > 300) {
      recommendations.push('Optimize JavaScript execution to reduce First Input Delay');
    }

    if (this.metrics.cacheHitRate < 70) {
      recommendations.push('Improve caching strategy to increase cache hit rate');
    }

    if (this.metrics.serviceWorkerStatus !== 'active') {
      recommendations.push('Ensure Service Worker is properly registered and active');
    }

    return recommendations;
  }

  public disconnect(): void {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

// React Hook for performance monitoring
export function usePerformanceMonitoring() {
  const [tracker] = useState(() => new PerformanceTracker());
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis | null>(null);

  const updateMetrics = useCallback(async () => {
    const currentMetrics = tracker.getMetrics();
    const currentBundle = await tracker.analyzeBundleSize();
    
    setMetrics(currentMetrics);
    setBundleAnalysis(currentBundle);
  }, [tracker]);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    updateMetrics(); // Initial update

    return () => {
      clearInterval(interval);
      tracker.disconnect();
    };
  }, [updateMetrics, tracker]);

  const generateReport = useCallback(() => {
    return tracker.generateReport();
  }, [tracker]);

  return {
    metrics,
    bundleAnalysis,
    generateReport,
    performanceScore: metrics ? tracker.generatePerformanceScore() : 0
  };
}

export default PerformanceTracker;