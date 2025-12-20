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
  gradient: string;
}

function NavigationCard({ title, description, href, icon, ariaLabel, delay = 0, gradient }: NavigationCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Link
      href={href}
      className={`group block w-full transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-2xl xs:rounded-3xl transition-all duration-500 h-full min-h-[300px] xs:min-h-[320px] sm:min-h-[340px] ${
        isHovered ? 'shadow-2xl shadow-primary-500/20 scale-[1.02]' : 'shadow-xl'
      }`}>
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-500`} />

        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

        {/* Content */}
        <div className="relative h-full p-6 xs:p-7 sm:p-8 flex flex-col">
          {/* Icon */}
          <div className={`w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 shadow-lg transform transition-all duration-500 ${
            isHovered ? 'scale-110 rotate-3 bg-white/30' : ''
          }`}>
            <span className="text-4xl xs:text-5xl" role="img" aria-label={`Ícone: ${icon}`}>
              {icon}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold text-white mb-3 drop-shadow-md">
            {title}
          </h2>

          {/* Description */}
          <p className="text-white/90 text-sm xs:text-base leading-relaxed flex-grow mb-4">
            {description}
          </p>

          {/* CTA */}
          <div className={`flex items-center gap-2 text-white font-semibold transform transition-all duration-500 ${
            isHovered ? 'translate-x-2' : ''
          }`}>
            <span className="text-sm xs:text-base">Acessar</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Focus indicator */}
        <div className="absolute inset-0 rounded-2xl xs:rounded-3xl ring-4 ring-white/50 opacity-0 group-focus-visible:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <article
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 border border-gray-100 overflow-hidden transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      role="listitem"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
          <span className="text-3xl sm:text-4xl" role="img" aria-label={`Ícone: ${icon}`}>
            {icon}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-primary-600 mb-3 group-hover:text-primary-700 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
      </div>
    </article>
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
      delay: 200,
      gradient: "from-pink-500 via-rose-500 to-red-400"
    },
    {
      title: "Área do Profissional",
      description: "Ferramentas especializadas para profissionais de saúde com recursos de acessibilidade e inclusão",
      href: "/area-do-profissional",
      icon: "👩‍⚕️",
      ariaLabel: "Acessar seção para profissionais de saúde com recursos especializados",
      delay: 350,
      gradient: "from-blue-500 via-indigo-500 to-violet-500"
    },
    {
      title: "Produtos Acessíveis",
      description: "Catálogo de produtos de saúde desenvolvidos com foco em acessibilidade e inclusão",
      href: "/produtos-acessiveis",
      icon: "🧸",
      ariaLabel: "Explorar produtos de saúde com recursos de acessibilidade",
      delay: 500,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    {
      title: "Quem Somos",
      description: "Conheça nossa equipe e a missão de promover saúde inclusiva para todas as pessoas",
      href: "/quem-somos",
      icon: "👥",
      ariaLabel: "Conhecer a equipe e missão do projeto de saúde inclusiva",
      delay: 650,
      gradient: "from-amber-500 via-orange-500 to-yellow-500"
    }
  ];

  const features = [
    {
      icon: "🔊",
      title: "Compatível com Leitores de Tela",
      description: "Totalmente otimizado para NVDA, JAWS e VoiceOver com navegação por teclas de atalho.",
      delay: 800
    },
    {
      icon: "🌗",
      title: "Alto Contraste",
      description: "Temas com contraste otimizado seguindo diretrizes WCAG 2.1 AAA para máxima legibilidade.",
      delay: 900
    },
    {
      icon: "🤟",
      title: "Tradução em Libras",
      description: "Interface com tradução automática para Língua Brasileira de Sinais através do VLibras.",
      delay: 1000
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
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
            className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
            aria-labelledby="hero-heading"
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto text-center">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary-600 px-5 py-2.5 rounded-full font-medium mb-8 shadow-lg border border-primary-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm sm:text-base">Plataforma 100% Acessível</span>
                </div>

                {/* Main heading */}
                <h1
                  id="hero-heading"
                  className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-[1.1]"
                >
                  <span className="block bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
                    Caderneta da Gestante
                  </span>
                  <span className="block bg-gradient-to-r from-secondary-500 via-pink-500 to-rose-500 bg-clip-text text-transparent mt-2">
                    100% Acessível
                  </span>
                </h1>

                {/* Subtitle */}
                <p className={`text-lg xs:text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed mb-6 max-w-4xl mx-auto transform transition-all duration-1000 delay-200 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  A primeira plataforma digital de saúde materna
                  <span className="text-primary-600 font-semibold"> totalmente inclusiva </span>
                  do Brasil
                </p>

                {/* Description */}
                <p className={`text-base sm:text-lg text-gray-500 leading-relaxed mb-10 max-w-3xl mx-auto transform transition-all duration-1000 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  Desenvolvida para conectar gestantes e profissionais de saúde através de tecnologia acessível,
                  oferecendo recursos completos de acompanhamento pré-natal com foco na inclusão.
                </p>

                {/* CTA buttons */}
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transform transition-all duration-1000 delay-400 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  <Link
                    href="/gestante"
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400/50"
                  >
                    <span>Começar Agora</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/quem-somos"
                    className="group inline-flex items-center gap-3 bg-white text-primary-600 text-lg font-semibold px-8 py-4 rounded-2xl border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400/50"
                  >
                    <span>Saiba Mais</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Cards */}
          <section
            id="navigation-section"
            className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
            aria-labelledby="navigation-heading"
          >
            <div className="max-w-7xl mx-auto">
              <div className={`text-center mb-12 sm:mb-16 transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h2
                  id="navigation-heading"
                  className="text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4"
                >
                  Escolha sua área
                </h2>
                <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
                  Acesse recursos especializados desenvolvidos para você
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
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
            className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
            aria-labelledby="features-heading"
          >
            <div className="max-w-7xl mx-auto">
              <div className={`text-center mb-12 sm:mb-16 transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>WCAG 2.1 AAA Compliant</span>
                </div>
                <h2
                  id="features-heading"
                  className="text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4"
                >
                  Recursos de Acessibilidade
                </h2>
                <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
                  Desenvolvidos para garantir acesso universal a todos os usuários
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" role="list">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact-section"
            className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
            aria-labelledby="contact-heading"
          >
            <div className="max-w-4xl mx-auto">
              <div className={`relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-center transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl" />

                <div className="relative">
                  <h2
                    id="contact-heading"
                    className="text-3xl xs:text-4xl sm:text-5xl font-bold text-white mb-6"
                  >
                    Entre em Contato
                  </h2>

                  <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Tem dúvidas sobre nossos recursos de acessibilidade? Nossa equipe está pronta para ajudar!
                  </p>

                  <Link
                    href="/contato"
                    className="group inline-flex items-center gap-3 bg-white text-primary-700 text-lg font-semibold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                    aria-label="Ir para página de contato"
                  >
                    <span>Fale Conosco</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
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
