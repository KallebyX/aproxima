'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    VLibras: any;
  }
}

export default function VLibras() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if VLibras is already loaded
    if (window.VLibras) {
      new window.VLibras.Widget('https://vlibras.gov.br/app');
      setIsLoaded(true);
      return;
    }

    // Load V Libras script dynamically
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    
    script.onload = () => {
      try {
        if (window.VLibras) {
          new window.VLibras.Widget('https://vlibras.gov.br/app');
          setIsLoaded(true);
        }
      } catch (error) {
        console.warn('VLibras failed to initialize:', error);
      }
    };
    
    script.onerror = () => {
      console.warn('Failed to load VLibras script');
    };
    
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Don't render anything during SSR
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div 
      data-vw="true" 
      className="enabled"
      style={{ 
        position: 'fixed', 
        zIndex: 1000,
        bottom: '20px',
        right: '20px'
      }}
      aria-label="Widget de tradução para Libras"
    >
      <div data-vw-access-button="true"></div>
      <div data-vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}