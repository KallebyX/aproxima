'use client';

import Header from './Header';
import styled from 'styled-components';

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
    </PageWrapper>
  );
}
