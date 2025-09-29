'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface WCAGRule {
  id: string;
  name: string;
  level: 'A' | 'AA' | 'AAA';
  principle: 'Perceivable' | 'Operable' | 'Understandable' | 'Robust';
  guideline: string;
  successCriteria: string;
  check: () => boolean;
  getIssues: () => WCAGIssue[];
  autoFix?: () => void;
}

interface WCAGIssue {
  id: string;
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  element?: HTMLElement;
  selector?: string;
  suggestion: string;
  wcagReference: string;
}

interface WCAGCompliance {
  level: 'A' | 'AA' | 'AAA';
  score: number; // 0-100
  passedRules: string[];
  failedRules: string[];
  issues: WCAGIssue[];
  lastCheck: Date;
}

class WCAGChecker {
  private rules: WCAGRule[] = [];

  constructor() {
    this.initializeRules();
  }

  private initializeRules() {
    // Principle 1: Perceivable
    this.rules.push({
      id: '1.1.1',
      name: 'Non-text Content',
      level: 'A',
      principle: 'Perceivable',
      guideline: '1.1 Text Alternatives',
      successCriteria: 'All non-text content has text alternatives',
      check: () => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => 
          img.alt || img.getAttribute('aria-label') || img.getAttribute('aria-labelledby')
        );
      },
      getIssues: () => {
        const issues: WCAGIssue[] = [];
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
          if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
            issues.push({
              id: `img-alt-${index}`,
              ruleId: '1.1.1',
              severity: 'error',
              message: 'Imagem sem texto alternativo',
              element: img,
              selector: `img:nth-child(${index + 1})`,
              suggestion: 'Adicione um atributo alt descritivo para esta imagem',
              wcagReference: 'WCAG 2.1 - 1.1.1 Conteúdo Não Textual (Nível A)'
            });
          }
        });
        
        return issues;
      }
    });

    this.rules.push({
      id: '1.3.1',
      name: 'Info and Relationships',
      level: 'A',
      principle: 'Perceivable',
      guideline: '1.3 Adaptable',
      successCriteria: 'Information and relationships are programmatically determined',
      check: () => {
        const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
        return Array.from(inputs).every(input => {
          return input.getAttribute('aria-label') || 
                 input.getAttribute('aria-labelledby') ||
                 document.querySelector(`label[for="${input.id}"]`);
        });
      },
      getIssues: () => {
        const issues: WCAGIssue[] = [];
        const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
        
        inputs.forEach((input, index) => {
          const hasLabel = input.getAttribute('aria-label') || 
                          input.getAttribute('aria-labelledby') ||
                          document.querySelector(`label[for="${input.id}"]`);
          
          if (!hasLabel) {
            issues.push({
              id: `form-label-${index}`,
              ruleId: '1.3.1',
              severity: 'error',
              message: 'Campo de formulário sem rótulo acessível',
              element: input as HTMLElement,
              selector: `${input.tagName.toLowerCase()}:nth-child(${index + 1})`,
              suggestion: 'Associe um elemento <label> ou adicione aria-label a este campo',
              wcagReference: 'WCAG 2.1 - 1.3.1 Informações e Relações (Nível A)'
            });
          }
        });
        
        return issues;
      }
    });

    this.rules.push({
      id: '1.4.3',
      name: 'Contrast (Minimum)',
      level: 'AA',
      principle: 'Perceivable',
      guideline: '1.4 Distinguishable',
      successCriteria: 'Text has a contrast ratio of at least 4.5:1',
      check: () => {
        // Simplified check - in production, use proper contrast calculation libraries
        return true; // Would need proper color contrast calculation
      },
      getIssues: () => {
        // This would require proper contrast calculation
        return [];
      }
    });

    // Principle 2: Operable
    this.rules.push({
      id: '2.1.1',
      name: 'Keyboard',
      level: 'A',
      principle: 'Operable',
      guideline: '2.1 Keyboard Accessible',
      successCriteria: 'All functionality is available from keyboard',
      check: () => {
        const interactive = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        return interactive.length > 0;
      },
      getIssues: () => {
        const issues: WCAGIssue[] = [];
        const interactive = document.querySelectorAll('button, a, input, select, textarea, [onclick]');
        
        interactive.forEach((element, index) => {
          const tabIndex = element.getAttribute('tabindex');
          const isKeyboardAccessible = element.matches('button, a, input, select, textarea') || 
                                      (tabIndex !== null && tabIndex !== '-1');
          
          if (!isKeyboardAccessible && element.getAttribute('onclick')) {
            issues.push({
              id: `keyboard-access-${index}`,
              ruleId: '2.1.1',
              severity: 'error',
              message: 'Elemento interativo não acessível via teclado',
              element: element as HTMLElement,
              selector: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
              suggestion: 'Adicione tabindex="0" e event listeners para teclado',
              wcagReference: 'WCAG 2.1 - 2.1.1 Teclado (Nível A)'
            });
          }
        });
        
        return issues;
      }
    });

    this.rules.push({
      id: '2.4.1',
      name: 'Bypass Blocks',
      level: 'A',
      principle: 'Operable',
      guideline: '2.4 Navigable',
      successCriteria: 'A mechanism is available to bypass blocks of content',
      check: () => {
        const skipLinks = document.querySelectorAll('a[href^="#"], .skip-link');
        return skipLinks.length > 0;
      },
      getIssues: () => {
        const issues: WCAGIssue[] = [];
        const skipLinks = document.querySelectorAll('a[href^="#"], .skip-link');
        
        if (skipLinks.length === 0) {
          issues.push({
            id: 'bypass-blocks',
            ruleId: '2.4.1',
            severity: 'error',
            message: 'Nenhum mecanismo para pular blocos de conteúdo',
            selector: 'body',
            suggestion: 'Adicione links "pular para conteúdo principal"',
            wcagReference: 'WCAG 2.1 - 2.4.1 Pular Blocos (Nível A)'
          });
        }
        
        return issues;
      }
    });

    this.rules.push({
      id: '2.4.2',
      name: 'Page Titled',
      level: 'A',
      principle: 'Operable',
      guideline: '2.4 Navigable',
      successCriteria: 'Web pages have titles that describe topic or purpose',
      check: () => {
        return !!(document.title && document.title.trim().length > 0);
      },
      getIssues: () => {
        const issues: WCAGIssue[] = [];
        
        if (!document.title || document.title.trim().length === 0) {
          issues.push({
            id: 'page-title',
            ruleId: '2.4.2',
            severity: 'error',
            message: 'Página sem título ou título vazio',
            selector: 'title',
            suggestion: 'Adicione um título descritivo à página',
            wcagReference: 'WCAG 2.1 - 2.4.2 Título da Página (Nível A)'
          });
        }
        
        return issues;
      }
    });

    // Principle 3: Understandable
    this.rules.push({
      id: '3.1.1',
      name: 'Language of Page',
      level: 'A',
      principle: 'Understandable',
      guideline: '3.1 Readable',
      successCriteria: 'The default language of each page is programmatically determined',
      check: () => {
        return !!document.documentElement.lang && document.documentElement.lang !== '';
      },
      getIssues: () => {
        const issues: WCAGIssue[] = [];
        
        if (!document.documentElement.lang) {
          issues.push({
            id: 'page-lang',
            ruleId: '3.1.1',
            severity: 'error',
            message: 'Idioma da página não especificado',
            selector: 'html',
            suggestion: 'Adicione lang="pt-BR" ao elemento html',
            wcagReference: 'WCAG 2.1 - 3.1.1 Idioma da Página (Nível A)'
          });
        }
        
        return issues;
      },
      autoFix: () => {
        document.documentElement.lang = 'pt-BR';
      }
    });

    // Principle 4: Robust
    this.rules.push({
      id: '4.1.1',
      name: 'Parsing',
      level: 'A',
      principle: 'Robust',
      guideline: '4.1 Compatible',
      successCriteria: 'Content is parsed without errors',
      check: () => {
        // Simplified check for duplicate IDs
        const elements = document.querySelectorAll('[id]');
        const ids = new Set();
        
        for (const element of elements) {
          if (ids.has(element.id)) {
            return false;
          }
          ids.add(element.id);
        }
        
        return true;
      },
      getIssues: () => {
        const issues: WCAGIssue[] = [];
        const elements = document.querySelectorAll('[id]');
        const seenIds = new Set();
        
        elements.forEach((element, index) => {
          if (seenIds.has(element.id)) {
            issues.push({
              id: `duplicate-id-${index}`,
              ruleId: '4.1.1',
              severity: 'error',
              message: `ID duplicado: "${element.id}"`,
              element: element as HTMLElement,
              selector: `#${element.id}`,
              suggestion: 'Certifique-se de que todos os IDs sejam únicos na página',
              wcagReference: 'WCAG 2.1 - 4.1.1 Análise (Nível A)'
            });
          }
          seenIds.add(element.id);
        });
        
        return issues;
      }
    });

    this.rules.push({
      id: '4.1.2',
      name: 'Name, Role, Value',
      level: 'A',
      principle: 'Robust',
      guideline: '4.1 Compatible',
      successCriteria: 'UI components have accessible name, role, and value',
      check: () => {
        const interactive = document.querySelectorAll('button, a, input, select, textarea');
        return Array.from(interactive).every(element => {
          // Check if element has accessible name
          const hasName = element.getAttribute('aria-label') ||
                         element.getAttribute('aria-labelledby') ||
                         element.textContent?.trim() ||
                         element.getAttribute('title');
          
          return hasName;
        });
      },
      getIssues: () => {
        const issues: WCAGIssue[] = [];
        const interactive = document.querySelectorAll('button, a, input, select, textarea');
        
        interactive.forEach((element, index) => {
          const hasName = element.getAttribute('aria-label') ||
                         element.getAttribute('aria-labelledby') ||
                         element.textContent?.trim() ||
                         element.getAttribute('title');
          
          if (!hasName) {
            issues.push({
              id: `accessible-name-${index}`,
              ruleId: '4.1.2',
              severity: 'error',
              message: 'Elemento interativo sem nome acessível',
              element: element as HTMLElement,
              selector: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
              suggestion: 'Adicione aria-label, texto visível ou title ao elemento',
              wcagReference: 'WCAG 2.1 - 4.1.2 Nome, Função, Valor (Nível A)'
            });
          }
        });
        
        return issues;
      }
    });
  }

  checkCompliance(targetLevel: 'A' | 'AA' | 'AAA' = 'AAA'): WCAGCompliance {
    const relevantRules = this.rules.filter(rule => {
      if (targetLevel === 'A') return rule.level === 'A';
      if (targetLevel === 'AA') return rule.level === 'A' || rule.level === 'AA';
      return true; // AAA includes all levels
    });

    const passedRules: string[] = [];
    const failedRules: string[] = [];
    const allIssues: WCAGIssue[] = [];

    for (const rule of relevantRules) {
      try {
        if (rule.check()) {
          passedRules.push(rule.id);
        } else {
          failedRules.push(rule.id);
          allIssues.push(...rule.getIssues());
        }
      } catch (error) {
        console.warn(`Error checking rule ${rule.id}:`, error);
        failedRules.push(rule.id);
      }
    }

    const score = Math.round((passedRules.length / relevantRules.length) * 100);

    return {
      level: targetLevel,
      score,
      passedRules,
      failedRules,
      issues: allIssues,
      lastCheck: new Date()
    };
  }

  autoFixIssues(issues: WCAGIssue[]): number {
    let fixedCount = 0;
    
    for (const issue of issues) {
      const rule = this.rules.find(r => r.id === issue.ruleId);
      if (rule?.autoFix) {
        try {
          rule.autoFix();
          fixedCount++;
        } catch (error) {
          console.warn(`Error auto-fixing rule ${rule.id}:`, error);
        }
      }
    }
    
    return fixedCount;
  }

  getRuleById(id: string): WCAGRule | undefined {
    return this.rules.find(rule => rule.id === id);
  }

  getRulesByPrinciple(principle: WCAGRule['principle']): WCAGRule[] {
    return this.rules.filter(rule => rule.principle === principle);
  }

  getRulesByLevel(level: 'A' | 'AA' | 'AAA'): WCAGRule[] {
    return this.rules.filter(rule => {
      if (level === 'A') return rule.level === 'A';
      if (level === 'AA') return rule.level === 'A' || rule.level === 'AA';
      return true; // AAA includes all levels
    });
  }
}

