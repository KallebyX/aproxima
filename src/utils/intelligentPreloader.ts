// 🚀 APROXIMA - Intelligent Preloader with Behavior Analysis
// FASE 3: Advanced Resource Preloading with User Pattern Recognition

export class IntelligentPreloader {
  private preloadedResources: Set<string>;
  private prefetchQueue: Map<string, Promise<Response>>;
  private userBehaviorTracker: UserBehaviorTracker;
  private networkQuality: NetworkQuality;
  private behaviorPatterns: Map<string, number>;
  private routePredictions: Map<string, string[]>;
  private bandwidthAware: boolean;

  constructor() {
    this.preloadedResources = new Set();
    this.prefetchQueue = new Map();
    this.userBehaviorTracker = new UserBehaviorTracker();
    this.networkQuality = new NetworkQuality();
    this.behaviorPatterns = new Map();
    this.routePredictions = new Map();
    this.bandwidthAware = true;
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    this.userBehaviorTracker.startTracking();
    this.networkQuality.monitor();
    this.analyzeBehaviorPatterns();
    this.preloadCriticalResources();
    this.setupIntelligentPrefetching();
    this.setupRouteChangeListener();
    this.setupBandwidthAwareness();
  }

  /**
   * Behavior analysis and pattern recognition
   */
  private analyzeBehaviorPatterns(): void {
    const storedPatterns = localStorage.getItem('preloader-behavior-patterns');
    if (storedPatterns) {
      this.behaviorPatterns = new Map(JSON.parse(storedPatterns));
    }

    const storedPredictions = localStorage.getItem('preloader-route-predictions');
    if (storedPredictions) {
      this.routePredictions = new Map(JSON.parse(storedPredictions));
    }

    console.log('🧠 Behavior patterns loaded:', this.behaviorPatterns.size, 'patterns');
  }

  /**
   * Pattern-based route prediction
   */
  private predictNextRoutes(currentRoute: string): string[] {
    if (this.routePredictions.has(currentRoute)) {
      return this.routePredictions.get(currentRoute)!;
    }

    // Default prediction based on behavior patterns
    const patterns = Array.from(this.behaviorPatterns.entries())
      .filter(([pattern]) => pattern.includes(currentRoute))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([pattern]) => pattern.split('->')[1])
      .filter(Boolean);

