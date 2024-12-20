'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled, { createGlobalStyle } from 'styled-components';
import logo from './logo.png';

const GlobalStyle = createGlobalStyle`
  a, a:visited, a:hover, a:focus, a:active {
    text-decoration: none !important;
  }
`;

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  background-color: #2A1B5D;
  color: #FFB6F3;
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

  img {
    width: 20rem;
    height: auto;

    @media (max-width: 768px) {
      width: 12rem;
    }
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #FFB6F3;
  font-size: 2rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
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

const NavLink = styled.a`
  color: #2A1B5D;
  font-size: 1.2rem;
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  z-index: 1000;
`;

const MobileMenuContent = styled.div`
  background-color: #FFB6F3;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 300px;
`;

const MobileNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MobileNavItem = styled.li`
  margin-bottom: 1rem;
`;

const MobileNavLink = styled.a`
  color: #2A1B5D;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  
  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <GlobalStyle />
      <HeaderWrapper>
        <HeaderTop>
          <LogoWrapper>
            <Image 
              src={logo} 
              alt="Ilustração contendo um retângulo com fundo azul escuro. Do lado esquerdo temos um pássaro com asas abertas, sua cabeça está inclinada para cima. Ele está levantando voo. Do lado direito temos as palavras: aproxima saúde inclusiva." 
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </LogoWrapper>
          <HamburgerButton onClick={toggleMenu} aria-label="Toggle menu">
            ☰
          </HamburgerButton>
        </HeaderTop>

        <Navigation>
          <NavList>
            <li><Link href="/quem-somos" passHref><NavLink>Quem Somos</NavLink></Link></li>
            <li><Link href="/produtos-acessiveis" passHref><NavLink>Produtos Acessíveis</NavLink></Link></li>
            <li><Link href="/area-do-profissional" passHref><NavLink>Área do Profissional</NavLink></Link></li>
            <li><Link href="/gestante" passHref><NavLink>Área da gestante</NavLink></Link></li>
            <li><Link href="/contato" passHref><NavLink>Contato</NavLink></Link></li>
          </NavList>
        </Navigation>

        {isMobileMenuOpen && (
          <MobileMenuOverlay>
            <MobileMenuContent>
              <nav>
                <MobileNavList>
                  <MobileNavItem>
                    <Link href="/quem-somos" passHref>
                      <MobileNavLink onClick={toggleMenu}>Quem somos</MobileNavLink>
                    </Link>
                  </MobileNavItem>
                  <MobileNavItem>
                    <Link href="/produtos-acessiveis" passHref>
                      <MobileNavLink onClick={toggleMenu}>Produtos acessíveis</MobileNavLink>
                    </Link>
                  </MobileNavItem>
                  <MobileNavItem>
                    <Link href="/area-do-profissional" passHref>
                      <MobileNavLink onClick={toggleMenu}>Área do profissional</MobileNavLink>
                    </Link>
                  </MobileNavItem>
                  <MobileNavItem>
                    <Link href="/gestante" passHref>
                      <MobileNavLink onClick={toggleMenu}>Área da gestante</MobileNavLink>
                    </Link>
                  </MobileNavItem>
                  <MobileNavItem>
                    <Link href="/contato" passHref>
                      <MobileNavLink onClick={toggleMenu}>Contato</MobileNavLink>
                    </Link>
                  </MobileNavItem>
                </MobileNavList>
              </nav>
            </MobileMenuContent>
          </MobileMenuOverlay>
        )}
      </HeaderWrapper>
    </>
  );
}
