'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '../../logo.png';
import styled from 'styled-components';

// Definindo os componentes estilizados

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const HeaderSubtitle = styled.h2`
  font-size: 1.8rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Navigation = styled.nav`
  width: 100%;
  background-color: #FFB6F3;
  padding: 1rem;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 4rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavLink = styled(Link)`
  color: #2A1B5D;
  background: none;
  border: none;
  font-size: 1.2rem;
  text-decoration: none;
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <HeaderTop>
        <LogoWrapper>
          <Image 
            src={logo} 
            alt="Aproxima Logo" 
            width={60}
            height={60}
          />
          <div>
            <HeaderTitle>Aproxima</HeaderTitle>
            <HeaderSubtitle>Saúde Inclusiva</HeaderSubtitle>
          </div>
        </LogoWrapper>
      </HeaderTop>

      <Navigation>
        <NavList>
          <li>
            <NavLink href="/quem-somos">Quem somos</NavLink>
          </li>
          <li>
            <NavLink href="/produtos-acessiveis">Produtos acessíveis</NavLink>
          </li>
          <li>
            <NavLink href="/area-do-profissional">Área do profissional</NavLink>
          </li>
          <li>
            <NavLink href="/contato">Contato</NavLink>
          </li>
        </NavList>
      </Navigation>
    </HeaderWrapper>
  );
}
