'use client';

import { Handshake, ShoppingBag, Smartphone } from 'lucide-react';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import ProductCard from '../components/ResourceDownloadCard';

// Dynamically import VLibras to prevent SSR issues
const VLibras = dynamic(() => import('../components/VLibras'), {
  ssr: false
});

export default function AccessibleProductsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const accessibleProducts = [
    {
      title: 'Caderneta da Gestante Acessível',
      description: 'Caderneta digital completa para acompanhamento da gestação, desenvolvida especialmente para pessoas com deficiência visual. Inclui todos os recursos necessários para monitoramento pré-natal com foco na acessibilidade.',
      category: 'Gestação',
      href: 'https://drive.google.com/uc?export=download&id=1sQVoncR0Cmok-T76zlN_gfbzWVr_6Wlo',
      fileSize: '2.1 MB',
      fileType: 'PDF Acessível',
      icon: <Smartphone className="h-7 w-7" aria-hidden="true" />,
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
    { number: "Inclusão", label: "Acessibilidade", description: "Recursos para navegar" },
    { number: "PDF", label: "Materiais digitais", description: "Para consultar e guardar" },
    { number: "Grátis", label: "Sem custo", description: "Acesso aos materiais" }
  ];

  return (
    <>
      <Head>
        <title>Produtos Acessíveis | Aproxima - Soluções de Saúde Inclusiva</title>
        <meta name="description" content="Descubra e baixe produtos de saúde com recursos de acessibilidade desenvolvidos seguindo padrões diretrizes de acessibilidade. Soluções inclusivas para pessoas com deficiência visual, cadernetas digitais, formulários acessíveis e mais." />
        <meta name="keywords" content="produtos acessíveis saúde, caderneta gestante acessível, formulários inclusivos, diretrizes de acessibilidade, deficiência visual, tecnologias assistivas, download gratuito" />
        <meta name="author" content="Kalleby Evangelho Mota" />

        {/* Open Graph */}
        <meta property="og:title" content="Produtos Acessíveis - Aproxima Saúde Inclusiva" />
        <meta property="og:description" content="Produtos de saúde com recursos de acessibilidade para download gratuito" />
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
              "url": "https://aproxima.app.ufn.edu.br/produtos-acessiveis",
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
          className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
          aria-label="Conteúdo de produtos acessíveis"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-10 sm:mb-12" aria-labelledby="products-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-400 to-primary-500 text-white px-6 py-3 rounded-full font-semibold mb-6 shadow-sm">
                  <span className="text-2xl" aria-hidden="true"><ShoppingBag className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /></span>
                  <span>Produtos Gratuitos</span>
                </div>

                <h1
                  id="products-heading"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600 mb-6 leading-tight"
                >
                  Produtos <span className="text-primary-700">Acessíveis</span>
                </h1>

                <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  Arquivos sobre saúde desenvolvidos com <strong>foco na acessibilidade</strong> e no apoio ao cuidado.
                  <br />Abra os materiais e salve uma cópia <strong>gratuitamente</strong>.
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
                    className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="text-2xl font-semibold text-primary-700 mb-2">{stat.number}</div>
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
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Todos os nossos produtos são <strong>totalmente gratuitos</strong> e desenvolvidos com
                  <strong> foco na acessibilidade</strong>. Cada arquivo é compatível com tecnologias assistivas
                  e otimizado para pessoas com deficiência visual.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2" role="list" aria-label="Lista de produtos acessíveis">
                {accessibleProducts.map((product, index) => (
                  <div key={index} role="listitem" className="min-w-0">
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

              <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-sm border border-gray-200 mb-8">
                <div className="text-5xl mb-4" aria-hidden="true"><Handshake className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /></div>
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
                  className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
                  aria-label="Enviar produto acessível por e-mail"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar Produto
                </a>
                <a
                  href="/contato"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 border-2 border-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
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
