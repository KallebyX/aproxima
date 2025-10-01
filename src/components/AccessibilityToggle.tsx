'use client';

import { useState, useEffect, useRef } from 'react';
import AdvancedAccessibility from './AdvancedAccessibility';

export default function AccessibilityToggle() {
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [mounted, setMounted] = useState(false);
  const accessibilityRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleAccessibility = () => {
    setShowAccessibility(!showAccessibility);
    if (!showAccessibility) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeAccessibility = () => {
    setShowAccessibility(false);
    document.body.style.overflow = 'unset';
    buttonRef.current?.focus();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showAccessibility) {
        closeAccessibility();
      }
    };

    if (showAccessibility) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (showAccessibility) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [showAccessibility]);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed right-3 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40">
        <div className="relative group">
          {!showAccessibility && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-ping" />
          )}
          
          <button
            ref={buttonRef}
            onClick={toggleAccessibility}
            className={`
              relative flex items-center justify-center rounded-full transition-all duration-300 ease-out
              focus:outline-none focus:ring-4 focus:ring-blue-500/50
              shadow-lg hover:shadow-xl backdrop-blur-sm border-2
              w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
              ${showAccessibility 
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-400 scale-105 shadow-blue-500/25' 
                : 'bg-white/95 text-blue-600 border-blue-500/30 hover:scale-110 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-blue-400'
              }
            `}
            aria-label={showAccessibility ? "Fechar painel de acessibilidade" : "Abrir painel de acessibilidade"}
            aria-expanded={showAccessibility}
            aria-haspopup="dialog"
          >
            <span 
              className={`
                font-bold transition-all duration-300
                text-lg sm:text-xl lg:text-2xl
                ${showAccessibility ? 'rotate-12 scale-110' : 'group-hover:scale-125 group-hover:rotate-6'}
              `}
              aria-hidden="true"
            >
              ♿
            </span>
            
            <div className={`
              absolute inset-0 rounded-full bg-white/20 transition-all duration-200
              ${showAccessibility ? 'scale-0 opacity-0' : 'scale-0 opacity-0 group-active:scale-100 group-active:opacity-100'}
            `} />
          </button>
          
          <div className={`
            absolute -left-2 top-1/2 -translate-y-1/2 transition-all duration-300
            ${showAccessibility ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}>
            <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          </div>
        </div>
      </div>

      {showAccessibility && (
        <div 
          ref={accessibilityRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
        >
          <div 
            className="absolute inset-0 bg-black/50 sm:bg-black/60 backdrop-blur-sm"
            onClick={closeAccessibility}
            aria-hidden="true"
          />
          
          <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl bg-white rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between gap-4 p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white text-sm sm:text-lg lg:text-xl font-bold">♿</span>
                </div>
                <div className="min-w-0">
                  <h2 
                    id="accessibility-title"
                    className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate"
                  >
                    Acessibilidade
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    Personalize sua experiência
                  </p>
                </div>
              </div>
              
              <button
                onClick={closeAccessibility}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label="Fechar painel de acessibilidade"
              >
                <span className="text-lg sm:text-xl font-bold">×</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-4 lg:p-6 custom-scrollbar">
              <AdvancedAccessibility className="w-full" />
            </div>
            
            <div className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 border-t border-gray-200 bg-gray-50/80 flex-shrink-0">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 text-center">
                  WCAG 2.1 AAA • Aproxima Saúde
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
