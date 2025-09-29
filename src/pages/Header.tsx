'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from './logo.png';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    mobileMenuButtonRef.current?.focus();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMobileMenuOpen) {
          closeMobileMenu();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <header 
      className="relative flex flex-col items-center p-4 xs:p-6 sm:p-8 md:p-6 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-secondary-400 shadow-2xl"
      role="banner"
      aria-label="Cabeçalho principal da página"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      
      <div className="relative flex items-center justify-between w-full max-w-7xl z-10">
        <div className="flex items-center gap-2 xs:gap-4">
          <Link 
            href="/" 
            className="group focus:outline-2 focus:outline-white focus:outline-offset-4 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              {/* Logo glow effect */}
              <div className="absolute inset-0 bg-white/10 rounded-xl blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image 
                src={logo} 
                alt="Logo Aproxima - Saúde Inclusiva" 
                width={320}
                height={80}
                priority
                className="relative w-48 xs:w-64 sm:w-80 md:w-52 h-auto transition-all duration-300 group-hover:brightness-110"
              />
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-3 xs:gap-4">
          <button
            ref={mobileMenuButtonRef}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className={`lg:hidden w-12 h-12 xs:w-14 xs:h-14 rounded-xl border-2 text-xl xs:text-2xl cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 flex items-center justify-center shadow-xl backdrop-blur-sm group overflow-hidden ${
              isMobileMenuOpen 
                ? 'bg-white text-primary-600 border-white rotate-90 scale-110' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary-600 hover:border-white hover:scale-110'
            }`}
          >
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-110 transition-transform duration-200 rounded-xl" />
            
            <span aria-hidden="true" className={`relative font-bold transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-180' : 'group-hover:scale-110'
            }`}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav 
        id="main-navigation"
        className="relative w-full bg-white/95 backdrop-blur-xl p-4 xs:p-5 mt-4 xs:mt-6 rounded-2xl hidden lg:block shadow-2xl border border-white/20"
        role="navigation" 
        aria-label="Menu de navegação principal"
        tabIndex={-1}
      >
        {/* Navigation background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 rounded-2xl" />
        
        <ul className="relative flex justify-center gap-6 xl:gap-8 list-none m-0 p-0 flex-wrap" role="menubar">
          {[
            { href: '/gestante', label: 'Área da Gestante', icon: '🤱' },
            { href: '/area-do-profissional', label: 'Área do Profissional', icon: '👩‍⚕️' },
            { href: '/produtos-acessiveis', label: 'Produtos Acessíveis', icon: '♿' },
            { href: '/quem-somos', label: 'Quem Somos', icon: '🏥' },
            { href: '/contato', label: 'Contato', icon: '📞' }
          ].map((item, index) => (
            <li key={item.href} role="none">
              <Link 
                href={item.href} 
                className="group flex items-center gap-3 text-primary-700 text-lg xl:text-xl no-underline font-semibold px-5 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-100 hover:to-purple-100 hover:text-primary-800 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2 hover:shadow-lg hover:scale-105 active:scale-95"
                role="menuitem"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="relative">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <div 
        id="mobile-menu"
        className={`relative w-full transition-all duration-500 ease-out overflow-hidden lg:hidden ${
          isMobileMenuOpen 
            ? 'max-h-[600px] opacity-100 mt-4 xs:mt-6' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <nav
          className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 xs:p-5 shadow-2xl border border-white/20"
          role="navigation"
          aria-label="Menu de navegação móvel"
        >
          {/* Mobile navigation background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 rounded-2xl" />
          
          <ul className="relative flex flex-col gap-1 list-none m-0 p-0">
            {[
              { href: '/gestante', label: 'Área da Gestante', icon: '🤱', description: 'Cuidados especializados' },
              { href: '/area-do-profissional', label: 'Área do Profissional', icon: '👩‍⚕️', description: 'Recursos para profissionais' },
              { href: '/produtos-acessiveis', label: 'Produtos Acessíveis', icon: '♿', description: 'Soluções inclusivas' },
              { href: '/quem-somos', label: 'Quem Somos', icon: '🏥', description: 'Nossa missão' },
              { href: '/contato', label: 'Contato', icon: '📞', description: 'Fale conosco' }
            ].map((item, index) => (
              <li key={item.href} role="none">
                <Link 
                  href={item.href} 
                  onClick={closeMobileMenu}
                  className="group flex items-center gap-4 text-primary-700 text-lg no-underline font-semibold px-4 py-4 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-100 hover:to-purple-100 hover:text-primary-800 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2 hover:shadow-lg active:scale-95 border border-transparent hover:border-primary-200"
                  role="menuitem"
                  style={{ 
                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold group-hover:text-primary-800 transition-colors duration-300">
                      {item.label}
                    </div>
                    <div className="text-sm text-primary-600/70 group-hover:text-primary-700 transition-colors duration-300">
                      {item.description}
                    </div>
                  </div>
                  <span className="text-primary-400 group-hover:text-primary-600 transition-all duration-300 group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
