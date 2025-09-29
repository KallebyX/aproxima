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
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-200">
        <span className="text-sm text-gray-500">🌙</span>
        <span className="text-xs text-gray-500 font-medium">Carregando...</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 rounded-full px-3 py-2 shadow-lg border border-gray-200 hover:shadow-xl focus:ring-2 focus:ring-primary-500 focus:outline-none active:scale-95"
      aria-label={`Trocar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <span className="text-sm transition-transform duration-200 group-hover:scale-110">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors duration-200">
        {theme === 'light' ? 'Escuro' : 'Claro'}
      </span>
      <span className="sr-only">
        {theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      </span>
    </button>
  );
};

export default ThemeSwitcher;