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
      <button 
        className="w-10 h-10 xs:w-12 xs:h-12 rounded-lg bg-white/30 text-white border border-white/40 flex items-center justify-center shadow-lg"
        disabled
        aria-label="Carregando tema..."
      >
        <span className="text-lg xs:text-xl drop-shadow-sm">🌙</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 xs:w-12 xs:h-12 rounded-lg bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-600 hover:text-white focus:ring-4 focus:ring-white/50 focus:outline-none transition-all duration-200 flex items-center justify-center touch-manipulation active:scale-95 shadow-lg"
      aria-label={`Trocar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={`Modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <span className="sr-only">
        {theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      </span>
      <span className="text-lg xs:text-xl font-bold">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeSwitcher;