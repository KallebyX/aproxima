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
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

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

export default function SecaoGestante() {
  const links = [
    {
      text: 'Caderneta informativa',
      href: 'https://drive.google.com/uc?export=download&id=1sQVoncR0Cmok-T76zlN_gfbzWVr_6Wlo',
    },
    {
      text: 'Olha quem chegou!',
      href: 'https://drive.google.com/uc?export=download&id=1UqthxEXcB6u67oM9afs3_vDybHFtE3qB',
    },
  ];

  return (
    <PageWrapper>
      <Header />
      
      <MainContent>
        <h1
          style={{
            fontSize: '2rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Seção da gestante
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
      </MainContent>
    </PageWrapper>
  );
}
