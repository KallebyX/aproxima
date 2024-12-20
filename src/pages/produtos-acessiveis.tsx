'use client';

import Header from './Header';
import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #2A1B5D;
  color: #FFB6F3;
  font-family: system-ui, sans-serif;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
`;

const Heading = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DownloadButton = styled.a`
  background-color: #FFB6F3;
  color: #2A1B5D;
  border: none;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  width: auto;
  max-width: 600px;
  margin: 0 auto;
  display: block;
  text-align: center;
  text-decoration: none;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem 1.5rem;
  }
`;

const ContactSection = styled.div`
  margin-top: 4rem;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContactParagraph = styled.p`
  margin-bottom: 1rem;
`;

const ContactLink = styled.a`
  color: #FFB6F3;
  text-decoration: none;
`;

export default function ProdutosAcessiveis() {
  return (
    <PageWrapper>
      <Header />

      <MainContent>
        <Heading>Abaixo estão disponíveis arquivos acessíveis relacionados à saúde</Heading>
        
        <Paragraph>Basta clicar em cima e baixar o conteúdo.</Paragraph>

        <DownloadButton
          href="https://drive.google.com/uc?export=download&id=1sQVoncR0Cmok-T76zlN_gfbzWVr_6Wlo"
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          Caderneta da Gestante Acessível para Pessoas com Deficiência Visual
        </DownloadButton>
  
        <ContactSection>
          <ContactParagraph>
            Você tem algum produto acessível que possa disponibilizar para a plataforma?
          </ContactParagraph>
          <ContactParagraph>
            Entre em contato pelo e-mail{' '}
            <ContactLink href="mailto:rejanecassol@hotmail.com">
              rejanecassol@hotmail.com
            </ContactLink>
          </ContactParagraph>
        </ContactSection>
      </MainContent>
    </PageWrapper>
  );
}
