'use client';

import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    VLibras: any;
  }
}

interface VLibrasProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  avatar?: 'icaro' | 'hosana' | 'guga';
  opacity?: number;
}

export default function VLibras({ 
  position = 'bottom-right', 
  avatar = 'icaro',
  opacity = 1 
}: VLibrasProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const getPositionStyles = useCallback(() => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      opacity,
      transition: 'all 0.3s ease-in-out',
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyles, bottom: '1.25rem', left: '1.25rem' };
      case 'top-right':
        return { ...baseStyles, top: '1.25rem', right: '1.25rem' };
      case 'top-left':
        return { ...baseStyles, top: '1.25rem', left: '1.25rem' };
      default: // bottom-right
        return { ...baseStyles, bottom: '1.25rem', right: '1.25rem' };
    }
  }, [position, opacity]);

  const initializeVLibras = useCallback(() => {
    try {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app', {
          rootPath: '/app',
          avatar: avatar,
          opacity: opacity,
          width: 220,
          height: 200,
        });
        setIsLoaded(true);
        setHasError(false);
        console.log('VLibras initialized successfully');
      }
    } catch (error) {
      console.warn('VLibras initialization failed:', error);
      setHasError(true);
    }
  }, [avatar, opacity]);

  const loadVLibrasScript = useCallback(() => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    
    // Remove existing script if any
    const existingScript = document.querySelector('script[src*="vlibras-plugin.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.defer = true;
    
    const timeoutId = setTimeout(() => {
      console.warn('VLibras script loading timeout');
      setHasError(true);
      setIsRetrying(false);
    }, 10000); // 10 second timeout
    
    script.onload = () => {
      clearTimeout(timeoutId);
      setIsRetrying(false);
      
      // Wait a bit for the script to be ready
      setTimeout(() => {
        initializeVLibras();
      }, 500);
    };
    
    script.onerror = () => {
      clearTimeout(timeoutId);
      console.warn('Failed to load VLibras script');
      setHasError(true);
      setIsRetrying(false);
    };
    
    document.head.appendChild(script);
  }, [initializeVLibras, isRetrying]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoaded(false);
    loadVLibrasScript();
  }, [loadVLibrasScript]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if VLibras is already loaded
    if (window.VLibras && !isLoaded) {
      initializeVLibras();
      return;
    }

    // Load VLibras script if not already loaded
    if (!window.VLibras && !isLoaded && !hasError) {
      loadVLibrasScript();
    }
  }, [initializeVLibras, loadVLibrasScript, isLoaded, hasError]);

  // Don't render anything during SSR
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <>
      {/* Main VLibras container */}
      <div 
        data-vw="true" 
        className="enabled"
        style={getPositionStyles()}
        aria-label="Widget de tradução para Língua Brasileira de Sinais (Libras)"
        role="complementary"
      >
        <div data-vw-access-button="true"></div>
        <div data-vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      {/* Error state with retry option */}
      {hasError && !isLoaded && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            right: '1.25rem',
            zIndex: 10000,
            backgroundColor: 'var(--error)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            maxWidth: '280px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          role="alert"
          aria-live="polite"
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>VLibras indisponível</strong>
            <br />
            Não foi possível carregar o tradutor de Libras.
          </div>
          <button
            onClick={handleRetry}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            disabled={isRetrying}
            aria-label="Tentar carregar VLibras novamente"
          >
            {isRetrying ? 'Carregando...' : 'Tentar novamente'}
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isRetrying && !hasError && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            right: '1.25rem',
            zIndex: 10000,
            backgroundColor: 'var(--info)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          role="status"
          aria-live="polite"
        >
          <div
            style={{
              width: '1rem',
              height: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
            aria-hidden="true"
          />
          Carregando VLibras...
        </div>
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}