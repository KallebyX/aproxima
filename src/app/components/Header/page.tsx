'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from 'react-router-dom';
import logo from '../../logo.png';
import styled from 'styled-components';

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
  text-decoration: none;
  font-size: 1.2rem;
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

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MobileMenuTitle = styled.h2`
  color: #2A1B5D;
  font-size: 1.5rem;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  color: #2A1B5D;
  font-size: 1rem;
  cursor: pointer;
`;

const MobileNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MobileNavItem = styled.li`
  margin-bottom: 1rem;
`;

const MobileNavLink = styled(Link)`
  color: #2A1B5D;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
`;

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HeaderWrapper>
      <HeaderTop>
        <LogoWrapper>
          <Image 
            src={logo} 
            alt="Aproxima Logo" 
            style={{
              width: '100%',
              height: 'auto'
            }}
          />
        </LogoWrapper>
        <HamburgerButton onClick={toggleMenu} aria-label="Toggle menu">
          ☰
        </HamburgerButton>
      </HeaderTop>

      <Navigation>
        <NavList>
          <li><NavLink to="/quem-somos">Quem somos</NavLink></li>
          <li><NavLink to="/produtos-acessiveis">Produtos acessíveis</NavLink></li>
          <li><NavLink to="/area-do-profissional">Área do profissional</NavLink></li>
          <li><NavLink to="/contato">Contato</NavLink></li>
        </NavList>
      </Navigation>

      {isMobileMenuOpen && (
        <MobileMenuOverlay>
          <MobileMenuContent>
            <MobileMenuHeader>
              <MobileMenuTitle>Menu</MobileMenuTitle>
              <CloseButton onClick={toggleMenu}>
                Fechar X
              </CloseButton>
            </MobileMenuHeader>
            <nav>
              <MobileNavList>
                <MobileNavItem>
                  <MobileNavLink to="/quem-somos" onClick={toggleMenu}>Quem somos</MobileNavLink>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileNavLink to="/produtos-acessiveis" onClick={toggleMenu}>Produtos acessíveis</MobileNavLink>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileNavLink to="/area-do-profissional" onClick={toggleMenu}>Área do profissional</MobileNavLink>
                </MobileNavItem>
                <MobileNavItem>
                  <MobileNavLink to="/contato" onClick={toggleMenu}>Contato</MobileNavLink>
                </MobileNavItem>
              </MobileNavList>
            </nav>
          </MobileMenuContent>
        </MobileMenuOverlay>
      )}
    </HeaderWrapper>
  );
}
