'use client';

import Head from 'next/head';
import Header from './Header';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

// Dynamically import VLibras to prevent SSR issues
const VLibras = dynamic(() => import('../components/VLibras'), { 
  ssr: false 
});

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #2A1B5D;
  color: #FFB6F3;
  font-family: system-ui, sans-serif;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .main-navigation {
    @media (max-width: 480px) {
      flex-direction: column !important;
      gap: 1rem !important;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 3rem;
  }
`;

const StyledLink = styled.a`
  background-color: #FFB6F3;
  color: #2A1B5D;
  padding: 1.5rem;
  border-radius: 1rem;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  flex: 1;
  text-align: center;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 2px solid transparent;
  min-width: 200px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: none;
    border-color: #2A1B5D;
    box-shadow: 0 0 0 3px rgba(255, 182, 243, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    min-width: 150px;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.9rem;
    min-width: 120px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

export default function CadernetaPage() {
  return (
    <>
      <Head>
        <title>Aproxima - Caderneta da Gestante Acessível | Saúde Inclusiva</title>
        <meta name="description" content="Plataforma digital para saúde inclusiva, conectando gestantes e profissionais com acessibilidade. Caderneta da gestante acessível para pessoas com deficiência visual." />
        <meta name="keywords" content="caderneta gestante, acessibilidade, deficiência visual, saúde inclusiva, V Libras, gestação, pré-natal" />
        <meta name="author" content="Kalleby Evangelho Mota" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Aproxima - Caderneta da Gestante Acessível" />
        <meta property="og:description" content="Plataforma digital para saúde inclusiva com foco em acessibilidade para gestantes" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aproxima - Caderneta da Gestante Acessível" />
        <meta name="twitter:description" content="Plataforma digital para saúde inclusiva com foco em acessibilidade para gestantes" />
        
        {/* V Libras and accessibility */}
        <script src="https://vlibras.gov.br/app/vlibras-plugin.js" async />
        
        {/* Structured data for SEO */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Aproxima - Caderneta da Gestante Acessível",
              "description": "Plataforma digital para saúde inclusiva, conectando gestantes e profissionais com acessibilidade",
              "url": "https://aproxima-six.vercel.app",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Any",
              "accessibilityFeature": [
                "screenReaderSupport",
                "keyboardNavigation",
                "highContrastDisplay",
                "signLanguageVideo"
              ],
              "accessibilityAPI": "ARIA",
              "author": {
                "@type": "Person",
                "name": "Kalleby Evangelho Mota",
                "email": "kalleby.mota@ufn.edu.br"
              },
              "provider": {
                "@type": "Organization",
                "name": "Universidade Franciscana (UFN)"
              }
            })
          }}
        />
      </Head>
      
      <PageWrapper>
        <Header />
        
        <MainContent role="main" id="main-content">
          <h1 style={{
            fontSize: '2rem',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            Caderneta da Gestante Acessível para Pessoas com Deficiência Visual
          </h1>

          <nav aria-label="Seções principais da plataforma" style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '800px',
            flexDirection: 'row',
          }} className="main-navigation">
            <StyledLink 
              href="/area-do-profissional"
              aria-label="Acessar seção destinada aos profissionais de saúde"
              role="button"
            >
              Seção dos profissionais
            </StyledLink>
            
            <StyledLink 
              href="/gestante"
              aria-label="Acessar seção destinada às gestantes"
              role="button"
            >
              Seção da gestante
            </StyledLink>
          </nav>
        </MainContent>
        <VLibras />
      </PageWrapper>
    </>
  );
}
