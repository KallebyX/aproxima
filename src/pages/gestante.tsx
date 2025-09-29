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
}

function DownloadCard({ title, description, href, fileSize, fileType, icon, delay = 0 }: DownloadCardProps) {
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
    <div className={`transform transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 group">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
              {icon}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-primary-600 mb-3 group-hover:text-primary-700 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {fileType}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                {fileSize}
              </span>
            </div>
            
            <a
              href={href}
              onClick={handleDownload}
              className={`inline-flex items-center gap-3 bg-gradient-to-r from-secondary-400 to-secondary-500 text-primary-600 font-semibold px-8 py-4 rounded-xl hover:from-secondary-500 hover:to-secondary-600 transition-all duration-300 focus:ring-4 focus:ring-secondary-300/50 focus:outline-none active:scale-95 ${
                isDownloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={`Baixar arquivo ${title} em formato ${fileType}`}
              tabIndex={0}
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      delay: 200
    },
    {
      title: 'Olha quem chegou!',
      description: 'Material especial para celebrar a chegada do bebê, com recursos de acessibilidade completos. Conteúdo otimizado para leitores de tela e navegação por teclado.',
      href: 'https://drive.google.com/uc?export=download&id=1UqthxEXcB6u67oM9afs3_vDybHFtE3qB',
      fileSize: '1.8 MB',
      fileType: 'PDF Acessível',
      icon: '👶',
      delay: 400
    }
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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <main 
          role="main" 
          id="main-content"
          className="py-12 px-4 sm:px-6 lg:px-8"
          aria-label="Conteúdo da área da gestante"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16" aria-labelledby="gestante-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-secondary-400 to-secondary-500 text-primary-600 px-6 py-3 rounded-full font-semibold mb-6 shadow-lg">
                  <span className="text-2xl" role="img" aria-label="Gestante">🤱</span>
                  <span>Área Exclusiva</span>
                </div>
                
                <h1 
                  id="gestante-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-600 mb-6 leading-tight"
                >
                  Área da <span className="text-gradient bg-gradient-to-r from-secondary-500 to-secondary-600 bg-clip-text text-transparent">Gestante</span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  Recursos digitais <strong>100% acessíveis</strong> desenvolvidos especialmente para gestantes, 
                  com suporte completo a <strong>tecnologias assistivas</strong> e conformidade total com 
                  <abbr title="Web Content Accessibility Guidelines 2.1 nível AAA" className="border-b border-dotted border-gray-400 no-underline">
                    WCAG 2.1 AAA
                  </abbr>.
                </p>
                
                {/* Accessibility Features */}
                <div className="flex flex-wrap justify-center gap-4 mb-12" role="list" aria-label="Recursos de acessibilidade">
                  {[
                    { icon: "👁️", text: "Leitores de Tela" },
                    { icon: "⌨️", text: "Navegação Teclado" },
                    { icon: "🎨", text: "Alto Contraste" },
                    { icon: "🔍", text: "Zoom 500%" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      role="listitem"
                      className="bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm border border-gray-200"
                    >
                      <span className="text-lg" role="img">{feature.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Downloads Section */}
            <section aria-labelledby="downloads-heading" className="mb-16">
              <div className="text-center mb-12">
                <h2 
                  id="downloads-heading"
                  className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4"
                >
                  Materiais Disponíveis
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Baixe nossos materiais informativos desenvolvidos com <strong>total acessibilidade</strong>. 
                  Todos os arquivos são <strong>compatíveis com leitores de tela</strong> e otimizados para pessoas com deficiência visual.
                </p>
              </div>
              
              <div className="space-y-8" role="list" aria-label="Lista de materiais para download">
                {downloadItems.map((item, index) => (
                  <div key={index} role="listitem">
                    <DownloadCard {...item} />
                  </div>
                ))}
              </div>
            </section>

            {/* Support Section */}
            <section className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12 text-center" aria-labelledby="support-heading">
              <h2 
                id="support-heading"
                className="text-3xl font-bold text-primary-600 mb-6"
              >
                Precisa de Ajuda?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Nossa plataforma foi desenvolvida para ser <strong>totalmente acessível</strong>. 
                Se encontrar alguma dificuldade, entre em contato conosco.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contato"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
                  aria-label="Ir para página de contato"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Entre em Contato
                </a>
                <a
                  href="/quem-somos"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 border-2 border-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
                  aria-label="Conhecer mais sobre o projeto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sobre o Projeto
                </a>
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
