'use client';

export default function Footer() {
  return (
    <footer 
      className="bg-primary-600 text-white py-8 px-4 mt-auto"
      role="contentinfo"
      aria-label="Rodapé da página"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-lg leading-relaxed">
            Desenvolvido com{' '}
            <span 
              className="text-red-400 text-xl mx-1" 
              role="img" 
              aria-label="amor"
              title="amor"
            >
              ❤️
            </span>{' '}
            para o{' '}
            <strong className="font-semibold">
              Programa de Pós-Graduação em Saúde Materna Infantil
            </strong>
            {' '}da{' '}
            <a 
              href="https://site.ufn.edu.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-200 hover:text-secondary-100 underline font-semibold transition-colors duration-200 focus:outline-2 focus:outline-white focus:outline-offset-2 rounded"
              aria-label="Universidade Franciscana - UFN (abre em nova aba)"
            >
              UFN
            </a>
            {' '}pela{' '}
            <a 
              href="https://www.oryumtech.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-200 hover:text-secondary-100 underline font-semibold transition-colors duration-200 focus:outline-2 focus:outline-white focus:outline-offset-2 rounded"
              aria-label="Oryum Tech (abre em nova aba)"
            >
              Oryum Tech
            </a>
          </p>
          
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-secondary-200">
              © {new Date().getFullYear()} Aproxima - Saúde Inclusiva. 
              Todos os direitos reservados.
            </p>
            <p className="text-sm text-secondary-200 mt-2">
              Este projeto segue as diretrizes de{' '}
              <a 
                href="https://www.w3c.br/traducoes/wcag/wcag21-pt-BR/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-200 hover:text-white underline transition-colors duration-200 focus:outline-2 focus:outline-white focus:outline-offset-2 rounded"
                aria-label="WCAG 2.1 AAA (abre em nova aba)"
              >
                acessibilidade WCAG 2.1 AAA
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}