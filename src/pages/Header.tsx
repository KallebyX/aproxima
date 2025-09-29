'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from './logo.png';
import ThemeSwitcher from '../components/ThemeSwitcher';
import AdvancedAccessibility from '../components/AdvancedAccessibility';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const accessibilityRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    mobileMenuButtonRef.current?.focus();
  };

  const toggleAccessibility = () => {
    setShowAccessibility(!showAccessibility);
  };

  const closeAccessibility = () => {
    setShowAccessibility(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMobileMenuOpen) {
          closeMobileMenu();
        }
        if (showAccessibility) {
          closeAccessibility();
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (accessibilityRef.current && !accessibilityRef.current.contains(event.target as Node)) {
        setShowAccessibility(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, showAccessibility]);

  return (
    <header 
      className="relative flex flex-col items-center p-4 xs:p-6 sm:p-8 md:p-4 bg-primary-600 text-secondary-400"
      role="banner"
      aria-label="Cabeçalho principal da página"
    >
      <div className="flex items-center justify-between w-full max-w-7xl">
        <div className="flex items-center gap-2 xs:gap-4">
          <Link href="/" className="focus:outline-2 focus:outline-white focus:outline-offset-2 rounded-lg">
            <Image 
              src={logo} 
              alt="Logo Aproxima - Saúde Inclusiva" 
              width={320}
              height={80}
              priority
              className="w-48 xs:w-64 sm:w-80 md:w-48 h-auto"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-2 xs:gap-3">
          <ThemeSwitcher />
          
          <div className="relative">
            <button
              onClick={toggleAccessibility}
              className={`w-10 h-10 xs:w-12 xs:h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center shadow-lg focus:ring-4 focus:ring-white/50 focus:outline-none 
                ${showAccessibility ? 'header-button ring-4 ring-primary-600 border-white' : 'bg-white text-primary-600 border-primary-600 hover:bg-primary-600 hover:text-white'}
              `}
              aria-label={showAccessibility ? "Fechar configurações de acessibilidade" : "Abrir configurações de acessibilidade"}
              aria-expanded={showAccessibility}
              aria-haspopup="dialog"
              title="Configurações de Acessibilidade"
            >
              <span className="text-lg xs:text-xl font-bold" aria-hidden="true">♿</span>
              {/* Contraste extra para acessibilidade */}
            </button>
            
            {/* Accessibility Panel */}
            {showAccessibility && (
              <div 
                ref={accessibilityRef}
                className="absolute top-full right-0 mt-2 z-50 min-w-80"
                role="dialog"
                aria-modal="false"
                aria-label="Painel de configurações de acessibilidade"
              >
                <div className="bg-gray-900 rounded-lg shadow-2xl border-2 border-gray-700 p-2 backdrop-blur-sm">
                  <AdvancedAccessibility />
                </div>
              </div>
            )}
          </div>
          
          <button
            ref={mobileMenuButtonRef}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="lg:hidden w-10 h-10 xs:w-12 xs:h-12 bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-600 hover:text-white text-xl xs:text-2xl cursor-pointer rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/50 flex items-center justify-center shadow-lg"
          >
            <span aria-hidden="true" className="font-bold">
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav 
        id="main-navigation"
        className="w-full bg-secondary-400 p-3 xs:p-4 mt-3 xs:mt-4 rounded-lg hidden lg:block"
        role="navigation" 
        aria-label="Menu de navegação principal"
        tabIndex={-1}
      >
        <ul className="flex justify-center gap-8 xl:gap-12 list-none m-0 p-0 flex-wrap" role="menubar">
          <li role="none">
            <Link 
              href="/gestante" 
              className="text-primary-600 text-lg xl:text-xl no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2 block text-center"
              role="menuitem"
            >
              Área da Gestante
            </Link>
          </li>
          <li role="none">
            <Link 
              href="/area-do-profissional" 
              className="text-primary-600 text-lg xl:text-xl no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2 block text-center"
              role="menuitem"
            >
              Área do Profissional
            </Link>
          </li>
          <li role="none">
            <Link 
              href="/produtos-acessiveis" 
              className="text-primary-600 text-lg xl:text-xl no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2 block text-center"
              role="menuitem"
            >
              Produtos Acessíveis
            </Link>
          </li>
          <li role="none">
            <Link 
              href="/quem-somos" 
              className="text-primary-600 text-lg xl:text-xl no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2 block text-center"
              role="menuitem"
            >
              Quem Somos
            </Link>
          </li>
          <li role="none">
            <Link 
              href="/contato" 
              className="text-primary-600 text-lg xl:text-xl no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2 block text-center"
              role="menuitem"
            >
              Contato
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <div 
        id="mobile-menu"
        className={`w-full transition-all duration-300 overflow-hidden lg:hidden ${
          isMobileMenuOpen 
            ? 'max-h-[500px] xs:max-h-96 opacity-100 mt-3 xs:mt-4' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <nav
          className="bg-secondary-400 rounded-lg p-3 xs:p-4"
          role="navigation"
          aria-label="Menu de navegação móvel"
        >
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            <li role="none">
              <Link 
                href="/gestante" 
                onClick={closeMobileMenu}
                className="text-primary-600 text-lg no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 block hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2"
                role="menuitem"
              >
                Área da Gestante
              </Link>
            </li>
            <li role="none">
              <Link 
                href="/area-do-profissional" 
                onClick={closeMobileMenu}
                className="text-primary-600 text-lg no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 block hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2"
                role="menuitem"
              >
                Área do Profissional
              </Link>
            </li>
            <li role="none">
              <Link 
                href="/produtos-acessiveis" 
                onClick={closeMobileMenu}
                className="text-primary-600 text-lg no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 block hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2"
                role="menuitem"
              >
                Produtos Acessíveis
              </Link>
            </li>
            <li role="none">
              <Link 
                href="/quem-somos" 
                onClick={closeMobileMenu}
                className="text-primary-600 text-lg no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 block hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2"
                role="menuitem"
              >
                Quem Somos
              </Link>
            </li>
            <li role="none">
              <Link 
                href="/contato" 
                onClick={closeMobileMenu}
                className="text-primary-600 text-lg no-underline font-semibold px-4 py-3 rounded-lg transition-all duration-200 block hover:bg-primary-600/10 hover:text-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2"
                role="menuitem"
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
