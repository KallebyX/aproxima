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

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const contactMethods = [
    {
      type: "email",
      icon: "📧",
      title: "E-mail Principal",
      value: "rejanecassol@hotmail.com",
      href: "mailto:rejanecassol@hotmail.com",
      description: "Para colaborações e parcerias"
    },
    {
      type: "accessibility",
      icon: "♿",
      title: "Suporte de Acessibilidade",
      value: "Relatório de Problemas",
      href: "mailto:rejanecassol@hotmail.com?subject=Relatório de Acessibilidade",
      description: "Reporte problemas de acessibilidade"
    },
    {
      type: "partnerships",
      icon: "🤝",
      title: "Parcerias",
      value: "Produtos Acessíveis",
      href: "mailto:rejanecassol@hotmail.com?subject=Parceria - Produtos Acessíveis",
      description: "Compartilhe produtos acessíveis"
    }
  ];

  return (
    <>
      <Head>
        <title>Contato | Aproxima - Entre em Contato Conosco</title>
        <meta name="description" content="Entre em contato com a equipe Aproxima para colaborações, parcerias, suporte de acessibilidade ou para compartilhar produtos acessíveis. Estamos comprometidos em tornar a saúde mais inclusiva para todos." />
        <meta name="keywords" content="contato aproxima, parceria acessibilidade, produtos acessíveis, suporte técnico, colaboração inclusiva, saúde digital acessível" />
        <meta name="author" content="Kalleby Evangelho Mota" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contato - Aproxima Saúde Inclusiva" />
        <meta property="og:description" content="Fale conosco para colaborações, parcerias e melhorias na acessibilidade" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contato - Aproxima" />
        <meta name="twitter:description" content="Entre em contato para tornar a saúde mais acessível" />
        
        {/* Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contato - Aproxima",
              "description": "Página de contato da plataforma Aproxima",
              "url": "https://aproxima-six.vercel.app/contato",
              "isPartOf": {
                "@type": "WebSite",
                "name": "Aproxima - Saúde Inclusiva",
                "url": "https://aproxima-six.vercel.app"
              },
              "mainEntity": {
                "@type": "Organization",
                "name": "Aproxima",
                "email": "rejanecassol@hotmail.com",
                "description": "Plataforma de saúde inclusiva e acessível"
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
          aria-label="Página de contato"
        >
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16" aria-labelledby="contact-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-400 to-accent-500 text-primary-600 px-6 py-3 rounded-full font-semibold mb-6 shadow-lg">
                  <span className="text-2xl" role="img" aria-label="Contato">📞</span>
                  <span>Fale Conosco</span>
                </div>
                
                <h1 
                  id="contact-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-600 mb-6 leading-tight"
                >
                  Entre em <span className="text-gradient bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">Contato</span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  Tem um <strong>produto acessível</strong> que pode disponibilizar para nossa plataforma? 
                  Encontrou algum problema de acessibilidade? Queremos ouvir você!
                </p>
              </div>
            </section>

            {/* Contact Methods */}
            <section aria-labelledby="contact-methods-heading" className="mb-16">
              <h2 
                id="contact-methods-heading"
                className="text-3xl sm:text-4xl font-bold text-primary-600 mb-12 text-center"
              >
                Como Entrar em Contato
              </h2>
              
              <div className="contact-methods-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto" role="list" aria-label="Métodos de contato">
                {contactMethods.map((method, index) => (
                  <div 
                    key={index}
                    role="listitem"
                    className="contact-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-gray-100 group hover:-translate-y-1 max-w-sm mx-auto w-full"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                        {method.icon}
                      </div>
                      <h3 className="text-xl font-bold text-primary-600 mb-3 group-hover:text-primary-700 transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {method.description}
                      </p>
                      <a
                        href={method.href}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-400 to-accent-500 text-primary-600 font-semibold px-6 py-3 rounded-xl hover:from-accent-500 hover:to-accent-600 transition-all duration-300 focus:ring-4 focus:ring-accent-300/50 focus:outline-none active:scale-95"
                        aria-label={`Entrar em contato via ${method.title.toLowerCase()}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {method.type === "email" ? method.value : "Enviar E-mail"}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Main Contact Info */}
            <section className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12 text-center mb-16" aria-labelledby="main-contact-heading">
              <h2 
                id="main-contact-heading"
                className="text-3xl font-bold text-primary-600 mb-6"
              >
                E-mail Principal
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
                <div className="text-6xl mb-6" role="img" aria-label="E-mail">💌</div>
                <a
                  href="mailto:rejanecassol@hotmail.com"
                  className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-primary-600 hover:text-primary-700 transition-colors break-words focus:ring-4 focus:ring-primary-300/50 focus:outline-none rounded-lg p-2 block text-center overflow-wrap-anywhere"
                  aria-label="Enviar e-mail para rejanecassol@hotmail.com"
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                >
                  rejanecassol@hotmail.com
                </a>
                <p className="text-gray-600 mt-4 text-lg leading-relaxed">
                  Este é nosso canal principal de comunicação. Respondemos normalmente em até 24 horas.
                </p>
              </div>
            </section>

            {/* Collaboration Section */}
            <section className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100" aria-labelledby="collaboration-heading">
              <h2 
                id="collaboration-heading"
                className="text-3xl font-bold text-primary-600 mb-8 text-center"
              >
                Colabore Conosco
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary-600 mb-4 flex items-center gap-2">
                    <span className="text-2xl" role="img" aria-label="Produtos">📱</span>
                    Produtos Acessíveis
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Você desenvolveu ou conhece produtos de saúde acessíveis? Queremos incluí-los em nossa plataforma para ampliar o acesso a recursos inclusivos.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Aplicativos de saúde acessíveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Materiais educativos inclusivos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Ferramentas médicas adaptadas</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-primary-600 mb-4 flex items-center gap-2">
                    <span className="text-2xl" role="img" aria-label="Feedback">🛠️</span>
                    Feedback e Melhorias
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Sua experiência é fundamental para tornarmos nossa plataforma ainda mais acessível. Compartilhe suas sugestões, dificuldades ou ideias de melhoria.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">💡</span>
                      <span>Problemas de navegação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">💡</span>
                      <span>Sugestões de recursos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">💡</span>
                      <span>Relatos de experiência</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <a
                  href="mailto:rejanecassol@hotmail.com?subject=Colaboração - Aproxima"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
                  aria-label="Enviar e-mail para colaborar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Iniciar Colaboração
                </a>
              </div>
            </section>
          </div>
        </main>
        
        <VLibras position="bottom-right" avatar="icaro" opacity={0.95} />
        
        <Footer />
      </div>
    </>
  );
}
