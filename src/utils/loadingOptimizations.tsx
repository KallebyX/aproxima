// 🚀 APROXIMA - Enterprise Loading Optimizations
// FASE 3: Performance & Optimization
// Advanced lazy loading, code splitting, and bundle optimizations

import { lazy, Suspense, ComponentType, ReactNode, useState, useEffect, useRef } from 'react';

// Simple intersection observer hook
function useInView() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

interface LazyComponentProps {
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

// Enterprise-grade loading spinner
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#2A1B5D' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]`} 
         style={{ borderColor: color, borderRightColor: 'transparent' }}
         role="status"
         aria-label="Carregando...">
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

// Advanced skeleton loader for different content types
const SkeletonLoader: React.FC<{ type: 'text' | 'card' | 'image' | 'form' }> = ({ type }) => {
  const skeletons = {
    text: (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    ),
    card: (
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
      </div>
    ),
    image: (
      <div className="bg-gray-200 rounded animate-pulse aspect-video flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    form: (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    )
  };

  return skeletons[type];
};

// Higher-order component for viewport-based lazy loading
export function withViewportLoading<T extends object>(
  Component: ComponentType<T>,
  options: LazyComponentProps = {}
) {
  const LazyComponent: React.FC<T & LazyComponentProps> = (props) => {
    const { 
      fallback = <LoadingSpinner />, 
      threshold = 0.1, 
      rootMargin = '50px',
      triggerOnce = true,
      className = '',
      ...componentProps 
    } = { ...options, ...props };

    const { ref, inView } = useInView();

    return (
      <div ref={ref} className={className}>
        {inView ? (
          <Suspense fallback={fallback}>
            <Component {...(componentProps as T)} />
          </Suspense>
        ) : (
          <div className="min-h-[200px] flex items-center justify-center">
            {fallback}
          </div>
        )}
      </div>
    );
  };

  LazyComponent.displayName = `withViewportLoading(${Component.displayName || Component.name})`;
  return LazyComponent;
}

// Dynamic import helper with retry logic
export async function dynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const moduleExport = await importFn();
      return moduleExport.default;
    } catch (error) {
      console.warn(`Dynamic import failed (attempt ${i + 1}/${retries}):`, error);
      
      if (i === retries - 1) {
        throw new Error(`Failed to load module after ${retries} attempts`);
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  throw new Error('Unexpected error in dynamic import');
}

// Preload utility for critical resources
export const preloadResources = {
  // Preload JavaScript modules
  async preloadComponent(importFn: () => Promise<any>): Promise<void> {
    try {
      await importFn();
      console.log('✅ Component preloaded successfully');
    } catch (error) {
      console.warn('⚠️ Component preload failed:', error);
    }
  },

  // Preload CSS
  preloadCSS(href: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
      console.log(`✅ CSS preloaded: ${href}`);
    };
    link.onerror = () => console.warn(`⚠️ CSS preload failed: ${href}`);
    document.head.appendChild(link);
  },

  // Preload images
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Image preloaded: ${src}`);
        resolve();
      };
      img.onerror = () => {
        console.warn(`⚠️ Image preload failed: ${src}`);
        reject(new Error(`Failed to preload image: ${src}`));
      };
      img.src = src;
    });
  },

  // Preload fonts
  preloadFont(href: string, format = 'woff2'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = `font/${format}`;
    link.href = href;
    link.crossOrigin = 'anonymous';
    link.onload = () => console.log(`✅ Font preloaded: ${href}`);
    link.onerror = () => console.warn(`⚠️ Font preload failed: ${href}`);
    document.head.appendChild(link);
  }
};

// Bundle analysis and optimization utilities
export const bundleOptimizer = {
  // Log bundle size information
  logBundleInfo(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        console.log('📊 Bundle Performance Metrics:', {
          domContentLoaded: `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`,
          loadComplete: `${navigation.loadEventEnd - navigation.loadEventStart}ms`,
          totalSize: navigation.transferSize ? `${(navigation.transferSize / 1024).toFixed(2)} KB` : 'Unknown'
        });
      }
    }
  },

  // Monitor largest contentful paint
  monitorLCP(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          console.log('🎯 Largest Contentful Paint:', {
            time: `${lastEntry.startTime.toFixed(2)}ms`,
            element: 'LCP Element'
          });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('⚠️ LCP monitoring not supported:', error);
      }
    }
  },

  // Monitor cumulative layout shift
  monitorCLS(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          
          console.log('📐 Cumulative Layout Shift:', {
            score: clsValue.toFixed(4),
            rating: clsValue < 0.1 ? 'Good' : clsValue < 0.25 ? 'Needs Improvement' : 'Poor'
          });
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('⚠️ CLS monitoring not supported:', error);
      }
    }
  }
};

// Enterprise code splitting configuration
export const codeSplittingConfig = {
  // Route-based splitting
  routeComponents: {
    Home: lazy(() => import('../pages/index')),
    Gestante: lazy(() => import('../pages/gestante')),
    Profissional: lazy(() => import('../pages/area-do-profissional')),
    Contato: lazy(() => import('../pages/contato')),
  },

  // Feature-based splitting
  featureComponents: {
    AccessibilityToggle: lazy(() => import('../components/AccessibilityToggle')),
    LGPDConsentBanner: lazy(() => import('../components/LGPDConsentBanner')),
    VLibras: lazy(() => import('../components/VLibras')),
  },

  // Utility-based splitting
  utilityModules: {
    encryption: () => import('../utils/encryption'),
    enterpriseCache: () => import('../utils/enterpriseCache'),
  }
};

// Performance monitoring and optimization
export const performanceOptimizer = {
  // Initialize all performance monitoring
  init(): void {
    if (typeof window !== 'undefined') {
      bundleOptimizer.logBundleInfo();
      bundleOptimizer.monitorLCP();
      bundleOptimizer.monitorCLS();
      
      // Preload critical resources
      this.preloadCriticalResources();
      
      // Set up intersection observer for lazy loading
      this.setupLazyLoading();
    }
  },

  // Preload critical resources based on route
  preloadCriticalResources(): void {
    const currentPath = window.location.pathname;
    
    // Always preload core components
    preloadResources.preloadComponent(() => import('../components/Footer'));
    
    // Route-specific preloading
    switch (currentPath) {
      case '/':
        preloadResources.preloadComponent(() => import('../components/AccessibilityToggle'));
        break;
      case '/gestante':
        preloadResources.preloadComponent(() => import('../components/LGPDConsentBanner'));
        break;
      case '/area-do-profissional':
        preloadResources.preloadComponent(() => import('../components/AccessibleForm'));
        break;
    }
  },

  // Setup advanced lazy loading for images and components
  setupLazyLoading(): void {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
  }
};

// Export the main performance optimizer for easy initialization
export default performanceOptimizer;

// Enterprise loading configuration
export const loadingConfig = {
  // Global loading states
  defaultFallbacks: {
    component: <LoadingSpinner size="medium" />,
    page: <SkeletonLoader type="card" />,
    image: <SkeletonLoader type="image" />,
    form: <SkeletonLoader type="form" />,
  },

  // Timeout configurations
  timeouts: {
    component: 10000, // 10 seconds
    image: 5000, // 5 seconds
    api: 30000, // 30 seconds
  },

  // Retry configurations
  retries: {
    component: 3,
    image: 2,
    api: 3,
  }
};