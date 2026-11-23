'use client';

import { Accessibility, Ban, TriangleAlert, Info, RefreshCw, Search, CheckCircle2, Wrench, X } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { useLiveRegion } from './LiveRegion';

interface AccessibilityFeedbackProps {
  className?: string;
}

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
  autoFixable: boolean;
  suggestion: string;
}

const AccessibilityFeedback: React.FC<AccessibilityFeedbackProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { announce, announceError, announceSuccess } = useLiveRegion();

  // Scan for accessibility issues
  const scanForIssues = () => {
    setIsScanning(true);
    const foundIssues: AccessibilityIssue[] = [];

    // Check for missing alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
        foundIssues.push({
          id: `img-alt-${index}`,
          type: 'error',
          message: 'Imagem sem texto alternativo',
          element: `<img> #${index + 1}`,
          wcagLevel: 'A',
          wcagCriteria: '1.1.1 - Conteúdo Não Textual',
          autoFixable: false,
          suggestion: 'Adicione um atributo alt descritivo ou aria-label para esta imagem'
        });
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const inputElement = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const hasLabel = inputElement.getAttribute('aria-label') || 
                      inputElement.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${inputElement.id}"]`);
      
      const inputType = 'type' in inputElement ? inputElement.type : '';
      if (!hasLabel && inputType !== 'hidden') {
        foundIssues.push({
          id: `input-label-${index}`,
          type: 'error',
          message: 'Campo de formulário sem rótulo',
          element: `<${inputElement.tagName.toLowerCase()}> #${index + 1}`,
          wcagLevel: 'A',
          wcagCriteria: '1.3.1 - Informações e Relações',
          autoFixable: false,
          suggestion: 'Associe um elemento <label> ou adicione aria-label a este campo'
        });
      }
    });

    // Check for headings sequence
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel > previousLevel + 1) {
        foundIssues.push({
          id: `heading-sequence-${index}`,
          type: 'warning',
          message: 'Sequência de cabeçalhos incorreta',
          element: `<${heading.tagName.toLowerCase()}> #${index + 1}`,
          wcagLevel: 'AA',
          wcagCriteria: '1.3.1 - Informações e Relações',
          autoFixable: false,
          suggestion: `Este ${heading.tagName} pula níveis. Use uma sequência lógica de cabeçalhos`
        });
      }
      previousLevel = currentLevel;
    });

    // Check for low contrast (simplified check)
    const elements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
    elements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // This is a simplified contrast check - in production, use proper contrast calculation
      if (color === 'rgb(128, 128, 128)' || color === 'gray') {
        foundIssues.push({
          id: `low-contrast-${index}`,
          type: 'warning',
          message: 'Possível baixo contraste de cor',
          element: `<${element.tagName.toLowerCase()}> #${index + 1}`,
          wcagLevel: 'AA',
          wcagCriteria: '1.4.3 - Contraste (Mínimo)',
          autoFixable: true,
          suggestion: 'Verifique se o contraste atende ao mínimo de 4.5:1 para texto normal'
        });
      }
    });

    // Check for missing language attribute
    const htmlElement = document.documentElement;
    if (!htmlElement.lang) {
      foundIssues.push({
        id: 'missing-lang',
        type: 'error',
        message: 'Atributo de idioma ausente',
        element: '<html>',
        wcagLevel: 'A',
        wcagCriteria: '3.1.1 - Idioma da Página',
        autoFixable: true,
        suggestion: 'Adicione lang="pt-BR" ao elemento <html>'
      });
    }

    // Check for missing page title
    const title = document.title;
    if (!title || title.trim().length === 0) {
      foundIssues.push({
        id: 'missing-title',
        type: 'error',
        message: 'Título da página ausente ou vazio',
        element: '<title>',
        wcagLevel: 'A',
        wcagCriteria: '2.4.2 - Título da Página',
        autoFixable: false,
        suggestion: 'Adicione um título descritivo à página'
      });
    }

    // Check for keyboard trap
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) {
      foundIssues.push({
        id: 'no-focusable-elements',
        type: 'warning',
        message: 'Nenhum elemento focável encontrado',
        element: 'Página',
        wcagLevel: 'A',
        wcagCriteria: '2.1.1 - Teclado',
        autoFixable: false,
        suggestion: 'Certifique-se de que todos os elementos interativos sejam acessíveis via teclado'
      });
    }

    // Check for proper landmark roles
    const main = document.querySelector('main, [role="main"]');
    const nav = document.querySelector('nav, [role="navigation"]');
    const header = document.querySelector('header, [role="banner"]');
    
    if (!main) {
      foundIssues.push({
        id: 'missing-main',
        type: 'error',
        message: 'Região principal (main) ausente',
        element: 'Página',
        wcagLevel: 'A',
        wcagCriteria: '1.3.1 - Informações e Relações',
        autoFixable: false,
        suggestion: 'Adicione um elemento <main> ou role="main" ao conteúdo principal'
      });
    }

    setIssues(foundIssues);
    setIsScanning(false);
    setLastScanTime(new Date());

    // Announce results
    const errorCount = foundIssues.filter(issue => issue.type === 'error').length;
    const warningCount = foundIssues.filter(issue => issue.type === 'warning').length;
    
    if (errorCount > 0) {
      announceError(`Escaneamento concluído: ${errorCount} erros e ${warningCount} avisos encontrados`);
    } else {
      announceSuccess(`Escaneamento concluído: ${warningCount} avisos encontrados`);
    }
  };

  // Auto-fix issues where possible
  const autoFixIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue || !issue.autoFixable) return;

    try {
      switch (issueId) {
        case 'missing-lang':
          document.documentElement.lang = 'pt-BR';
          announceSuccess('Atributo de idioma adicionado automaticamente');
          break;
          
        default:
          announce('Correção automática não disponível para este item');
      }
      
      // Re-scan after auto-fix
      setTimeout(scanForIssues, 500);
    } catch (error) {
      announceError('Erro ao aplicar correção automática');
    }
  };

  const openDialog = () => {
    setIsOpen(true);
    setTimeout(() => {
      dialogRef.current?.focus();
    }, 100);
    announce('Painel de feedback de acessibilidade aberto');
  };

  const closeDialog = () => {
    setIsOpen(false);
    announce('Painel de feedback de acessibilidade fechado');
  };

  // Auto-scan on component mount
  useEffect(() => {
    const timer = setTimeout(scanForIssues, 2000);
    return () => clearTimeout(timer);
  }, []);

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error': return <Ban className="h-5 w-5" aria-hidden="true" />;
      case 'warning': return <TriangleAlert className="h-5 w-5" aria-hidden="true" />;
      case 'info': return <Info className="h-5 w-5" aria-hidden="true" />;
    }
  };

  const getIssueColor = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={openDialog}
        className={`
          fixed bottom-4 right-4 z-50 p-4 rounded-full shadow-lg
          bg-blue-600 hover:bg-blue-700 text-white
          focus:outline-none focus:ring-4 focus:ring-blue-500/30
          transition-all duration-200 transform hover:scale-105
          ${className}
        `}
        title="Abrir feedback de acessibilidade"
        aria-label={`Feedback de acessibilidade: ${errorCount} erros, ${warningCount} avisos`}
      >
        <div className="flex items-center gap-2">
          <Accessibility className="h-6 w-6" aria-hidden="true" />
          {(errorCount > 0 || warningCount > 0) && (
            <div className="flex gap-1">
              {errorCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {errorCount}
                </span>
              )}
              {warningCount > 0 && (
                <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {warningCount}
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Dialog */}
      {isOpen && (
        <dialog
          ref={dialogRef}
          open
          className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          aria-modal="true"
          aria-labelledby="accessibility-feedback-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <header className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 id="accessibility-feedback-title" className="text-2xl font-bold text-gray-900">
                  Feedback de Acessibilidade
                </h2>
                <p className="text-gray-600 mt-1">
                  Verificação automática de acessibilidade - {issues.length} itens encontrados
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scanForIssues}
                  disabled={isScanning}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  aria-label="Escanear novamente"
                >
                  {isScanning ? <RefreshCw className="mr-2 inline h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="mr-2 inline h-4 w-4" aria-hidden="true" />} {isScanning ? 'Escaneando...' : 'Escanear'}
                </button>
                <button
                  onClick={closeDialog}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  aria-label="Fechar painel"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-auto p-6">
              {isScanning ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin" aria-hidden="true" />
                    <p className="text-gray-600">Escaneando página...</p>
                  </div>
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    Parabéns! Nenhum problema encontrado
                  </h3>
                  <p className="text-gray-600">
                    Esta verificação automática não encontrou problemas. A avaliação manual continua necessária.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold mb-2">Resumo</h3>
                    <div className="flex gap-4 text-sm">
                      <span className="text-red-600"><Ban className="mr-1 inline h-4 w-4" aria-hidden="true" /> {errorCount} Erros</span>
                      <span className="text-yellow-600"><TriangleAlert className="mr-1 inline h-4 w-4" aria-hidden="true" /> {warningCount} Avisos</span>
                      {lastScanTime && (
                        <span className="text-gray-500">
                          Última verificação: {lastScanTime.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Issues list */}
                  <div className="space-y-3">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-4 rounded-lg border-l-4 ${getIssueColor(issue.type)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getIssueIcon(issue.type)}</span>
                              <h4 className="font-bold">{issue.message}</h4>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                WCAG {issue.wcagLevel}
                              </span>
                            </div>
                            <p className="text-sm mb-2">
                              <strong>Elemento:</strong> {issue.element}
                            </p>
                            <p className="text-sm mb-2">
                              <strong>Critério:</strong> {issue.wcagCriteria}
                            </p>
                            <p className="text-sm">
                              <strong>Sugestão:</strong> {issue.suggestion}
                            </p>
                          </div>
                          {issue.autoFixable && (
                            <button
                              onClick={() => autoFixIssue(issue.id)}
                              className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              title="Corrigir automaticamente"
                            >
                              <Wrench className="mr-1 inline h-4 w-4" aria-hidden="true" /> Corrigir
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* Footer */}
            <footer className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p>Baseado nas Diretrizes WCAG 2.1 AAA</p>
                  <p>Para mais informações: <a href="https://www.w3c.br/traducoes/wcag/wcag21-pt-BR/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">WCAG 2.1 PT-BR</a></p>
                </div>
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Fechar
                </button>
              </div>
            </footer>
          </div>
        </dialog>
      )}
    </>
  );
};

export default AccessibilityFeedback;