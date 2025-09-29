'use client';

import { useEffect, useState } from 'react';

interface KeyboardNavigationProps {
  children: React.ReactNode;
}

const KeyboardNavigation = ({ children }: KeyboardNavigationProps) => {
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    // Detect keyboard users
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-user');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.classList.remove('keyboard-user');
    };

    // Update focusable elements list
    const updateFocusableElements = () => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ');

      const elements = Array.from(
        document.querySelectorAll(focusableSelectors)
      ) as HTMLElement[];
      
      setFocusableElements(elements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               !el.hasAttribute('hidden');
      }));
    };

    // Keyboard navigation handler
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Skip navigation - F6 key
      if (e.key === 'F6') {
        e.preventDefault();
        const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
        if (landmarks.length > 0) {
          const currentLandmark = Array.from(landmarks).findIndex(el => el.contains(document.activeElement));
          const nextIndex = (currentLandmark + 1) % landmarks.length;
          (landmarks[nextIndex] as HTMLElement).focus();
        }
      }

      // Quick access keys
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            (document.getElementById('main-navigation') as HTMLElement)?.focus();
            break;
          case '2':
            e.preventDefault();
            (document.getElementById('main-content') as HTMLElement)?.focus();
            break;
          case '3':
            e.preventDefault();
            (document.querySelector('input[type="search"]') as HTMLInputElement)?.focus();
            break;
          case '0':
            e.preventDefault();
            // Show accessibility help
            showAccessibilityHelp();
            break;
        }
      }

      // ESC key - close modals, dropdowns, etc.
      if (e.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        const modal = activeElement?.closest('[role="dialog"]');
        const dropdown = activeElement?.closest('[aria-expanded="true"]');
        
        if (modal) {
          const closeButton = modal.querySelector('[aria-label*="fechar"], [aria-label*="close"]') as HTMLElement;
          closeButton?.click();
        } else if (dropdown) {
          (dropdown as HTMLElement).click();
        }
      }

      // Arrow key navigation for menus
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const currentElement = document.activeElement as HTMLElement;
        const menu = currentElement?.closest('[role="menu"], [role="menubar"]');
        
        if (menu) {
          e.preventDefault();
          const menuItems = menu.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
          const currentIndex = Array.from(menuItems).indexOf(currentElement);
          
          if (e.key === 'ArrowDown') {
            const nextIndex = (currentIndex + 1) % menuItems.length;
            (menuItems[nextIndex] as HTMLElement)?.focus();
          } else {
            const prevIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
            (menuItems[prevIndex] as HTMLElement)?.focus();
          }
        }
      }
    };

    const showAccessibilityHelp = () => {
      const helpText = `
        Atalhos de Acessibilidade:
        
        • Alt + 1: Navegar para o menu principal
        • Alt + 2: Ir para o conteúdo principal
        • Alt + 3: Focar no campo de busca
        • F6: Pular entre marcos da página
        • ESC: Fechar modais e dropdowns
        • Setas: Navegar em menus
        • Tab: Navegar entre elementos
        
        Para mais informações sobre acessibilidade, pressione Alt + 0 novamente.
      `;
      
      const existingAlert = document.getElementById('accessibility-help');
      if (existingAlert) {
        existingAlert.remove();
      }

      const alertDiv = document.createElement('div');
      alertDiv.id = 'accessibility-help';
      alertDiv.setAttribute('role', 'alert');
      alertDiv.setAttribute('aria-live', 'assertive');
      alertDiv.className = 'fixed top-4 left-4 bg-black text-white p-4 rounded shadow-lg z-50 max-w-md text-sm';
      alertDiv.innerHTML = `
        <h3 class="font-bold mb-2">Ajuda de Acessibilidade</h3>
        <pre class="whitespace-pre-wrap font-mono text-xs">${helpText}</pre>
        <button onclick="this.parentElement.remove()" class="mt-2 bg-white text-black px-2 py-1 rounded text-xs">
          Fechar (ESC)
        </button>
      `;
      
      document.body.appendChild(alertDiv);
      
      // Auto remove after 10 seconds
      setTimeout(() => {
        if (document.body.contains(alertDiv)) {
          alertDiv.remove();
        }
      }, 10000);

      // Focus the close button
      const closeButton = alertDiv.querySelector('button') as HTMLElement;
      (closeButton as HTMLElement)?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleGlobalKeyDown);

    // Update focusable elements on DOM changes
    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['disabled', 'hidden', 'tabindex'] 
    });

    updateFocusableElements();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleGlobalKeyDown);
      observer.disconnect();
    };
  }, []);

  // Focus trap for modals
  useEffect(() => {
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement;
      if (!modal) return;

      const focusableInModal = modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (focusableInModal.length === 0) return;

      const firstFocusable = focusableInModal[0];
      const lastFocusable = focusableInModal[focusableInModal.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          (lastFocusable as HTMLElement).focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          (firstFocusable as HTMLElement).focus();
        }
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, []);

  return <>{children}</>;
};

export default KeyboardNavigation;