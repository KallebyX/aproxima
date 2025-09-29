'use client';

import { useEffect, useState } from 'react';

interface HTMLValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: HTMLElement;
  selector?: string;
  wcagImpact: 'critical' | 'serious' | 'moderate' | 'minor';
  suggestion: string;
}

interface RobustnessCheck {
  name: string;
  description: string;
  check: () => HTMLValidationIssue[];
}

class HTMLRobustnessValidator {
  private checks: RobustnessCheck[] = [];

  constructor() {
    this.initializeChecks();
  }

  private initializeChecks() {
    // Check for duplicate IDs
    this.checks.push({
      name: 'Unique IDs',
      description: 'Verify all ID attributes are unique',
      check: () => {
        const issues: HTMLValidationIssue[] = [];
        const elements = document.querySelectorAll('[id]');
        const seenIds = new Map<string, HTMLElement>();

        elements.forEach((element, index) => {
          const id = element.id;
          if (seenIds.has(id)) {
            issues.push({
              id: `duplicate-id-${index}`,
              type: 'error',
              message: `ID duplicado encontrado: "${id}"`,
              element: element as HTMLElement,
              selector: `#${id}`,
              wcagImpact: 'serious',
              suggestion: 'Certifique-se de que todos os IDs sejam únicos na página para garantir compatibilidade com tecnologias assistivas'
            });
          } else {
            seenIds.set(id, element as HTMLElement);
          }
        });

        return issues;
      }
    });

    // Check for valid HTML nesting
    this.checks.push({
      name: 'Valid HTML Nesting',
      description: 'Check for proper HTML element nesting',
      check: () => {
        const issues: HTMLValidationIssue[] = [];
        
        // Check for buttons inside buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button, index) => {
          const nestedButton = button.querySelector('button');
          if (nestedButton) {
            issues.push({
              id: `nested-button-${index}`,
              type: 'error',
              message: 'Botão aninhado dentro de outro botão',
              element: button as HTMLElement,
              selector: `button:nth-child(${index + 1})`,
              wcagImpact: 'serious',
              suggestion: 'Remova botões aninhados - use div ou span com event handlers apropriados'
            });
          }
        });

        // Check for links inside links
        const links = document.querySelectorAll('a[href]');
        links.forEach((link, index) => {
          const nestedLink = link.querySelector('a[href]');
          if (nestedLink) {
            issues.push({
              id: `nested-link-${index}`,
              type: 'error',
              message: 'Link aninhado dentro de outro link',
              element: link as HTMLElement,
              selector: `a:nth-child(${index + 1})`,
              wcagImpact: 'serious',
              suggestion: 'Remova links aninhados - use apenas um link por elemento'
            });
          }
        });

        return issues;
      }
    });

    // Check for proper form labeling
    this.checks.push({
      name: 'Form Controls',
      description: 'Verify all form controls have accessible names',
      check: () => {
        const issues: HTMLValidationIssue[] = [];
        const formControls = document.querySelectorAll('input, textarea, select');
        
        formControls.forEach((control, index) => {
          const input = control as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          const inputType = 'type' in input ? input.type : '';
          
          if (inputType === 'hidden') return;

          const hasLabel = input.getAttribute('aria-label') ||
                          input.getAttribute('aria-labelledby') ||
                          input.getAttribute('title') ||
                          document.querySelector(`label[for="${input.id}"]`);

          if (!hasLabel) {
            issues.push({
              id: `unlabeled-control-${index}`,
              type: 'error',
              message: 'Controle de formulário sem rótulo acessível',
              element: input as HTMLElement,
              selector: `${input.tagName.toLowerCase()}:nth-child(${index + 1})`,
              wcagImpact: 'critical',
              suggestion: 'Adicione uma label associada, aria-label ou aria-labelledby ao controle'
            });
          }
        });

        return issues;
      }
    });

    // Check for proper heading hierarchy
    this.checks.push({
      name: 'Heading Hierarchy',
      description: 'Verify logical heading structure',
      check: () => {
        const issues: HTMLValidationIssue[] = [];
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        
        let previousLevel = 0;
        headings.forEach((heading, index) => {
          const currentLevel = parseInt(heading.tagName.charAt(1));
          
          if (index === 0 && currentLevel !== 1) {
            issues.push({
              id: `first-heading-${index}`,
              type: 'warning',
              message: 'Primeiro cabeçalho da página não é h1',
              element: heading as HTMLElement,
              selector: heading.tagName.toLowerCase(),
              wcagImpact: 'moderate',
              suggestion: 'A página deve começar com um elemento h1 para melhor estrutura semântica'
            });
          }

          if (currentLevel > previousLevel + 1) {
            issues.push({
              id: `heading-skip-${index}`,
              type: 'warning',
              message: `Cabeçalho ${heading.tagName} pula níveis hierárquicos`,
              element: heading as HTMLElement,
              selector: `${heading.tagName.toLowerCase()}:nth-child(${index + 1})`,
              wcagImpact: 'moderate',
              suggestion: `Use uma sequência lógica de cabeçalhos. Após h${previousLevel}, use h${previousLevel + 1}`
            });
          }

          previousLevel = currentLevel;
        });

        return issues;
      }
    });

    // Check for ARIA attributes validity
    this.checks.push({
      name: 'ARIA Validity',
      description: 'Check for proper ARIA usage',
      check: () => {
        const issues: HTMLValidationIssue[] = [];
        
        // Check for elements with aria-labelledby pointing to non-existent elements
        const elementsWithLabelledBy = document.querySelectorAll('[aria-labelledby]');
        elementsWithLabelledBy.forEach((element, index) => {
          const labelledBy = element.getAttribute('aria-labelledby');
          if (labelledBy) {
            const ids = labelledBy.split(' ');
            ids.forEach(id => {
              if (!document.getElementById(id.trim())) {
                issues.push({
                  id: `invalid-labelledby-${index}`,
                  type: 'error',
                  message: `aria-labelledby referencia ID inexistente: "${id}"`,
                  element: element as HTMLElement,
                  selector: `[aria-labelledby="${labelledBy}"]`,
                  wcagImpact: 'serious',
                  suggestion: 'Certifique-se de que todos os IDs referenciados em aria-labelledby existam na página'
                });
              }
            });
          }
        });

        // Check for elements with aria-describedby pointing to non-existent elements
        const elementsWithDescribedBy = document.querySelectorAll('[aria-describedby]');
        elementsWithDescribedBy.forEach((element, index) => {
          const describedBy = element.getAttribute('aria-describedby');
          if (describedBy) {
            const ids = describedBy.split(' ');
            ids.forEach(id => {
              if (!document.getElementById(id.trim())) {
                issues.push({
                  id: `invalid-describedby-${index}`,
                  type: 'error',
                  message: `aria-describedby referencia ID inexistente: "${id}"`,
                  element: element as HTMLElement,
                  selector: `[aria-describedby="${describedBy}"]`,
                  wcagImpact: 'serious',
                  suggestion: 'Certifique-se de que todos os IDs referenciados em aria-describedby existam na página'
                });
              }
            });
          }
        });

        return issues;
      }
    });

    // Check for keyboard accessibility
    this.checks.push({
      name: 'Keyboard Accessibility',
      description: 'Verify interactive elements are keyboard accessible',
      check: () => {
        const issues: HTMLValidationIssue[] = [];
        const interactiveElements = document.querySelectorAll('[onclick], [onmousedown], [onmouseup]');
        
        interactiveElements.forEach((element, index) => {
          const isNativelyFocusable = element.matches('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          
          if (!isNativelyFocusable) {
            const hasTabIndex = element.hasAttribute('tabindex');
            const hasKeyHandlers = element.hasAttribute('onkeydown') || element.hasAttribute('onkeyup');
            
            if (!hasTabIndex || !hasKeyHandlers) {
              issues.push({
                id: `keyboard-inaccessible-${index}`,
                type: 'error',
                message: 'Elemento interativo não acessível via teclado',
                element: element as HTMLElement,
                selector: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
                wcagImpact: 'critical',
                suggestion: 'Adicione tabindex="0" e event handlers para teclado (onkeydown/onkeyup) ou use elementos nativamente focáveis'
              });
            }
          }
        });

        return issues;
      }
    });

    // Check for color contrast (basic check)
    this.checks.push({
      name: 'Basic Color Contrast',
      description: 'Basic color contrast validation',
      check: () => {
        const issues: HTMLValidationIssue[] = [];
        const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, li, td, th');
        
        textElements.forEach((element, index) => {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          // Simple check for very light gray text (potential low contrast)
          if (color.includes('rgb(169, 169, 169)') || color.includes('#a9a9a9') || color === 'lightgray') {
            issues.push({
              id: `low-contrast-${index}`,
              type: 'warning',
              message: 'Possível baixo contraste de cor detectado',
              element: element as HTMLElement,
              selector: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
              wcagImpact: 'moderate',
              suggestion: 'Verifique se o contraste atende ao mínimo de 4.5:1 para texto normal e 3:1 para texto grande'
            });
          }
        });

        return issues;
      }
    });
  }

  validateAll(): HTMLValidationIssue[] {
    const allIssues: HTMLValidationIssue[] = [];
    
    for (const check of this.checks) {
      try {
        const issues = check.check();
        allIssues.push(...issues);
      } catch (error) {
        console.warn(`Error running robustness check "${check.name}":`, error);
      }
    }

    return allIssues;
  }

  getCheckByName(name: string): RobustnessCheck | undefined {
    return this.checks.find(check => check.name === name);
  }

  getAllChecks(): RobustnessCheck[] {
    return [...this.checks];
  }
}

