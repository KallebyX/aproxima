'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowUpRight, Baby, BookOpen, HeartHandshake, Menu, MessageCircle, Stethoscope, X } from 'lucide-react';
import logo from './logo.png';

const navItems = [
  { href: '/gestante', label: 'Área da Gestante', shortLabel: 'Gestantes', description: 'Cadernetas e orientações para o cuidado', icon: Baby },
  { href: '/area-do-profissional', label: 'Área do Profissional', shortLabel: 'Profissionais', description: 'Materiais para apoiar sua prática', icon: Stethoscope },
  { href: '/produtos-acessiveis', label: 'Produtos Acessíveis', shortLabel: 'Materiais', description: 'Conheça os recursos disponíveis', icon: BookOpen },
  { href: '/quem-somos', label: 'Quem Somos', shortLabel: 'Sobre o projeto', description: 'Nossa equipe e o que nos move', icon: HeartHandshake },
  { href: '/contato', label: 'Contato', shortLabel: 'Contato', description: 'Converse com a equipe', icon: MessageCircle },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useRouter();

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
    mobileMenuButtonRef.current?.focus();
  }

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isMobileMenuOpen) closeMobileMenu();
    }
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [isMobileMenuOpen]);

  return (
    <header className="aproxima-header sticky top-0 z-50" aria-label="Cabeçalho principal">
      <div className="aproxima-container">
        <div className="flex min-h-[88px] items-center justify-between gap-6">
          <Link href="/" aria-label="Ir para página inicial - Aproxima Saúde Inclusiva" className="shrink-0 rounded-lg">
            <Image src={logo} alt="Aproxima — Saúde Inclusiva" width={320} height={80} priority className="h-auto w-40 sm:w-48" />
          </Link>
          <nav id="main-navigation" aria-label="Menu de navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map(item => <li key={item.href}><Link href={item.href} aria-label={item.label} aria-current={pathname === item.href ? 'page' : undefined} className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors ${pathname === item.href ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>{item.shortLabel}</Link></li>)}
            </ul>
          </nav>
          <button ref={mobileMenuButtonRef} onClick={() => setIsMobileMenuOpen(open => !open)} aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu" aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/30 px-3 py-2.5 text-sm font-medium text-white lg:hidden">
            {isMobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}<span>{isMobileMenuOpen ? 'Fechar' : 'Menu'}</span>
          </button>
        </div>
        <nav id="mobile-menu" aria-label="Menu de navegação móvel" hidden={!isMobileMenuOpen} className="max-h-[70dvh] overflow-y-auto pb-4 lg:hidden">
          <div className="rounded-2xl bg-white p-2 text-slate-800">
            <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Explore o Aproxima</p>
            <ul>{navItems.map(item => <li key={item.href}><Link href={item.href} onClick={closeMobileMenu} aria-current={pathname === item.href ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3.5 ${pathname === item.href ? 'bg-[#f1ecf7]' : 'hover:bg-slate-50'}`}>
              <span className="aproxima-icon !h-10 !w-10"><item.icon size={20} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.label}</span><span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{item.description}</span></span><ArrowUpRight size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
            </Link></li>)}</ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
