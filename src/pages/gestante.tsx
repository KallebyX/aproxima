'use client';

import Head from 'next/head';
import Header from './Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import VLibras to prevent SSR issues
const VLibras = dynamic(() => import('../components/VLibras'), {
  ssr: false
});

interface DownloadCardProps {
  title: string;
  description: string;
  href: string;
  fileSize: string;
  fileType: string;
  icon: string;
  delay?: number;
  gradient: string;
}

function DownloadCard({ title, description, href, fileSize, fileType, icon, delay = 0, gradient }: DownloadCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleDownload = async () => {
    setIsDownloading(true);

    // Announce download start to screen readers
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = `Iniciando download de ${title}`;
    }

    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Announce download completion
      if (liveRegion) {
        liveRegion.textContent = `Download de ${title} concluído com sucesso`;
      }
    } catch (error) {
      if (liveRegion) {
        liveRegion.textContent = `Erro no download de ${title}. Tente novamente.`;
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`transform transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
    }`}>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />

        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Icon */}
            <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
              <span className="text-3xl sm:text-4xl" aria-hidden="true">{icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-primary-600 mb-3 group-hover:text-primary-700 transition-colors">
                {title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                {description}
              </p>

              {/* File info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {fileType}
                </span>
                <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  {fileSize}
                </span>
              </div>

              {/* Download button */}
              <a
                href={href}
                onClick={handleDownload}
                className={`group/btn inline-flex items-center gap-3 bg-gradient-to-r ${gradient} text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/50 active:scale-95 ${
                  isDownloading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                }`}
                aria-label={`Baixar arquivo ${title} em formato ${fileType}`}
              >
                {isDownloading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Baixando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover/btn:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Baixar Arquivo</span>
                  </>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      icon: '📊',
      delay: 200,
      gradient: 'from-pink-500 via-rose-500 to-red-400'
    },
    {
      title: 'Olha quem chegou!',
      description: 'Material especial para celebrar a chegada do bebê, com recursos de acessibilidade completos. Conteúdo otimizado para leitores de tela e navegação por teclado.',
      href: 'https://drive.google.com/uc?export=download&id=1UqthxEXcB6u67oM9afs3_vDybHFtE3qB',
      fileSize: '1.8 MB',
      fileType: 'PDF Acessível',
      icon: '👶',
      delay: 400,
      gradient: 'from-blue-500 via-indigo-500 to-violet-500'
    }
  ];

  const accessibilityFeatures = [
    { icon: "👁️", text: "Leitores de Tela" },
    { icon: "⌨️", text: "Navegação Teclado" },
    { icon: "🎨", text: "Alto Contraste" },
    { icon: "🔍", text: "Zoom 500%" }
  ];

  return (
    <>
      <Head>
        <title>Área da Gestante | Aproxima - Caderneta Acessível</title>
        <meta name="description" content="Área exclusiva para gestantes com caderneta digital acessível, materiais informativos e recursos completos para acompanhamento da gravidez. Desenvolvido seguindo padrões WCAG 2.1 AAA para pessoas com deficiência visual." />
        <meta name="keywords" content="gestante acessível, caderneta digital, pré-natal inclusivo, deficiência visual, WCAG 2.1 AAA, materiais gestante, gravidez acessível, saúde materna inclusiva" />
        <meta name="author" content="Kalleby Evangelho Mota" />

        {/* Open Graph */}
        <meta property="og:title" content="Área da Gestante - Aproxima Caderneta Acessível" />
        <meta property="og:description" content="Recursos exclusivos para gestantes com total acessibilidade e suporte a tecnologias assistivas" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Área da Gestante - Aproxima" />
        <meta name="twitter:description" content="Caderneta digital 100% acessível para gestantes" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Área da Gestante - Aproxima",
              "description": "Recursos digitais acessíveis para gestantes com deficiência visual",
              "url": "https://aproxima-six.vercel.app/gestante",
              "isPartOf": {
                "@type": "WebSite",
                "name": "Aproxima - Saúde Inclusiva",
                "url": "https://aproxima-six.vercel.app"
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        <Header />

        <main
          role="main"
          id="main-content"
          className="flex-grow py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
          aria-label="Conteúdo da área da gestante"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16 lg:mb-20" aria-labelledby="gestante-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700 px-6 py-3 rounded-full font-semibold mb-8 shadow-lg border border-rose-200">
                  <span className="text-2xl" role="img" aria-label="Gestante">🤱</span>
                  <span>Área Exclusiva</span>
                </div>

                {/* Title */}
                <h1
                  id="gestante-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                >
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Área da{' '}
                  </span>
                  <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
                    Gestante
                  </span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  Recursos digitais <strong className="text-primary-600">100% acessíveis</strong> desenvolvidos especialmente para gestantes,
                  com suporte completo a <strong className="text-primary-600">tecnologias assistivas</strong> e conformidade total com{' '}
                  <abbr title="Web Content Accessibility Guidelines 2.1 nível AAA" className="border-b border-dotted border-gray-400 no-underline">
                    WCAG 2.1 AAA
                  </abbr>.
                </p>

                {/* Accessibility Features */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4" role="list" aria-label="Recursos de acessibilidade">
                  {accessibilityFeatures.map((feature, index) => (
                    <div
                      key={index}
                      role="listitem"
                      className="bg-white rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-md border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <span className="text-lg sm:text-xl" role="img">{feature.icon}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Downloads Section */}
            <section aria-labelledby="downloads-heading" className="mb-16 lg:mb-20">
              <div className={`text-center mb-10 sm:mb-12 transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h2
                  id="downloads-heading"
                  className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4"
                >
                  Materiais Disponíveis
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Baixe nossos materiais informativos desenvolvidos com <strong>total acessibilidade</strong>.
                  Todos os arquivos são <strong>compatíveis com leitores de tela</strong>.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8" role="list" aria-label="Lista de materiais para download">
                {downloadItems.map((item, index) => (
                  <div key={index} role="listitem">
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
                    className="group inline-flex items-center justify-center gap-3 bg-white text-primary-700 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
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
                    className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
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