    return patterns;
  }

  /**
   * Bandwidth-aware preloading
   */
  private setupBandwidthAwareness(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateBandwidthStrategy = () => {
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          this.bandwidthAware = false;
          console.log('📶 Low bandwidth detected, disabling aggressive preloading');
        } else if (effectiveType === '3g') {
          this.bandwidthAware = true;
          console.log('📶 Medium bandwidth detected, enabling selective preloading');
        } else {
          this.bandwidthAware = true;
          console.log('📶 High bandwidth detected, enabling full preloading');
        }
      };

      updateBandwidthStrategy();
      connection.addEventListener('change', updateBandwidthStrategy);
    }
  }

  private async preloadCriticalResources(): Promise<void> {
    if (!this.bandwidthAware) return;

    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/favicon.png',
      '/icons/icon-192.png'
    ];

    const preloadPromises = criticalResources.map(resource => 
      this.preloadResource(resource, this.getResourceType(resource))
    );

    await Promise.allSettled(preloadPromises);
    console.log('🚀 Critical resources preloaded with bandwidth awareness');
  }

  private setupIntelligentPrefetching(): void {
    this.setupViewportPrefetching();
    this.setupBehaviorBasedPrefetching();
    this.setupInteractionPrefetching();
    this.setupPatternBasedPrefetching();
    // this.setupPriorityOptimization(); // Method not implemented
    // this.setupDynamicImports(); // Method not implemented
  }

  /**
   * Pattern-based prefetching using user behavior analysis
   */
  private setupPatternBasedPrefetching(): void {
    const currentRoute = window.location.pathname;
    const predictedRoutes = this.predictNextRoutes(currentRoute);

    predictedRoutes.forEach(route => {
      if (this.shouldPrefetch(route) && this.bandwidthAware) {
        setTimeout(() => {
          this.prefetchPage(route);
        }, 1000 + Math.random() * 2000); // Staggered prefetching
      }
    });

    console.log('🎯 Pattern-based prefetching enabled for:', predictedRoutes);
  }

  private setupViewportPrefetching(): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            const href = link.href;
            
            if (href && this.shouldPrefetch(href)) {
              this.prefetchPage(href);
              this.trackBehaviorPattern(window.location.pathname, href);
            }
          }
        });
      }, { rootMargin: '100px' });

      document.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
        links.forEach(link => observer.observe(link));
      });
    }
  }

  /**
   * Track user behavior patterns for better prediction
   */
  private trackBehaviorPattern(fromRoute: string, toRoute: string): void {
    const pattern = `${fromRoute}->${toRoute}`;
    const currentCount = this.behaviorPatterns.get(pattern) || 0;
    this.behaviorPatterns.set(pattern, currentCount + 1);

    // Update route predictions
    const predictions = this.routePredictions.get(fromRoute) || [];
    if (!predictions.includes(toRoute)) {
      predictions.push(toRoute);
      this.routePredictions.set(fromRoute, predictions);
    }

    // Persist patterns
    localStorage.setItem('preloader-behavior-patterns', 
      JSON.stringify(Array.from(this.behaviorPatterns.entries())));
    localStorage.setItem('preloader-route-predictions', 
      JSON.stringify(Array.from(this.routePredictions.entries())));
  }

  private setupBehaviorBasedPrefetching(): void {
    // Prefetch likely next pages based on user patterns
    setInterval(() => {
      const predictions = this.userBehaviorTracker.getPredictions();
      predictions.forEach(prediction => {
        if (prediction.confidence > 0.7) {
          this.prefetchPage(prediction.url);
        }
      });
    }, 5000);
  }

  private setupInteractionPrefetching(): void {
    let hoverTimer: NodeJS.Timeout;

    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.href && this.shouldPrefetch(link.href)) {
        // Wait 200ms before prefetching to avoid unnecessary requests
        hoverTimer = setTimeout(() => {
          this.prefetchPage(link.href);
        }, 200);
      }
    });

    document.addEventListener('mouseout', () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    });

    // Also prefetch on focus for keyboard navigation
    document.addEventListener('focus', (event) => {
      const link = event.target as HTMLAnchorElement;
      if (link && link.href && this.shouldPrefetch(link.href)) {
        this.prefetchPage(link.href);
      }
    }, true);
  }

  private setupRouteChangeListener(): void {
    // Listen for Next.js route changes using router events
    if (typeof window !== 'undefined') {
      // Use Next.js router if available - simplified approach
      try {
        // Try to access Next.js router from window object
        const router = (window as any).__NEXT_DATA__ ? (window as any).next?.router : null;
        if (router?.events) {
          router.events.on('routeChangeStart', (url: string) => {
            this.userBehaviorTracker.recordNavigation(url);
            this.preloadRouteResources(url);
          });
        } else {
          // Fallback to popstate event
          window.addEventListener('popstate', () => {
            const url = window.location.pathname;
            this.userBehaviorTracker.recordNavigation(url);
            this.preloadRouteResources(url);
          });
        }
      } catch {
        // Fallback to popstate event
        window.addEventListener('popstate', () => {
          const url = window.location.pathname;
          this.userBehaviorTracker.recordNavigation(url);
          this.preloadRouteResources(url);
        });
      }
    }
  }

  private async preloadResource(url: string, type: string): Promise<void> {
    if (this.preloadedResources.has(url)) return;

    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = type;
      
      if (type === 'font') {
        link.crossOrigin = 'anonymous';
      }

      document.head.appendChild(link);
      this.preloadedResources.add(url);

      console.log(`🔗 Preloaded ${type}: ${url}`);
    } catch (error) {
      console.warn(`⚠️ Failed to preload ${url}:`, error);
    }
  }

  private async prefetchPage(url: string): Promise<void> {
    if (this.prefetchQueue.has(url) || !this.shouldPrefetch(url)) return;

    try {
      // Check network conditions
      if (!this.networkQuality.isGoodForPrefetch()) {
        console.log(`📶 Network too slow for prefetch: ${url}`);
        return;
      }

      const prefetchPromise = fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        priority: 'low'
      } as any);

      this.prefetchQueue.set(url, prefetchPromise);

      await prefetchPromise;
      console.log(`🔮 Prefetched page: ${url}`);
    } catch (error) {
      console.warn(`⚠️ Failed to prefetch ${url}:`, error);
    }
  }

  private async preloadRouteResources(route: string): Promise<void> {
    // Preload route-specific resources
    const routeResources = this.getRouteSpecificResources(route);
    
    const preloadPromises = routeResources.map(resource => 
      this.preloadResource(resource.url, resource.type)
    );

    await Promise.allSettled(preloadPromises);
  }

  private getRouteSpecificResources(route: string): Array<{url: string, type: string}> {
    const resources: Array<{url: string, type: string}> = [];

    // Route-specific resource mapping
    switch (route) {
      case '/gestante':
        resources.push(
          { url: '/images/gestante-hero.webp', type: 'image' },
          { url: '/api/gestante/info', type: 'fetch' }
        );
        break;
      case '/area-do-profissional':
        resources.push(
          { url: '/images/profissional-hero.webp', type: 'image' },
          { url: '/api/profissional/resources', type: 'fetch' }
        );
        break;
      case '/contato':
        resources.push(
          { url: '/images/contato-bg.webp', type: 'image' }
        );
        break;
    }

    return resources;
  }

  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'woff2':
      case 'woff':
      case 'ttf':
        return 'font';
      case 'css':
        return 'style';
      case 'js':
        return 'script';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
      case 'avif':
        return 'image';
      default:
        return 'fetch';
    }
  }

  private shouldPrefetch(url: string): boolean {
    // Don't prefetch external URLs
    if (!url.startsWith('/') && !url.startsWith(window.location.origin)) {
      return false;
    }

    // Don't prefetch API routes
    if (url.includes('/api/')) {
      return false;
    }

    // Don't prefetch if already prefetched
    if (this.prefetchQueue.has(url)) {
      return false;
    }

    // Don't prefetch on slow connections
    if (!this.networkQuality.isGoodForPrefetch()) {
      return false;
    }

    return true;
  }

  public getStats(): any {
    return {
      preloadedResources: Array.from(this.preloadedResources),
      prefetchQueueSize: this.prefetchQueue.size,
      userBehaviorStats: this.userBehaviorTracker.getStats(),
      networkQuality: this.networkQuality.getStats()
    };
  }
}

