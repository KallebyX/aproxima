'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, HeartHandshake, Mail } from 'lucide-react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  useEffect(() => setCurrentYear(new Date().getFullYear()), []);
  const links = [
    { href: '/gestante', label: 'Área da Gestante' },
    { href: '/area-do-profissional', label: 'Área do Profissional' },
    { href: '/produtos-acessiveis', label: 'Produtos Acessíveis' },
    { href: '/quem-somos', label: 'Quem Somos' },
  ];
  return <footer className="aproxima-footer" aria-label="Rodapé da página">
    <div className="aproxima-container">
      <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-16 lg:py-12">
        <div><p className="text-2xl font-semibold tracking-tight text-white">Aproxima<span className="text-[#d5b9ec]">.</span></p><p className="mt-2 text-sm font-medium text-[#dfc9ef]">Saúde inclusiva, cuidado compartilhado.</p><p className="mt-4 max-w-sm text-sm leading-7 text-white/70">Informação e materiais para aproximar gestantes, famílias e profissionais de saúde.</p><div className="mt-5 inline-flex items-center gap-2 text-sm text-white/80"><HeartHandshake size={18} aria-hidden="true" /><span>Um projeto da Universidade Franciscana</span></div></div>
        <nav aria-label="Navegação do rodapé"><h2 className="mb-4 text-sm font-semibold text-white">Encontre seu caminho</h2><ul className="space-y-3">{links.map(link => <li key={link.href}><Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">{link.label}</Link></li>)}</ul></nav>
        <div><h2 className="mb-4 text-sm font-semibold text-white">Conte com a equipe</h2><Link href="/contato" className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/85 hover:text-white">Entre em contato<ArrowUpRight size={16} aria-hidden="true" /></Link><a href="mailto:rejanecassol@hotmail.com" className="flex items-start gap-2 text-sm leading-6 text-white/70 hover:text-white"><Mail size={16} className="mt-1 shrink-0" aria-hidden="true" /><span className="break-all">rejanecassol@hotmail.com</span></a><Link href="/central-privacidade" className="mt-5 inline-flex text-sm text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white">Central de Privacidade</Link></div>
      </div>
      <div className="border-t border-white/15 py-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="max-w-xl text-xs leading-6 text-white/70"><p>© {currentYear} Aproxima — Saúde Inclusiva.</p><p>Feito com <span role="img" aria-label="amor">❤️</span> pela <a href="https://www.oryumtech.com.br/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">Oryum Tech</a> para a <a href="https://site.ufn.edu.br/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">Universidade Franciscana</a>.</p></div><nav aria-label="Informações legais"><ul className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-white/70"><li><Link href="/politica-privacidade" className="hover:text-white">Privacidade</Link></li><li><Link href="/termos-de-uso" className="hover:text-white">Termos de uso</Link></li><li><Link href="/declaracao-acessibilidade" className="hover:text-white">Acessibilidade</Link></li></ul></nav></div></div>
    </div>
  </footer>;
}
