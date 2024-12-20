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
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

export default function CadernetaPage() {
  return (
    <PageWrapper>
      <Header />
      
      <MainContent>
        <h1 style={{
          fontSize: '2rem',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          Caderneta da Gestante Acessível para Pessoas com Deficiência Visual
        </h1>

        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '800px',
        }}>
          <StyledLink href="/secao-profissionais">
            Seção dos profissionais
          </StyledLink>
          
          <StyledLink href="/secao-gestante">
            Seção da gestante
          </StyledLink>
        </div>
      </MainContent>
    </PageWrapper>
  );
}
