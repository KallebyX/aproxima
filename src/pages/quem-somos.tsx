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

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    { number: "100%", label: "Acessibilidade", description: "WCAG 2.1 AAA" },
    { number: "24/7", label: "Disponibilidade", description: "Acesso contínuo" },
    { number: "∞", label: "Inclusão", description: "Para todos" }
  ];

  const features = [
    {
      icon: "👁️",
      title: "Leitores de Tela",
      description: "Compatibilidade completa com NVDA, JAWS, e outros leitores de tela"
    },
    {
      icon: "⌨️", 
      title: "Navegação por Teclado",
      description: "Interface totalmente navegável usando apenas o teclado"
    },
    {
      icon: "🎨",
      title: "Alto Contraste",
      description: "Design otimizado para diferentes necessidades visuais"
    },
    {
      icon: "🔍",
      title: "Zoom Responsivo",
      description: "Suporte a zoom até 500% sem perda de funcionalidade"
    }
  ];

  return (
    <>
      <Head>
        <title>Quem Somos | Aproxima - Saúde Inclusiva e Acessível</title>
        <meta name="description" content="Conheça a Aproxima, plataforma de saúde inclusiva desenvolvida especialmente para pessoas com deficiência visual. Nossa missão é tornar o acesso à saúde verdadeiramente universal, seguindo padrões WCAG 2.1 AAA de acessibilidade." />
        <meta name="keywords" content="saúde inclusiva, acessibilidade digital, WCAG 2.1 AAA, deficiência visual, tecnologias assistivas, inclusão digital, saúde para todos" />
        <meta name="author" content="Kalleby Evangelho Mota" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Quem Somos - Aproxima Saúde Inclusiva" />
        <meta property="og:description" content="Plataforma de saúde 100% acessível desenvolvida para promover inclusão digital" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Quem Somos - Aproxima" />
        <meta name="twitter:description" content="Saúde inclusiva e acessível para todos" />
        
        {/* Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "name": "Quem Somos - Aproxima",
              "description": "Informações sobre a plataforma de saúde inclusiva Aproxima",
              "url": "https://aproxima-six.vercel.app/quem-somos",
              "isPartOf": {
                "@type": "WebSite",
                "name": "Aproxima - Saúde Inclusiva",
                "url": "https://aproxima-six.vercel.app"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Aproxima",
                "description": "Plataforma de saúde inclusiva e acessível"
              },
              "accessibilityFeature": [
                "screenReaderSupport",
                "keyboardNavigation", 
                "highContrastDisplay",
                "alternativeText",
                "focusManagement"
              ]
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
          aria-label="Conteúdo sobre quem somos"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16" aria-labelledby="about-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-secondary-400 to-secondary-500 text-primary-600 px-6 py-3 rounded-full font-semibold mb-6 shadow-lg">
                  <span className="text-2xl" role="img" aria-label="Coração">💚</span>
                  <span>Nossa História</span>
                </div>
                
                <h1 
                  id="about-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-600 mb-6 leading-tight"
                >
                  Bem-vindo(a) à <span className="text-gradient bg-gradient-to-r from-secondary-500 to-secondary-600 bg-clip-text text-transparent">Aproxima</span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  <strong>Saúde Inclusiva</strong> para todas as pessoas
                </p>
              </div>
            </section>

            {/* Stats Section */}
            <section className="mb-16" aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">Estatísticas da plataforma</h2>
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

            {/* Mission Section */}
            <section className="mb-16" aria-labelledby="mission-heading">
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
                <h2 
                  id="mission-heading"
                  className="text-3xl sm:text-4xl font-bold text-primary-600 mb-8 text-center"
                >
                  Nossa Missão
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Nossa plataforma surgiu com um <strong>propósito muito especial</strong>: facilitar o acesso às informações de saúde, 
                      especialmente para pessoas com deficiência visual.
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Nos dedicamos a criar uma experiência <strong>verdadeiramente inclusiva</strong>, onde os conteúdos são 
                      apresentados de maneira acessível, intuitiva e adaptada às necessidades de quem utiliza 
                      <strong> tecnologias assistivas</strong>, como leitores de tela.
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Nosso objetivo é tornar a saúde acessível a <strong>todos</strong>, incluindo pessoas com deficiência. 
                      Estamos comprometidos em garantir que todos tenham acesso a informações de saúde de forma 
                      <strong> equitativa e sem barreiras</strong>.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
                    <div className="text-center mb-6">
                      <span className="text-6xl mb-4 block" role="img" aria-label="Inclusão">🤝</span>
                      <h3 className="text-2xl font-bold text-primary-600 mb-4">Compromisso com a Inclusão</h3>
                    </div>
                    <blockquote className="text-lg text-gray-700 italic leading-relaxed text-center">
                      "Acreditamos que a <strong>saúde é um direito universal</strong>, e nossa tecnologia é o meio 
                      para eliminar barreiras e promover igualdade de acesso."
                    </blockquote>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-16" aria-labelledby="features-heading">
              <div className="text-center mb-12">
                <h2 
                  id="features-heading"
                  className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4"
                >
                  Recursos de Acessibilidade
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Desenvolvemos cada funcionalidade pensando na <strong>experiência inclusiva</strong> e no cumprimento 
                  rigoroso dos padrões <strong>WCAG 2.1 AAA</strong>.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list" aria-label="Lista de recursos de acessibilidade">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    role="listitem"
                    className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="text-4xl mb-4" role="img">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-primary-600 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Values Section */}
            <section className="mb-16" aria-labelledby="values-heading">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12">
                <h2 
                  id="values-heading"
                  className="text-3xl sm:text-4xl font-bold text-primary-600 mb-8 text-center"
                >
                  Nossos Valores
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white" role="img" aria-label="Inclusão">♿</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary-600 mb-3">Inclusão</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Acreditamos que todos merecem acesso igual à informação e aos serviços de saúde.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-primary-600" role="img" aria-label="Inovação">💡</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary-600 mb-3">Inovação</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Utilizamos tecnologia de ponta para criar soluções verdadeiramente acessíveis.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-primary-600" role="img" aria-label="Qualidade">✨</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary-600 mb-3">Excelência</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Mantemos os mais altos padrões de qualidade em tudo o que desenvolvemos.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100" aria-labelledby="cta-heading">
              <h2 
                id="cta-heading"
                className="text-3xl font-bold text-primary-600 mb-6"
              >
                Junte-se à Nossa Missão
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Explore nossos recursos acessíveis e faça parte do movimento para tornar os serviços 
                e produtos de saúde <strong>mais acessíveis para todos</strong>!
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a
                  href="/gestante"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
                  aria-label="Acessar área da gestante"
                >
                  <span className="text-xl" role="img" aria-label="Gestante">🤱</span>
                  Área da Gestante
                </a>
                <a
                  href="/area-do-profissional"
                  className="inline-flex items-center gap-2 bg-secondary-500 text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-secondary-600 transition-all duration-300 focus:ring-4 focus:ring-secondary-300/50 focus:outline-none"
                  aria-label="Acessar área do profissional"
                >
                  <span className="text-xl" role="img" aria-label="Profissional">👩‍⚕️</span>
                  Área do Profissional
                </a>
              </div>
              
              <p className="text-2xl font-bold text-primary-600 mb-2">
                Obrigada pela sua visita! 💚
              </p>
              <p className="text-gray-600">
                Cada acesso nos motiva a continuar construindo um mundo mais inclusivo.
              </p>
            </section>
          </div>
        </main>
        
        <VLibras position="bottom-right" avatar="icaro" opacity={0.95} />
        
        <Footer />
      </div>
    </>
  );
}