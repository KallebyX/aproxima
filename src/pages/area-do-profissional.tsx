'use client';

import Header from './Header';
import styled from 'styled-components';

const DownloadButton = styled.a`
  background-color: #FFB6F3;
  color: #2A1B5D;
  padding: 1.5rem;
  border-radius: 1rem;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  transition: opacity 0.2s;
  display: block;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #2A1B5D;
  color: #FFB6F3;
  font-family: system-ui, sans-serif;
  display: flex;
  flex-direction: column;
`;

export default function SecaoProfissionais() {
  const links = [
    {
      text: 'Datas das consultas',
      href: 'https://drive.google.com/uc?export=download&id=1LkHiWZZqKEaI9ahhxWpJPqdvqdcKIwdd',
    },
    {
      text: 'Resultados dos exames',
      href: 'https://drive.google.com/uc?export=download&id=10uZzTLyxaLDaO_h5M9AcfbN2OWaFYMlq',
    },
    {
      text: 'Datas das consultas odontológicas',
      href: 'https://drive.google.com/uc?export=download&id=1HggA1f6QZQaMpUg7smXaVJK_VnRmVNkx',
    },
    {
      text: 'Pré-natal do parceiro',
      href: 'https://drive.google.com/uc?export=download&id=1wbzAKCqOFMlHOMD-7QFWB5SsN573xm8W',
    },
  ];

  return (
    <PageWrapper>
      <Header />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          gap: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Seção dos profissionais
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {links.map((link, index) => (
            <DownloadButton
              key={index}
              href={link.href}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text}
            </DownloadButton>
          ))}
        </div>
      </main>
    </PageWrapper>
  );
}
