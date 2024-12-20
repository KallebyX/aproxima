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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  text-align: center;
`;

export default function Contato() {
  return (
    <PageWrapper>
      <Header />
      
      <MainContent>
        <div style={{
          maxWidth: '800px',
          width: '100%',
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '1.5rem',
            lineHeight: '1.4',
          }}>
            Você tem algum produto acessível que possa disponibilizar para a plataforma?
          </h1>
          
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '2rem',
          }}>
            Entre em contato pelo e-mail disponível abaixo!
          </p>

          <a 
            href="mailto:rejanecassol@hotmail.com"
            style={{
              display: 'block',
              fontSize: '1.8rem',
              color: '#FFB6F3',
              textDecoration: 'none',
              marginTop: '2 rem',
              transition: 'opacity 0.2s',
            }}
          >
            rejanecassol@hotmail.com
          </a>
        </div>
      </MainContent>
    </PageWrapper>
  );
}
