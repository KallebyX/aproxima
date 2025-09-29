'use client';

import { useEffect } from 'react';

const ClientInitializer = () => {
  useEffect(() => {
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
    
    // High contrast and reduced motion detection
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      document.documentElement.classList.add('high-contrast');
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    // Focus trap management
    let lastFocusedElement: Element | null = null;
    const handleFocusIn = (e: FocusEvent) => {
      lastFocusedElement = e.target as Element;
    };
    
    document.addEventListener('focusin', handleFocusIn);
    
    // Performance monitoring
    if ('performance' in window) {
      const measurePerformance = () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (perfData) {
            console.log('Load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
          }
        }, 0);
      };
      
      measurePerformance();
    }
    
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return null;
};

export default ClientInitializer;