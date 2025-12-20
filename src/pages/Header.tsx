'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from './logo.png';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: '/gestante', label: 'Área da Gestante', icon: '🤱', description: 'Cuidados especializados' },
    { href: '/area-do-profissional', label: 'Área do Profissional', icon: '👩‍⚕️', description: 'Recursos para profissionais' },
    { href: '/produtos-acessiveis', label: 'Produtos Acessíveis', icon: '♿', description: 'Soluções inclusivas' },
    { href: '/quem-somos', label: 'Quem Somos', icon: '🏥', description: 'Nossa missão' },
    { href: '/contato', label: 'Contato', icon: '📞', description: 'Fale conosco' }
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-gradient-to-r from-primary-700/98 via-primary-600/98 to-primary-700/98 backdrop-blur-xl shadow-2xl'
          : 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800'
      }`}
      role="banner"
      aria-label="Cabeçalho principal da página"
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 xs:px-6 sm:px-8">
        {/* Main header row */}
        <div className="flex items-center justify-between py-4 xs:py-5 sm:py-6">
          {/* Logo */}
          <Link
            href="/"
            className="group relative focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 rounded-2xl transition-all duration-300"
            aria-label="Ir para página inicial - Aproxima Saúde Inclusiva"
          >
            <div className="relative transform transition-all duration-300 group-hover:scale-105 group-active:scale-95">
              {/* Logo glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary-400/20 via-white/10 to-accent-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src={logo}
                alt="Logo Aproxima - Saúde Inclusiva"
                width={320}
                height={80}
                priority
                className="relative w-40 xs:w-52 sm:w-64 md:w-72 lg:w-80 h-auto drop-shadow-lg transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-2xl"
              />
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            ref={mobileMenuButtonRef}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className={`lg:hidden relative w-12 h-12 xs:w-14 xs:h-14 rounded-2xl border-2 cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 flex items-center justify-center overflow-hidden group ${
              isMobileMenuOpen
                ? 'bg-white text-primary-600 border-white shadow-xl shadow-white/20'
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50 hover:shadow-lg hover:shadow-white/10'
            }`}
          >
            {/* Ripple effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-secondary-400/30 to-accent-400/30 scale-0 group-active:scale-150 transition-transform duration-300 rounded-2xl" />

            {/* Hamburger / Close icon */}
            <span className="relative flex flex-col items-center justify-center w-6 h-6">
              <span className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1.5'
              }`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-200 ${
                isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`} />
              <span className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1.5'
              }`} />
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav
          id="main-navigation"
          className="relative hidden lg:block pb-5"
          role="navigation"
          aria-label="Menu de navegação principal"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/50 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-50/50 via-white to-accent-50/50" />

            <ul className="relative flex justify-center items-center gap-1 xl:gap-2 p-3" role="menubar">
              {navItems.map((item, index) => (
                <li key={item.href} role="none">
                  <Link
                    href={item.href}
                    className="group relative flex items-center gap-2.5 text-primary-700 text-base xl:text-lg font-semibold px-4 xl:px-5 py-3 rounded-xl transition-all duration-300 hover:text-primary-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400/50"
                    role="menuitem"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Hover background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-100/80 via-secondary-100/50 to-accent-100/80 rounded-xl opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100" />

                    {/* Icon */}
                    <span className="relative text-xl transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true">
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span className="relative">
                      {item.label}
                      {/* Underline animation */}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 group-hover:w-full transition-all duration-300 rounded-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMobileMenuOpen
              ? 'max-h-[600px] opacity-100 pb-5'
              : 'max-h-0 opacity-0'
          }`}
        >
          <nav
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/50 overflow-hidden"
            role="navigation"
            aria-label="Menu de navegação móvel"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-50/50 via-white to-accent-50/50" />

            <ul className="relative divide-y divide-gray-100/50">
              {navItems.map((item, index) => (
                <li key={item.href} role="none">
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`group relative flex items-center gap-4 text-primary-700 px-5 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50/80 hover:via-secondary-50/50 hover:to-accent-50/80 focus:outline-none focus-visible:bg-primary-50 active:scale-[0.99] ${
                      isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    role="menuitem"
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${index * 75}ms` : '0ms'
                    }}
                  >
                    {/* Icon container */}
                    <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                      {item.icon}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base xs:text-lg text-primary-700 group-hover:text-primary-800 transition-colors duration-300">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-500 group-hover:text-primary-600 transition-colors duration-300 truncate">
                        {item.description}
                      </div>
                    </div>

                    {/* Arrow */}
                    <span className="flex-shrink-0 text-primary-400 group-hover:text-primary-600 transform transition-all duration-300 group-hover:translate-x-1" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
