'use client';

import { useEffect, useState } from 'react';

const SkipLinks = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Create live region for announcements if it doesn't exist
    if (!document.getElementById('live-region')) {
      if (typeof document !== 'undefined') {
        const liveRegion = document.createElement("div");
        liveRegion.id = "live-region";
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        liveRegion.className = "sr-only";
        document.body.appendChild(liveRegion);

        return () => {
          if (document.body.contains(liveRegion)) {
            document.body.removeChild(liveRegion);
          }
        };
      }
    }
  }, []);

  const announceNavigation = (targetName: string) => {
    if (typeof document !== 'undefined') {
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = `Navegando para ${targetName}`;
        
        // Clear after announcement
        setTimeout(() => {
          if (liveRegion) {
            liveRegion.textContent = '';
          }
        }, 1000);
      }
    }
  };

  const skipTo = (id: string, name: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Make element focusable if it's not
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '-1');
      }
      
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      announceNavigation(name);
      
      // Remove tabindex after focusing if we added it
      setTimeout(() => {
        if (element.getAttribute('tabindex') === '-1') {
          element.removeAttribute('tabindex');
        }
      }, 100);
    }
  };

  if (!mounted) return null;

  const skipLinks = [
    { href: '#main-content', id: 'main-content', name: 'conteúdo principal' },
    { href: '#main-navigation', id: 'main-navigation', name: 'menu de navegação' },
    { href: '#hero-heading', id: 'hero-heading', name: 'título principal' },
    { href: '#features-heading', id: 'features-heading', name: 'recursos' },
    { href: '#benefits-heading', id: 'benefits-heading', name: 'benefícios' },
    { href: '#access-heading', id: 'access-heading', name: 'área de acesso' }
  ];

  return (
    <div className="skip-links-container" style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}>
      {skipLinks.map((link, index) => (
        <a 
          key={index}
          href={link.href}
          className="skip-link"
          style={{ 
            left: `${8 + (index * 160)}px`,
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            e.preventDefault();
            skipTo(link.id, link.name);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              skipTo(link.id, link.name);
            }
          }}
        >
          Pular para {link.name}
        </a>
      ))}
    </div>
  );
};

export default SkipLinks;