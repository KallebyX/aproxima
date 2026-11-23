'use client';

import { Baby, ChartColumn, Eye, Keyboard, Palette, Search } from 'lucide-react';

import Head from 'next/head';
import Header from './Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DownloadCard from '../components/ResourceDownloadCard';

// Dynamically import VLibras to prevent SSR issues
const VLibras = dynamic(() => import('../components/VLibras'), {
  ssr: false
});

export default function GestantePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const downloadItems = [
    {
      title: 'Caderneta Informativa',
      description: 'Documento completo com informações essenciais sobre gestação, desenvolvido especialmente para pessoas com deficiência visual. Inclui orientações sobre pré-natal, exames e cuidados durante a gravidez.',
      href: 'https://drive.google.com/uc?export=download&id=1sQVoncR0Cmok-T76zlN_gfbzWVr_6Wlo',
      fileSize: '2.1 MB',
      fileType: 'PDF Acessível',
      icon: <ChartColumn className="h-7 w-7" aria-hidden="true" />,
      delay: 200,
      gradient: 'from-pink-500 via-rose-500 to-red-400'
    },
    {
      title: 'Olha quem chegou!',
      description: 'Material especial para celebrar a chegada do bebê, com recursos de acessibilidade disponíveis. Conteúdo otimizado para leitores de tela e navegação por teclado.',
      href: 'https://drive.google.com/uc?export=download&id=1UqthxEXcB6u67oM9afs3_vDybHFtE3qB',
      fileSize: '1.8 MB',
      fileType: 'PDF Acessível',
      icon: <Baby className="h-7 w-7" aria-hidden="true" />,
      delay: 400,
      gradient: 'from-blue-500 via-indigo-500 to-violet-500'
    }
  ];

  const accessibilityFeatures = [
    { icon: <Eye className="h-7 w-7" aria-hidden="true" />, text: "Leitores de Tela" },
    { icon: <Keyboard className="h-7 w-7" aria-hidden="true" />, text: "Navegação Teclado" },
    { icon: <Palette className="h-7 w-7" aria-hidden="true" />, text: "Alto Contraste" },
    { icon: <Search className="h-7 w-7" aria-hidden="true" />, text: "Zoom 500%" }
  ];

  return (
    <>
      <Head>
        <title>Área da Gestante | Aproxima - Caderneta Acessível</title>
        <meta name="description" content="Área exclusiva para gestantes com caderneta digital acessível, materiais informativos e recursos completos para acompanhamento da gravidez. Desenvolvido seguindo padrões diretrizes de acessibilidade para pessoas com deficiência visual." />
        <meta name="keywords" content="gestante acessível, caderneta digital, pré-natal inclusivo, deficiência visual, diretrizes de acessibilidade, materiais gestante, gravidez acessível, saúde materna inclusiva" />
        <meta name="author" content="Kalleby Evangelho Mota" />

        {/* Open Graph */}
        <meta property="og:title" content="Área da Gestante - Aproxima Caderneta Acessível" />
        <meta property="og:description" content="Recursos exclusivos para gestantes com foco na acessibilidade e suporte a tecnologias assistivas" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Área da Gestante - Aproxima" />
        <meta name="twitter:description" content="Caderneta digital com recursos de acessibilidade para gestantes" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Área da Gestante - Aproxima",
              "description": "Recursos digitais acessíveis para gestantes com deficiência visual",
              "url": "https://aproxima.app.ufn.edu.br/gestante",
              "isPartOf": {
                "@type": "WebSite",
                "name": "Aproxima - Saúde Inclusiva",
                "url": "https://aproxima.app.ufn.edu.br"
              },
              "accessibilityFeature": [
                "screenReaderSupport",
                "keyboardNavigation",
                "highContrastDisplay",
                "alternativeText",
                "focusManagement"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Gestantes"
              },
              "about": {
                "@type": "Thing",
                "name": "Saúde Materna Acessível"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main
          role="main"
          id="main-content"
          className="flex-grow py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8"
          aria-label="Conteúdo da área da gestante"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-10 lg:mb-14" aria-labelledby="gestante-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700 px-6 py-3 rounded-full font-semibold mb-8 shadow-sm border border-rose-200">
                  <span className="text-2xl" aria-hidden="true"><Baby className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /></span>
                  <span>Área Exclusiva</span>
                </div>

                {/* Title */}
                <h1
                  id="gestante-heading"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                >
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Área da{' '}
                  </span>
                  <span className="text-rose-700">
                    Gestante
                  </span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  Materiais digitais <strong className="text-primary-600">com foco na acessibilidade</strong> desenvolvidos especialmente para gestantes,
                  com suporte a <strong className="text-primary-600">tecnologias assistivas</strong> e atenção às{' '}
                  boas práticas de acessibilidade.
                </p>

                {/* Accessibility Features */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4" role="list" aria-label="Recursos de acessibilidade">
                  {accessibilityFeatures.map((feature, index) => (
                    <div
                      key={index}
                      role="listitem"
                      className="bg-white rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-md border border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <span className="text-lg sm:text-xl" aria-hidden="true">{feature.icon}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Downloads Section */}
            <section aria-labelledby="downloads-heading" className="mb-10 lg:mb-14">
              <div className={`text-center mb-10 sm:mb-12 transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h2
                  id="downloads-heading"
                  className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4"
                >
                  Materiais Disponíveis
                </h2>
                <p className="text-lg sm:text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Baixe nossos materiais informativos desenvolvidos com <strong>foco na acessibilidade</strong>.
                  Todos os arquivos são <strong>compatíveis com leitores de tela</strong>.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2" role="list" aria-label="Lista de materiais para download">
                {downloadItems.map((item, index) => (
                  <div key={index} role="listitem" className="min-w-0">
                    <DownloadCard {...item} />
                  </div>
                ))}
              </div>
            </section>

            {/* Support Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-center" aria-labelledby="support-heading">
              {/* Decorative elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl" />

              <div className="relative">
                <h2
                  id="support-heading"
                  className="text-3xl sm:text-4xl font-bold text-white mb-6"
                >
                  Precisa de Ajuda?
                </h2>
                <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Nossa plataforma foi desenvolvida para ser <strong>totalmente acessível</strong>.
                  Se encontrar alguma dificuldade, entre em contato conosco.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                  <a
                    href="/contato"
                    className="group inline-flex items-center justify-center gap-3 bg-white text-primary-700 font-semibold px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-md active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                    aria-label="Ir para página de contato"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Entre em Contato
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a
                    href="/quem-somos"
                    className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-semibold px-6 py-3 rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:shadow-md active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                    aria-label="Conhecer mais sobre o projeto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sobre o Projeto
                  </a>
                </div>
              </div>
            </section>
          </div>
        </main>

        <VLibras position="bottom-right" avatar="icaro" opacity={0.95} />

        {/* Live region for announcements */}
        <div
          id="live-region"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        ></div>

        <Footer />
      </div>
    </>
  );
}
