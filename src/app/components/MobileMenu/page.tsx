'use client';

import React from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '2rem',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#FFB6F3',
        borderRadius: '1rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '300px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{
            color: '#2A1B5D',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}>
            Menu
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#2A1B5D',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Fechar X
          </button>
        </div>
        <nav>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {[
              { label: 'Quem somos', link: '/quem-somos' },
              { label: 'Produtos acessíveis', link: '/produtos-acessiveis' },
              { label: 'Área do profissional', link: '/area-do-profissional' },
              { label: 'Contato', link: '/contato' },
            ].map((item, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                <Link href={item.link} passHref>
                  <a
                    onClick={onClose}
                    style={{
                      color: '#2A1B5D',
                      textDecoration: 'none',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
