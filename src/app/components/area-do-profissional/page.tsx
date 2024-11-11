'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../logo.png';
import Link from 'next/link';
import Header from '../Header/page';
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
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Paragraph = styled.p`
  font-size: 1.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  resize: vertical;
  margin-top: 1rem;
`;

const CopyButton = styled.button`
  background-color: #FFB6F3;
  color: #2A1B5D;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  align-self: flex-end;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default function AreaProfissional() {
  const copyText = () => {
    const textArea = document.querySelector('textarea');
    if (textArea) {
      navigator.clipboard.writeText(textArea.value);
    }
  };

  return (
    <PageWrapper>
      <Header />

      <MainContent>
        <ContentWrapper>
          <Paragraph>
            Esta seção é destinada aos profissionais de saúde – médicos e dentistas – terem um melhor contato com seus pacientes.
          </Paragraph>

          <Paragraph>
            Abaixo, preencha as informações que serão enviadas ao seu paciente.
          </Paragraph>

          <Paragraph>
            Comece com seu nome, os dados do paciente e a data que foi realizada a consulta.
          </Paragraph>

          <Paragraph>
            Descreva os resultados do exame ou consulta de maneira clara e detalhada para o paciente ter entendimento.
          </Paragraph>

          <Paragraph>
            Coloque as orientações finais e a data da próxima consulta do seu paciente.
          </Paragraph>

          <Paragraph>
            Ao final, copie o texto pelo botão abaixo, abra seu e-mail, coloque as informações e envie-as para o e-mail de seu paciente.
          </Paragraph>

          <Textarea aria-label="Área de texto para informações do paciente" />

          <CopyButton onClick={copyText}>Copiar dados</CopyButton>
        </ContentWrapper>
      </MainContent>
    </PageWrapper>
  );
}
