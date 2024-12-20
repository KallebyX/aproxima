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
  text-align: start;

  @media (max-width: 768px) {
    text-align: left;
    padding: 2rem 1.5rem;
  }
`;

const Heading = styled.h3`
  font-size: 2rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FinalParagraph = styled.p`
  font-size: 1.2rem;
  margin: 1rem 0 0 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default function QuemSomos() {
  return (
    <PageWrapper>
      <Header />

      <MainContent>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
          <Heading>Bem-vindo(a) à Aproxima Saúde Inclusiva</Heading>
          
          <Paragraph>
            Nossa página surgiu com um propósito muito especial: facilitar o acesso às informações de saúde, 
            especialmente para pessoas com deficiência visual. Aqui, nos dedicamos a criar uma experiência 
            verdadeiramente inclusiva, onde os conteúdos são apresentados de maneira acessível, intuitiva e 
            adaptada às necessidades de quem utiliza tecnologias assistivas, como leitores de tela.
          </Paragraph>
          
          <Paragraph>
            Nosso objetivo é tornar a saúde acessível a todos, incluindo pessoas com deficiência. Estamos 
            comprometidos em garantir que todos tenham acesso a informações de saúde de forma equitativa e 
            sem barreiras.
          </Paragraph>
          
          <Paragraph>
            Explore nossos recursos acessíveis e junte-se à nossa missão de tornar os serviços e produtos 
            saúde mais acessíveis!
          </Paragraph>
          
          <FinalParagraph>
            Obrigada pela sua visita!
          </FinalParagraph>
        </div>
      </MainContent>
    </PageWrapper>
  );
}