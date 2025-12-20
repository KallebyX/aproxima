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

interface ContactCardProps {
  type: string;
  icon: string;
  title: string;
  value: string;
  href: string;
  description: string;
  gradient: string;
  delay: number;
}

function ContactCard({ icon, title, value, href, description, gradient, delay, type }: ContactCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full">
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />

        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-6 sm:p-8 text-center h-full flex flex-col">
          {/* Icon */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
            <span className="text-3xl sm:text-4xl" aria-hidden="true">{icon}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-primary-600 mb-3 group-hover:text-primary-700 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-sm sm:text-base">
            {description}
          </p>

          {/* CTA Button */}
          <a
            href={href}
            className={`group/btn inline-flex items-center justify-center gap-3 bg-gradient-to-r ${gradient} text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/50 active:scale-95 hover:scale-105`}
            aria-label={`Entrar em contato via ${title.toLowerCase()}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{type === "email" ? "Enviar E-mail" : "Enviar Mensagem"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

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
      description: "Para colaborações, parcerias e informações gerais sobre a plataforma",
      gradient: "from-blue-500 via-indigo-500 to-violet-500",
      delay: 200
    },
    {
      type: "accessibility",
      icon: "♿",
      title: "Suporte de Acessibilidade",
      value: "Relatório de Problemas",
      href: "mailto:rejanecassol@hotmail.com?subject=Relatório de Acessibilidade",
      description: "Reporte problemas de acessibilidade ou sugira melhorias para nossa plataforma",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      delay: 350
    },
    {
      type: "partnerships",
      icon: "🤝",
      title: "Parcerias",
      value: "Produtos Acessíveis",
      href: "mailto:rejanecassol@hotmail.com?subject=Parceria - Produtos Acessíveis",
      description: "Compartilhe produtos acessíveis para inclusão em nossa plataforma",
      gradient: "from-amber-500 via-orange-500 to-yellow-500",
      delay: 500
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        <Header />

        <main
          role="main"
          id="main-content"
          className="flex-grow py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
          aria-label="Página de contato"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16 lg:mb-20" aria-labelledby="contact-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 px-6 py-3 rounded-full font-semibold mb-8 shadow-lg border border-indigo-200">
                  <span className="text-2xl" role="img" aria-label="Contato">📞</span>
                  <span>Fale Conosco</span>
                </div>

                {/* Title */}
                <h1
                  id="contact-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                >
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Entre em{' '}
                  </span>
                  <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    Contato
                  </span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Tem um <strong className="text-primary-600">produto acessível</strong> que pode disponibilizar para nossa plataforma?
                  Encontrou algum problema de acessibilidade? <strong className="text-primary-600">Queremos ouvir você!</strong>
                </p>
              </div>
            </section>

            {/* Contact Methods */}
            <section aria-labelledby="contact-methods-heading" className="mb-16 lg:mb-20">
              <div className={`text-center mb-10 sm:mb-12 transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h2
                  id="contact-methods-heading"
                  className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4"
                >
                  Como Entrar em Contato
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  Escolha o canal mais adequado para sua necessidade
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" role="list" aria-label="Métodos de contato">
                {contactMethods.map((method, index) => (
                  <div key={index} role="listitem">
                    <ContactCard {...method} />
                  </div>
                ))}
              </div>
            </section>

            {/* Main Contact Info */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-center mb-16 lg:mb-20" aria-labelledby="main-contact-heading">
              {/* Decorative elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl" />

              <div className="relative">
                <h2
                  id="main-contact-heading"
                  className="text-3xl sm:text-4xl font-bold text-white mb-8"
                >
                  E-mail Principal
                </h2>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 sm:p-10 border border-white/20 max-w-xl mx-auto">
                  <div className="text-6xl sm:text-7xl mb-6" role="img" aria-label="E-mail">💌</div>
                  <a
                    href="mailto:rejanecassol@hotmail.com"
                    className="block text-xl xs:text-2xl sm:text-3xl font-bold text-white hover:text-secondary-200 transition-colors break-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 rounded-lg p-2"
                    aria-label="Enviar e-mail para rejanecassol@hotmail.com"
                    style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                  >
                    rejanecassol@hotmail.com
                  </a>
                  <p className="text-white/80 mt-6 text-base sm:text-lg leading-relaxed">
                    Este é nosso canal principal de comunicação.<br />
                    Respondemos normalmente em até <strong className="text-white">24 horas</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Collaboration Section */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-gray-100" aria-labelledby="collaboration-heading">
              <div className={`transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h2
                  id="collaboration-heading"
                  className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-10 text-center"
                >
                  Colabore Conosco
                </h2>

                <div className="grid md:grid-cols-2 gap-10 lg:gap-12">
                  {/* Products */}
                  <div className="group">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        <span className="text-2xl" role="img" aria-label="Produtos">📱</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-primary-600">
                        Produtos Acessíveis
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-5">
                      Você desenvolveu ou conhece produtos de saúde acessíveis? Queremos incluí-los em nossa plataforma para ampliar o acesso a recursos inclusivos.
                    </p>
                    <ul className="space-y-3">
                      {["Aplicativos de saúde acessíveis", "Materiais educativos inclusivos", "Ferramentas médicas adaptadas"].map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-600">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Feedback */}
                  <div className="group">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        <span className="text-2xl" role="img" aria-label="Feedback">🛠️</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-primary-600">
                        Feedback e Melhorias
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-5">
                      Sua experiência é fundamental para tornarmos nossa plataforma ainda mais acessível. Compartilhe suas sugestões, dificuldades ou ideias.
                    </p>
                    <ul className="space-y-3">
                      {["Problemas de navegação", "Sugestões de recursos", "Relatos de experiência"].map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-600">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-500 text-sm">💡</span>
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <a
                    href="mailto:rejanecassol@hotmail.com?subject=Colaboração - Aproxima"
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400/50"
                    aria-label="Enviar e-mail para colaborar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Iniciar Colaboração
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
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
