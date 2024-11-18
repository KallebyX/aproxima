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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    text-align: left;
    padding: 2rem 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const Heading = styled.h3`
  font-size: 1.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContactLink = styled.a`
  color: #FFB6F3;
  text-decoration: none;
  font-size: 1.2rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default function Contato() {
  return (
    <PageWrapper>
      <Header />

      <MainContent>
        <ContentWrapper>
          <Heading>Você tem algum produto acessível que possa disponibilizar para a plataforma?</Heading>
          
          <Paragraph>Entre em contato pelo e-mail disponível abaixo!</Paragraph>

          <ContactLink href="mailto:rejanecassol@hotmail.com">
            rejanecassol@hotmail.com
          </ContactLink>
        </ContentWrapper>
      </MainContent>
    </PageWrapper>
  );
}