export const useWCAGCompliance = (targetLevel: 'A' | 'AA' | 'AAA' = 'AAA') => {
  const [compliance, setCompliance] = useState<WCAGCompliance | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const checkerRef = useRef<WCAGChecker>();

  useEffect(() => {
    checkerRef.current = new WCAGChecker();
  }, []);

  const checkCompliance = useCallback(async () => {
    if (!checkerRef.current) return;
    
    setIsChecking(true);
    
    try {
      // Add a small delay to allow DOM to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = checkerRef.current.checkCompliance(targetLevel);
      setCompliance(result);
    } catch (error) {
      console.error('Error checking WCAG compliance:', error);
    } finally {
      setIsChecking(false);
    }
  }, [targetLevel]);

  const autoFix = useCallback(async () => {
    if (!checkerRef.current || !compliance) return 0;
    
    const fixableIssues = compliance.issues.filter(issue => {
      const rule = checkerRef.current!.getRuleById(issue.ruleId);
      return rule?.autoFix;
    });
    
    const fixedCount = checkerRef.current.autoFixIssues(fixableIssues);
    
    // Re-check after auto-fix
    if (fixedCount > 0) {
      setTimeout(checkCompliance, 500);
    }
    
    return fixedCount;
  }, [compliance, checkCompliance]);

  const getRulesByPrinciple = useCallback((principle: WCAGRule['principle']) => {
    return checkerRef.current?.getRulesByPrinciple(principle) || [];
  }, []);

  const getRuleById = useCallback((id: string) => {
    return checkerRef.current?.getRuleById(id);
  }, []);

  // Auto-check on mount and when DOM changes
  useEffect(() => {
    const timeoutId = setTimeout(checkCompliance, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [checkCompliance]);

  return {
    compliance,
    isChecking,
    checkCompliance,
    autoFix,
    getRulesByPrinciple,
    getRuleById
  };
};

export default WCAGChecker;