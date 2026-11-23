'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Baby, BookOpen, HeartHandshake, MessageCircle, Stethoscope, X } from 'lucide-react';

interface MobileMenuProps { isOpen: boolean; onClose: () => void }
const links = [
  { label: 'Área da Gestante', href: '/gestante', icon: Baby },
  { label: 'Área do Profissional', href: '/area-do-profissional', icon: Stethoscope },
  { label: 'Produtos Acessíveis', href: '/produtos-acessiveis', icon: BookOpen },
  { label: 'Quem Somos', href: '/quem-somos', icon: HeartHandshake },
  { label: 'Contato', href: '/contato', icon: MessageCircle },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[10001] bg-slate-950/40"><button type="button" aria-label="Fechar menu" tabIndex={-1} onClick={onClose} className="absolute inset-0 h-full w-full" /><section role="dialog" aria-modal="true" aria-labelledby="mobile-menu-heading" className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white p-5 shadow-xl">
    <div className="mb-6 flex items-center justify-between"><h2 id="mobile-menu-heading" className="text-lg font-semibold text-slate-900">Explore o Aproxima</h2><button ref={closeRef} onClick={onClose} aria-label="Fechar menu" className="rounded-lg p-3 text-slate-600 hover:bg-slate-100"><X size={22} aria-hidden="true" /></button></div>
    <nav aria-label="Navegação móvel" className="overflow-y-auto"><ul className="space-y-1">{links.map(item => <li key={item.href}><Link href={item.href} onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-4 text-sm font-medium text-slate-800 hover:bg-[#f1ecf7]"><item.icon size={20} className="text-[#65428f]" aria-hidden="true" />{item.label}</Link></li>)}</ul></nav>
  </section></div>;
}
