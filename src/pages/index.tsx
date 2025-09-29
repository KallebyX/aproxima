'use client';

import Head from 'next/head';
import Link from 'next/link';
import Header from './Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import VLibras to prevent SSR issues
const VLibras = dynamic(() => import('../components/VLibras'), { 
  ssr: false 
});

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  ariaLabel: string;
  delay?: number;
}

function NavigationCard({ title, description, href, icon, ariaLabel, delay = 0 }: NavigationCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Link
      href={href}
      className={`group block w-full max-w-md mx-auto transform transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } hover:scale-105 focus:scale-105 active:scale-95`}
      aria-label={ariaLabel}
    >
      <div className="bg-gradient-to-br from-secondary-300 to-secondary-400 dark:from-secondary-600 dark:to-secondary-700 rounded-xl xs:rounded-2xl p-4 xs:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-secondary-500 group-focus:border-secondary-500 group-focus:ring-4 group-focus:ring-secondary-300/50 h-full min-h-[280px] xs:min-h-[320px] flex flex-col">
        <div className="flex flex-col items-center text-center space-y-3 xs:space-y-4 h-full justify-between">
          <div className="text-4xl xs:text-5xl md:text-6xl mb-1 xs:mb-2 flex-shrink-0" role="img" aria-label={`Ícone: ${icon}`}>
            {icon}
          </div>
          <h2 className="text-lg xs:text-xl md:text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors flex-shrink-0">
            {title}
          </h2>
          <p className="text-primary-500 dark:text-primary-200 text-sm xs:text-base md:text-lg leading-relaxed flex-grow flex items-center justify-center text-center">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const navigationCards = [
    {
      title: "Área da Gestante",
      description: "Caderneta digital acessível com recursos exclusivos para gestantes e acompanhamento completo da gravidez",
      href: "/gestante",
      icon: "🤱",
      ariaLabel: "Acessar seção destinada às gestantes com recursos de acessibilidade",
      delay: 200
    },
    {
      title: "Área do Profissional",
      description: "Ferramentas especializadas para profissionais de saúde com recursos de acessibilidade e inclusão",
      href: "/area-do-profissional", 
      icon: "👩‍⚕️",
      ariaLabel: "Acessar seção para profissionais de saúde com recursos especializados",
      delay: 400
    },
    {
      title: "Produtos Acessíveis",
      description: "Catálogo de produtos de saúde desenvolvidos com foco em acessibilidade e inclusão",
      href: "/produtos-acessiveis",
      icon: "🧸", 
      ariaLabel: "Explorar produtos de saúde com recursos de acessibilidade",
      delay: 600
    },
    {
      title: "Quem Somos",
      description: "Conheça nossa equipe e a missão de promover saúde inclusiva para todas as pessoas",
      href: "/quem-somos",
      icon: "👥",
      ariaLabel: "Conhecer a equipe e missão do projeto de saúde inclusiva",
      delay: 800
    }
  ];

  return (
    <>
      <Head>
        <title>Aproxima - Saúde Inclusiva e Acessível | Plataforma para Gestantes e Profissionais</title>
        <meta name="description" content="Plataforma de saúde inclusiva com conformidade WCAG 2.1 AAA. Cuidado humanizado para gestantes e profissionais de saúde com recursos de acessibilidade completos, incluindo Libras e tecnologias assistivas." />
        <meta name="keywords" content="saúde inclusiva, gestantes, acessibilidade WCAG, libras, profissionais saúde, cuidado humanizado, telemedicina acessível, saúde materna, inclusão digital, tecnologias assistivas, VLibras, alto contraste, leitores de tela" />
        <meta name="author" content="Aproxima - Saúde Inclusiva" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Aproxima - Saúde Inclusiva e Acessível" />
        <meta property="og:description" content="Plataforma líder em saúde inclusiva com conformidade WCAG 2.1 AAA. Cuidado humanizado para gestantes e profissionais com tecnologias assistivas completas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aproxima.com.br/" />
        <meta property="og:site_name" content="Aproxima - Saúde Inclusiva" />
        <meta property="og:image" content="https://aproxima.com.br/favicon.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Aproxima - Plataforma de Saúde Inclusiva" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aproxima - Saúde Inclusiva e Acessível" />
        <meta name="twitter:description" content="Plataforma líder em saúde inclusiva com conformidade WCAG 2.1 AAA para gestantes e profissionais de saúde." />
        <meta name="twitter:image" content="https://aproxima.com.br/favicon.png" />
        <meta name="twitter:image:alt" content="Aproxima - Saúde Inclusiva" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="application-name" content="Aproxima" />
        <meta name="apple-mobile-web-app-title" content="Aproxima" />
        <meta name="msapplication-TileColor" content="#2A1B5D" />
        <meta name="theme-color" content="#2A1B5D" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://aproxima.com.br/" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Aproxima - Saúde Inclusiva",
              "description": "Plataforma de saúde inclusiva com conformidade WCAG 2.1 AAA para gestantes e profissionais de saúde",
              "url": "https://aproxima.com.br",
              "inLanguage": "pt-BR",
              "publisher": {
                "@type": "Organization",
                "name": "Aproxima",
                "url": "https://aproxima.com.br"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://aproxima.com.br/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "HealthAndBeautyBusiness",
                "name": "Aproxima - Saúde Inclusiva",
                "description": "Plataforma de saúde inclusiva especializada em cuidado para gestantes e profissionais de saúde",
                "url": "https://aproxima.com.br",
                "serviceType": "Saúde Inclusiva e Acessível",
                "areaServed": "Brasil",
                "availableLanguage": ["pt-BR", "Libras"]
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex flex-col">
        <Header />
        
        <main 
          id="main-content" 
          className="flex-grow"
          role="main"
          tabIndex={-1}
        >
          {/* Hero Section */}
          <section 
            id="hero-section"
            className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-center"
            aria-labelledby="hero-heading"
          >
            <div className="max-w-7xl mx-auto">
              <div className="space-y-6 sm:space-y-8">
                <h1 
                  id="hero-heading"
                  className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
                >
                  <span className="block text-primary-600">Caderneta da Gestante</span>
                  <span className="block text-secondary-500 mt-1 sm:mt-2">100% Acessível</span>
                </h1>
                
                <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-gray-700 leading-relaxed mb-6 sm:mb-8 max-w-4xl mx-auto px-2 sm:px-0">
                  A primeira plataforma digital de saúde materna totalmente inclusiva do Brasil
                </p>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-12 max-w-5xl mx-auto px-2 sm:px-0">
                  Desenvolvida para conectar gestantes e profissionais de saúde através de tecnologia acessível, 
                  oferecendo recursos completos de acompanhamento pré-natal com foco na inclusão de pessoas 
                  com deficiência visual, auditiva e motora.
                </p>
              </div>
            </div>
          </section>

          {/* Navigation Cards */}
          <section 
            id="navigation-section"
            className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
            aria-labelledby="navigation-heading"
          >
            <div className="max-w-7xl mx-auto">
              <h2 
                id="navigation-heading" 
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-primary-600 px-2 sm:px-0"
              >
                Escolha sua área de interesse
              </h2>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {navigationCards.map((card, index) => (
                  <NavigationCard
                    key={index}
                    {...card}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section 
            id="features-section"
            className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50"
            aria-labelledby="features-heading"
            role="region"
          >
            <div className="max-w-7xl mx-auto">
              <h2 
                id="features-heading"
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-primary-600 dark:text-primary-400 px-2 sm:px-0"
              >
                Recursos de Acessibilidade
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" role="list">
                <article className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full min-h-[220px] flex flex-col" role="listitem">
                  <div className="text-4xl mb-4 flex-shrink-0" role="img" aria-label="Ícone de leitor de tela">🔊</div>
                  <h3 className="text-lg md:text-xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex-shrink-0">Compatível com Leitores de Tela</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow text-sm md:text-base leading-relaxed">Totalmente otimizado para NVDA, JAWS e VoiceOver com navegação por teclas de atalho.</p>
                </article>
                
                <article className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full min-h-[220px] flex flex-col" role="listitem">
                  <div className="text-4xl mb-4 flex-shrink-0" role="img" aria-label="Ícone de alto contraste">🌗</div>
                  <h3 className="text-lg md:text-xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex-shrink-0">Alto Contraste</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow text-sm md:text-base leading-relaxed">Temas com contraste otimizado seguindo diretrizes WCAG 2.1 AAA para máxima legibilidade.</p>
                </article>
                
                <article className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full min-h-[220px] flex flex-col md:col-span-2 lg:col-span-1" role="listitem">
                  <div className="text-4xl mb-4 flex-shrink-0" role="img" aria-label="Ícone de Libras">🤟</div>
                  <h3 className="text-lg md:text-xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex-shrink-0">Tradução em Libras</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow text-sm md:text-base leading-relaxed">Interface com tradução automática para Língua Brasileira de Sinais através do VLibras.</p>
                </article>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section 
            id="contact-section"
            className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
            aria-labelledby="contact-heading"
            role="region"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 
                id="contact-heading"
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-primary-600 dark:text-primary-400 px-2 sm:px-0"
              >
                Entre em Contato
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-2 sm:px-0 leading-relaxed">
                Tem dúvidas sobre nossos recursos de acessibilidade? Nossa equipe está pronta para ajudar!
              </p>
              
              <Link 
                href="/contato"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-primary-700 focus:outline-2 focus:outline-primary-600 focus:outline-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                aria-label="Ir para página de contato"
              >
                Fale Conosco
                <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        </main>

        {/* Enhanced VLibras */}
        <VLibras 
          position="bottom-right"
          avatar="icaro" 
          opacity={0.95}
        />
        
        {/* Live region for screen reader announcements */}
        <div 
          id="live-region"
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        />
        
        <Footer />
      </div>
    </>
  );
}