export const useHTMLRobustness = () => {
  const [validator] = useState(() => new HTMLRobustnessValidator());
  const [issues, setIssues] = useState<HTMLValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);

  const validateHTML = async () => {
    setIsValidating(true);
    
    try {
      // Allow DOM to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const foundIssues = validator.validateAll();
      setIssues(foundIssues);
      setLastValidation(new Date());
    } catch (error) {
      console.error('Error validating HTML robustness:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getIssuesBySeverity = (severity: HTMLValidationIssue['wcagImpact']) => {
    return issues.filter(issue => issue.wcagImpact === severity);
  };

  const getCriticalIssues = () => getIssuesBySeverity('critical');
  const getSeriousIssues = () => getIssuesBySeverity('serious');
  const getModerateIssues = () => getIssuesBySeverity('moderate');
  const getMinorIssues = () => getIssuesBySeverity('minor');

  const getOverallScore = (): number => {
    if (issues.length === 0) return 100;
    
    const totalChecks = validator.getAllChecks().length;
    const criticalWeight = 4;
    const seriousWeight = 3;
    const moderateWeight = 2;
    const minorWeight = 1;
    
    const criticalCount = getCriticalIssues().length;
    const seriousCount = getSeriousIssues().length;
    const moderateCount = getModerateIssues().length;
    const minorCount = getMinorIssues().length;
    
    const totalPenalty = (criticalCount * criticalWeight) + 
                        (seriousCount * seriousWeight) + 
                        (moderateCount * moderateWeight) + 
                        (minorCount * minorWeight);
    
    const maxPossiblePenalty = totalChecks * criticalWeight;
    const score = Math.max(0, Math.round(100 - (totalPenalty / maxPossiblePenalty) * 100));
    
    return score;
  };

  // Auto-validate on mount
  useEffect(() => {
    const timer = setTimeout(validateHTML, 1500);
    return () => clearTimeout(timer);
  }, []);

  return {
    issues,
    isValidating,
    lastValidation,
    validateHTML,
    getIssuesBySeverity,
    getCriticalIssues,
    getSeriousIssues,
    getModerateIssues,
    getMinorIssues,
    getOverallScore,
    validator
  };
};

export default HTMLRobustnessValidator;