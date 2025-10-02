'use client';

import { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage after mounting
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark";
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const initialTheme = savedTheme || systemTheme;
      
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(newTheme);
    html.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    if (mounted) {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-purple-400/20 to-blue-400/20 scale-110 animate-pulse' 
          : 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20 scale-110'
      }`} />
      
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-14 rounded-full transition-all duration-500 ease-out flex items-center justify-center shadow-2xl focus:ring-4 focus:outline-none backdrop-blur-md border-2 group overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-purple-300 border-purple-400/30 hover:border-purple-400 focus:ring-purple-500/50 shadow-purple-500/10'
            : 'bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-600 border-yellow-400/30 hover:border-yellow-400 focus:ring-yellow-500/50 shadow-yellow-500/10'
        } hover:scale-110 active:scale-95`}
        aria-label={`Trocar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
        title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
      >
        {/* Background pattern */}
        <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10' 
            : 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10'
        }`} />
        
        {/* Icon with enhanced animation */}
        <span className={`relative text-2xl transition-all duration-700 ease-out ${
          theme === 'light' 
            ? 'rotate-0 scale-100 drop-shadow-lg' 
            : 'rotate-180 scale-110 drop-shadow-lg'
        } group-hover:scale-125`}>
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
        
        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-110 transition-transform duration-200" />
        
        {/* Floating particles effect */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-2 right-3 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-3 left-2 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-purple-200 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
        
        <span className="sr-only">
          {theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        </span>
      </button>
      
      {/* Theme label */}
      <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
        'opacity-0 group-hover:opacity-100'
      }`}>
        <span className={`text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-slate-800/90 text-purple-300 border border-purple-400/30'
            : 'bg-yellow-100/90 text-orange-700 border border-yellow-400/30'
        }`}>
          {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
        </span>
      </div>
    </div>
  );
};

export default ThemeSwitcher;