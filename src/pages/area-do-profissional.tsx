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

interface ResourceCardProps {
  title: string;
  description: string;
  href: string;
  fileSize: string;
  fileType: string;
  icon: string;
  category: string;
  delay?: number;
}

function ResourceCard({ 
  title, 
  description, 
  href, 
  fileSize, 
  fileType, 
  icon, 
  category, 
  delay = 0 
}: ResourceCardProps) {
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
            <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
              {icon}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800 border">
                {category}
              </span>
            </div>
            
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
              className={`inline-flex items-center gap-3 bg-gradient-to-r from-accent-400 to-accent-500 text-primary-600 font-semibold px-8 py-4 rounded-xl hover:from-accent-500 hover:to-accent-600 transition-all duration-300 focus:ring-4 focus:ring-accent-300/50 focus:outline-none active:scale-95 ${
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

export default function ProfessionalAreaPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const professionalResources = [
    {
      title: 'Datas das Consultas',
      description: 'Modelo digital para registro de consultas pré-natais, desenvolvido com total acessibilidade para profissionais de saúde. Facilita o acompanhamento sistemático da gestação.',
      href: 'https://drive.google.com/uc?export=download&id=1LkHiWZZqKEaI9ahhxWpJPqdvqdcKIwdd',
      fileSize: '1.2 MB',
      fileType: 'PDF Editável',
      icon: '📅',
      category: 'Acompanhamento',
      delay: 200
    },
    {
      title: 'Resultados dos Exames',
      description: 'Formulário estruturado para documentação de resultados de exames laboratoriais e de imagem, otimizado para leitores de tela e navegação acessível.',
      href: 'https://drive.google.com/uc?export=download&id=10uZzTLyxaLDaO_h5M9AcfbN2OWaFYMlq',
      fileSize: '985 KB',
      fileType: 'PDF Editável',
      icon: '🧪',
      category: 'Diagnóstico',
      delay: 400
    },
    {
      title: 'Consultas Odontológicas',
      description: 'Documento específico para acompanhamento odontológico durante a gestação, com recursos de acessibilidade e campos estruturados para registro detalhado.',
      href: 'https://drive.google.com/uc?export=download&id=1HggA1f6QZQaMpUg7smXaVJK_VnRmVNkx',
      fileSize: '750 KB',
      fileType: 'PDF Editável',
      icon: '🦷',
      category: 'Odontologia',
      delay: 600
    },
    {
      title: 'Pré-natal do Parceiro',
      description: 'Formulário inclusivo para envolvimento do parceiro no processo de pré-natal, promovendo cuidado integral e participativo durante a gestação.',
      href: 'https://drive.google.com/uc?export=download&id=1wbzAKCqOFMlHOMD-7QFWB5SsN573xm8W',
      fileSize: '1.5 MB',
      fileType: 'PDF Editável',
      icon: '👨‍⚕️',
      category: 'Cuidado Integral',
      delay: 800
    }
  ];

  return (
    <>
      <Head>
        <title>Área do Profissional | Aproxima - Ferramentas Acessíveis</title>
        <meta name="description" content="Área exclusiva para profissionais de saúde com formulários digitais acessíveis, ferramentas para pré-natal inclusivo e recursos completos para atendimento de gestantes com deficiência visual. Desenvolvido seguindo padrões WCAG 2.1 AAA." />
        <meta name="keywords" content="profissional saúde acessível, pré-natal inclusivo, formulários digitais, atendimento acessível, WCAG 2.1 AAA, gestante deficiência visual, ferramentas médicas inclusivas" />
        <meta name="author" content="Kalleby Evangelho Mota" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Área do Profissional - Aproxima Ferramentas Acessíveis" />
        <meta property="og:description" content="Ferramentas digitais exclusivas para profissionais de saúde com total acessibilidade" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Área do Profissional - Aproxima" />
        <meta name="twitter:description" content="Ferramentas 100% acessíveis para profissionais de saúde" />
        
        {/* Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Área do Profissional - Aproxima",
              "description": "Ferramentas digitais acessíveis para profissionais de saúde",
              "url": "https://aproxima-six.vercel.app/area-do-profissional",
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
                "audienceType": "Profissionais de Saúde"
              },
              "about": {
                "@type": "Thing",
                "name": "Ferramentas Médicas Acessíveis"
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
          aria-label="Conteúdo da área do profissional"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16" aria-labelledby="professional-heading">
              <div className={`transform transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-400 to-accent-500 text-primary-600 px-6 py-3 rounded-full font-semibold mb-6 shadow-lg">
                  <span className="text-2xl" role="img" aria-label="Profissional de saúde">👩‍⚕️</span>
                  <span>Área Profissional</span>
                </div>
                
                <h1 
                  id="professional-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-600 mb-6 leading-tight"
                >
                  Área do <span className="text-gradient bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">Profissional</span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  Ferramentas digitais <strong>100% acessíveis</strong> desenvolvidas especialmente para profissionais de saúde, 
                  promovendo um <strong>atendimento inclusivo</strong> e conformidade total com 
                  <abbr title="Web Content Accessibility Guidelines 2.1 nível AAA" className="border-b border-dotted border-gray-400 no-underline">
                    WCAG 2.1 AAA
                  </abbr>.
                </p>
                
                {/* Professional Features */}
                <div className="flex flex-wrap justify-center gap-4 mb-12" role="list" aria-label="Recursos profissionais">
                  {[
                    { icon: "📋", text: "Formulários Digitais" },
                    { icon: "♿", text: "Atendimento Inclusivo" },
                    { icon: "📊", text: "Relatórios Acessíveis" },
                    { icon: "🔍", text: "Interface Adaptável" }
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

            {/* Resources Section */}
            <section aria-labelledby="resources-heading" className="mb-16">
              <div className="text-center mb-12">
                <h2 
                  id="resources-heading"
                  className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4"
                >
                  Ferramentas Profissionais
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Acesse nossos formulários e ferramentas desenvolvidos com <strong>total acessibilidade</strong>. 
                  Todos os recursos são <strong>compatíveis com tecnologias assistivas</strong> e otimizados para atendimento inclusivo.
                </p>
              </div>
              
              <div className="space-y-8" role="list" aria-label="Lista de ferramentas profissionais">
                {professionalResources.map((resource, index) => (
                  <div key={index} role="listitem">
                    <ResourceCard {...resource} />
                  </div>
                ))}
              </div>
            </section>

            {/* Guidelines Section */}
            <section className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-8 lg:p-12 mb-16" aria-labelledby="guidelines-heading">
              <h2 
                id="guidelines-heading"
                className="text-3xl font-bold text-primary-600 mb-6 text-center"
              >
                Diretrizes de Atendimento Inclusivo
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-600 mb-2">Comunicação Clara</h3>
                      <p className="text-gray-600">Use linguagem simples e direta. Identifique-se sempre ao iniciar a interação.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-600 mb-2">Tecnologias Assistivas</h3>
                      <p className="text-gray-600">Respeite o uso de bengalas, cães-guia e outros recursos de mobilidade.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-600 mb-2">Autonomia</h3>
                      <p className="text-gray-600">Promova a independência, oferecendo ajuda sem impor limitações.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-600 mb-2">Ambiente Acessível</h3>
                      <p className="text-gray-600">Mantenha o espaço organizado e descreva o ambiente quando necessário.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Section */}
            <section className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12 text-center" aria-labelledby="support-heading">
              <h2 
                id="support-heading"
                className="text-3xl font-bold text-primary-600 mb-6"
              >
                Suporte e Treinamento
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Oferecemos <strong>suporte completo</strong> para profissionais de saúde interessados em 
                atendimento inclusivo. Entre em contato para treinamentos e orientações.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contato"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 focus:ring-4 focus:ring-primary-300/50 focus:outline-none"
                  aria-label="Solicitar treinamento ou suporte"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Solicitar Treinamento
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
