'use client';

import { useState, useEffect } from 'react';

interface AccessibilityToggleProps {
  className?: string;
}

const AccessibilityToggle = ({ className = '' }: AccessibilityToggleProps) => {
  const [mounted, setMounted] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load saved accessibility preferences
    if (typeof window !== 'undefined') {
      const savedHighContrast = localStorage.getItem('high-contrast') === 'true';
      const savedReducedMotion = localStorage.getItem('reduced-motion') === 'true';
      const savedLargeText = localStorage.getItem('large-text') === 'true';
      
      setIsHighContrast(savedHighContrast);
      setIsReducedMotion(savedReducedMotion);
      setIsLargeText(savedLargeText);
      
      // Apply settings
      applyHighContrast(savedHighContrast);
      applyReducedMotion(savedReducedMotion);
      applyLargeText(savedLargeText);
    }
  }, []);

  const applyHighContrast = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const applyReducedMotion = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const applyLargeText = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  };

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    applyHighContrast(newValue);
    localStorage.setItem('high-contrast', newValue.toString());
  };

  const toggleReducedMotion = () => {
    const newValue = !isReducedMotion;
    setIsReducedMotion(newValue);
    applyReducedMotion(newValue);
    localStorage.setItem('reduced-motion', newValue.toString());
  };

  const toggleLargeText = () => {
    const newValue = !isLargeText;
    setIsLargeText(newValue);
    applyLargeText(newValue);
    localStorage.setItem('large-text', newValue.toString());
  };

  if (!mounted) {
    return (
      <div className={`p-3 rounded-lg bg-white/10 border border-white/20 ${className}`}>
        <span className="text-white text-sm">Carregando...</span>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg bg-white/10 border border-white/20 ${className}`}>
      <h3 className="text-white font-semibold mb-3 text-sm">Acessibilidade</h3>
      
      <div className="space-y-2">
        <button
          onClick={toggleHighContrast}
          className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
            isHighContrast 
              ? 'bg-yellow-500 text-black' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          aria-pressed={isHighContrast}
        >
          <span>Alto Contraste</span>
          <span className="text-lg">{isHighContrast ? '🔆' : '🔅'}</span>
        </button>

        <button
          onClick={toggleReducedMotion}
          className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
            isReducedMotion 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          aria-pressed={isReducedMotion}
        >
          <span>Reduzir Movimento</span>
          <span className="text-lg">{isReducedMotion ? '⏸️' : '▶️'}</span>
        </button>

        <button
          onClick={toggleLargeText}
          className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
            isLargeText 
              ? 'bg-green-500 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          aria-pressed={isLargeText}
        >
          <span>Texto Grande</span>
          <span className="text-lg">{isLargeText ? '🔍' : '🔎'}</span>
        </button>
      </div>
    </div>
  );
};

export default AccessibilityToggle;