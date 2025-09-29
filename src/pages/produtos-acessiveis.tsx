'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';

// Dynamically import VLibras to prevent SSR issues
const VLibras = dynamic(() => import('../components/VLibras'), { 
  ssr: false 
});

interface ProductCardProps {
  title: string;
  description: string;
  category: string;
  href: string;
  fileSize: string;
  fileType: string;
  icon: string;
  features: string[];
  delay?: number;
}

function ProductCard({ 
  title, 
  description, 
  category, 
  href, 
  fileSize, 
  fileType, 
  icon, 
  features, 
  delay = 0 
}: ProductCardProps) {
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
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center text-4xl shadow-lg">
              {icon}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 border">
                {category}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-primary-600 mb-4 group-hover:text-primary-700 transition-colors leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {description}
            </p>
            
            {/* Features */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Recursos de Acessibilidade
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0"></span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
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
              className={`inline-flex items-center gap-3 bg-gradient-to-r from-primary-400 to-primary-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none active:scale-95 ${
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
                  <span>Baixar Produto</span>
                </>
              )}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccessibleProductsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const accessibleProducts = [
    {
      title: 'Caderneta da Gestante Acessível',
      description: 'Caderneta digital completa para acompanhamento da gestação, desenvolvida especialmente para pessoas com deficiência visual. Inclui todos os recursos necessários para monitoramento pré-natal com total acessibilidade.',
      category: 'Gestação',
      href: 'https://drive.google.com/uc?export=download&id=1sQVoncR0Cmok-T76zlN_gfbzWVr_6Wlo',
      fileSize: '2.1 MB',
      fileType: 'PDF Acessível',
      icon: '📱',
      features: [
        'Compatível com leitores de tela',
        'Navegação por teclado',
        'Estrutura semântica adequada',
        'Textos alternativos completos',
        'Alto contraste disponível',
        'Formulários acessíveis'
      ],
      delay: 200
    }
  ];

  const stats = [
    { number: "100%", label: "Acessibilidade", description: "WCAG 2.1 AAA" },
    { number: "24/7", label: "Disponível", description: "Acesso contínuo" },
    { number: "∞", label: "Gratuito", description: "Para sempre" }
  ];

  return (
    <>
      <Head>
        <title>Produtos Acessíveis | Aproxima - Soluções de Saúde Inclusiva</title>
        <meta name="description" content="Descubra e baixe produtos de saúde 100% acessíveis desenvolvidos seguindo padrões WCAG 2.1 AAA. Soluções inclusivas para pessoas com deficiência visual, cadernetas digitais, formulários acessíveis e mais." />
        <meta name="keywords" content="produtos acessíveis saúde, caderneta gestante acessível, formulários inclusivos, WCAG 2.1 AAA, deficiência visual, tecnologias assistivas, download gratuito" />
        <meta name="author" content="Kalleby Evangelho Mota" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Produtos Acessíveis - Aproxima Saúde Inclusiva" />
        <meta property="og:description" content="Produtos de saúde 100% acessíveis para download gratuito" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Produtos Acessíveis - Aproxima" />
        <meta name="twitter:description" content="Soluções de saúde inclusiva para todos" />
        
        {/* Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Produtos Acessíveis - Aproxima",
              "description": "Produtos de saúde acessíveis para download",
              "url": "https://aproxima-six.vercel.app/produtos-acessiveis",
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
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock"
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
          aria-label="Conteúdo de produtos acessíveis"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16" aria-labelledby="products-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-400 to-primary-500 text-white px-6 py-3 rounded-full font-semibold mb-6 shadow-lg">
                  <span className="text-2xl" role="img" aria-label="Produtos">🛍️</span>
                  <span>Produtos Gratuitos</span>
                </div>
                
                <h1 
                  id="products-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-600 mb-6 leading-tight"
                >
                  Produtos <span className="text-gradient bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">Acessíveis</span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  Arquivos <strong>100% acessíveis</strong> relacionados à saúde, desenvolvidos seguindo 
                  rigorosamente os padrões <strong>WCAG 2.1 AAA</strong>. 
                  <br />Basta clicar e baixar o conteúdo <strong>gratuitamente</strong>.
                </p>
              </div>
            </section>

            {/* Stats Section */}
            <section className="mb-16" aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">Características dos produtos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                    <div className="text-xl font-semibold text-gray-800 mb-1">{stat.label}</div>
                    <div className="text-gray-600">{stat.description}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Products Section */}
            <section aria-labelledby="downloads-heading" className="mb-16">
              <div className="text-center mb-12">
                <h2 
                  id="downloads-heading"
                  className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4"
                >
                  Produtos Disponíveis
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Todos os nossos produtos são <strong>totalmente gratuitos</strong> e desenvolvidos com 
                  <strong> acessibilidade total</strong>. Cada arquivo é compatível com tecnologias assistivas 
                  e otimizado para pessoas com deficiência visual.
                </p>
              </div>
              
              <div className="space-y-8" role="list" aria-label="Lista de produtos acessíveis">
                {accessibleProducts.map((product, index) => (
                  <div key={index} role="listitem">
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </section>

            {/* Collaboration Section */}
            <section className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12 text-center" aria-labelledby="collaboration-heading">
              <h2 
                id="collaboration-heading"
                className="text-3xl font-bold text-primary-600 mb-6"
              >
                Tem Produtos Acessíveis?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Você desenvolveu ou conhece <strong>produtos de saúde acessíveis</strong> que podem 
                beneficiar nossa comunidade? Queremos incluí-los em nossa plataforma para ampliar 
                o acesso a <strong>recursos inclusivos</strong>.
              </p>
              
              <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-gray-100 mb-8">
                <div className="text-5xl mb-4" role="img" aria-label="Colaboração">🤝</div>
                <h3 className="text-xl font-bold text-primary-600 mb-4">
                  Como Colaborar
                </h3>
                <div className="text-left space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Envie seu produto acessível por e-mail</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Nossa equipe validará a acessibilidade</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Incluiremos na plataforma com os devidos créditos</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:rejanecassol@hotmail.com?subject=Colaboração - Produto Acessível"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
                  aria-label="Enviar produto acessível por e-mail"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar Produto
                </a>
                <a
                  href="/contato"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 border-2 border-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
                  aria-label="Ir para página de contato"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Mais Informações
                </a>
              </div>
              
              <p className="text-gray-600 mt-6">
                <strong>E-mail:</strong> rejanecassol@hotmail.com
              </p>
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