class UserBehaviorTracker {
  private navigationHistory: Array<{url: string, timestamp: number}>;
  private patterns: Map<string, number>;

  constructor() {
    this.navigationHistory = [];
    this.patterns = new Map();
  }

  startTracking(): void {
    // Track current page
    this.recordNavigation(window.location.pathname);
  }

  recordNavigation(url: string): void {
    const timestamp = Date.now();
    this.navigationHistory.push({ url, timestamp });

    // Keep only last 50 navigations
    if (this.navigationHistory.length > 50) {
      this.navigationHistory.shift();
    }

    // Update patterns
    this.updatePatterns();
  }

  private updatePatterns(): void {
    // Simple pattern detection based on sequence
    if (this.navigationHistory.length < 2) return;

    const recent = this.navigationHistory.slice(-2);
    const pattern = `${recent[0].url} -> ${recent[1].url}`;
    
    this.patterns.set(pattern, (this.patterns.get(pattern) || 0) + 1);
  }

  getPredictions(): Array<{url: string, confidence: number}> {
    const currentUrl = window.location.pathname;
    const predictions: Array<{url: string, confidence: number}> = [];

    // Find patterns starting with current URL
    this.patterns.forEach((count, pattern) => {
      const [from, to] = pattern.split(' -> ');
      if (from === currentUrl && count >= 2) {
        predictions.push({
          url: to,
          confidence: Math.min(count / 10, 1) // Max confidence of 1.0
        });
      }
    });

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  getStats(): any {
    return {
      navigationCount: this.navigationHistory.length,
      patternsDetected: this.patterns.size,
      topPatterns: Array.from(this.patterns.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    };
  }
}

class NetworkQuality {
  private connection: any;
  private isSlowConnection: boolean;

  constructor() {
    this.connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    this.isSlowConnection = false;
  }

  monitor(): void {
    if (this.connection) {
      this.updateConnectionStatus();
      this.connection.addEventListener('change', () => {
        this.updateConnectionStatus();
      });
    }
  }

  private updateConnectionStatus(): void {
    if (!this.connection) return;

    const slowTypes = ['slow-2g', '2g'];
    this.isSlowConnection = slowTypes.includes(this.connection.effectiveType);

    console.log(`📶 Network: ${this.connection.effectiveType} (${this.connection.downlink}Mbps)`);
  }

  isGoodForPrefetch(): boolean {
    if (!this.connection) return true; // Assume good connection if not available

    // Don't prefetch on slow connections or save-data mode
    return !this.isSlowConnection && !this.connection.saveData;
  }

  getStats(): any {
    if (!this.connection) return { supported: false };

    return {
      supported: true,
      effectiveType: this.connection.effectiveType,
      downlink: this.connection.downlink,
      saveData: this.connection.saveData,
      isSlowConnection: this.isSlowConnection
    };
  }
}

// Initialize intelligent preloader
let intelligentPreloader: IntelligentPreloader | null = null;

if (typeof window !== 'undefined') {
  intelligentPreloader = new IntelligentPreloader();
}



export default intelligentPreloader;