'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/gestante', label: 'Área da Gestante' },
    { href: '/area-do-profissional', label: 'Área do Profissional' },
    { href: '/produtos-acessiveis', label: 'Produtos Acessíveis' },
    { href: '/quem-somos', label: 'Quem Somos' },
    { href: '/contato', label: 'Contato' },
  ];

  const legalLinks = [
    { href: '/politica-privacidade', label: 'Política de Privacidade' },
    { href: '/termos-de-uso', label: 'Termos de Uso' },
    { href: '/declaracao-acessibilidade', label: 'Acessibilidade' },
  ];

  return (
    <footer
      className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden"
      role="contentinfo"
      aria-label="Rodapé da página"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-secondary-200 bg-clip-text text-transparent">
                  Aproxima
                </h2>
                <p className="text-secondary-300 font-medium mt-1">Saúde Inclusiva</p>
              </div>
              <p className="text-white/80 leading-relaxed mb-6 max-w-md">
                A primeira plataforma digital de saúde materna totalmente inclusiva do Brasil,
                desenvolvida com conformidade WCAG 2.1 AAA para garantir acesso universal.
              </p>

              {/* Accessibility badges */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  <span role="img" aria-label="Acessibilidade">♿</span>
                  WCAG 2.1 AAA
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  <span role="img" aria-label="Libras">🤟</span>
                  VLibras
                </span>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-white">
                Navegação
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                    >
                      <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full group-hover:scale-125 transition-transform duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & contact */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-white">
                Legal
              </h3>
              <ul className="space-y-3 mb-8">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                    >
                      <span className="w-1.5 h-1.5 bg-accent-400 rounded-full group-hover:scale-125 transition-transform duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-3 text-white">
                Contato
              </h3>
              <a
                href="mailto:rejanecassol@hotmail.com"
                className="text-secondary-300 hover:text-secondary-200 transition-colors duration-300 text-sm break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                aria-label="Enviar e-mail para rejanecassol@hotmail.com"
              >
                rejanecassol@hotmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Bottom bar */}
        <div className="py-6 lg:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Credits */}
            <div className="text-center md:text-left">
              <p className="text-white/90 leading-relaxed">
                Desenvolvido com{' '}
                <span
                  className="text-red-400 text-lg mx-1"
                  role="img"
                  aria-label="amor"
                  title="amor"
                >
                  ❤️
                </span>{' '}
                para o{' '}
                <strong className="font-semibold text-white">
                  Programa de Pós-Graduação em Saúde Materna Infantil
                </strong>
              </p>
              <p className="text-white/70 mt-2">
                da{' '}
                <a
                  href="https://site.ufn.edu.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-300 hover:text-secondary-200 underline underline-offset-2 font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  aria-label="Universidade Franciscana - UFN (abre em nova aba)"
                >
                  UFN
                </a>
                {' '}pela{' '}
                <a
                  href="https://www.oryumtech.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-300 hover:text-secondary-200 underline underline-offset-2 font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  aria-label="Oryum Tech (abre em nova aba)"
                >
                  Oryum Tech
                </a>
              </p>
            </div>

            {/* Copyright & WCAG */}
            <div className="text-center md:text-right">
              <p className="text-white/70 text-sm">
                &copy; {currentYear} Aproxima - Saúde Inclusiva
              </p>
              <p className="text-white/60 text-sm mt-1">
                Este projeto segue as diretrizes{' '}
                <a
                  href="https://www.w3c.br/traducoes/wcag/wcag21-pt-BR/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-300 hover:text-secondary-200 underline underline-offset-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  aria-label="WCAG 2.1 AAA (abre em nova aba)"
                >
                  WCAG 2.1 AAA
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
