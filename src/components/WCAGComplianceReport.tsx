'use client';

import { ChartNoAxesCombined, Layers, TriangleAlert, Lightbulb, ClipboardCheck, Siren, Zap, RefreshCw, Search, Wrench, Check, CheckCircle2, Target, X } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { useWCAGCompliance } from '../hooks/useWCAGCompliance';
import { useHTMLRobustness } from '../hooks/useHTMLRobustness';
import { useLiveRegion } from './LiveRegion';

interface WCAGComplianceReportProps {
  className?: string;
}

const WCAGComplianceReport: React.FC<WCAGComplianceReportProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'principles' | 'issues' | 'recommendations'>('overview');
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  const { compliance, isChecking: wcagChecking, checkCompliance, autoFix } = useWCAGCompliance('AAA');
  const { 
    issues: htmlIssues, 
    isValidating, 
    validateHTML, 
    getCriticalIssues, 
    getSeriousIssues, 
    getModerateIssues, 
    getOverallScore 
  } = useHTMLRobustness();
  
  const { announce, announceSuccess, announceError } = useLiveRegion();

  const openReport = () => {
    setIsOpen(true);
    setTimeout(() => {
      dialogRef.current?.focus();
    }, 100);
    announce('Verificação automática de acessibilidade aberta');
  };

  const closeReport = () => {
    setIsOpen(false);
    announce('Relatório de conformidade WCAG fechado');
  };

  const runFullScan = async () => {
    announce('Iniciando escaneamento completo de conformidade WCAG');
    await Promise.all([
      checkCompliance(),
      validateHTML()
    ]);
    announceSuccess('Escaneamento de conformidade WCAG concluído');
  };

  const handleAutoFix = async () => {
    try {
      const fixedCount = await autoFix();
      if (fixedCount > 0) {
        announceSuccess(`${fixedCount} problemas corrigidos automaticamente`);
        // Re-scan after fixes
        setTimeout(runFullScan, 1000);
      } else {
        announce('Nenhum problema pode ser corrigido automaticamente');
      }
    } catch (error) {
      announceError('Erro ao aplicar correções automáticas');
    }
  };

  // Calculate overall compliance score
  const getOverallComplianceScore = (): number => {
    if (!compliance) return 0;
    
    const wcagScore = compliance.score;
    const htmlScore = getOverallScore();
    
    // Weight WCAG compliance more heavily
    return Math.round((wcagScore * 0.7) + (htmlScore * 0.3));
  };

  const getComplianceLevel = (score: number): { level: string; color: string; description: string } => {
    if (score >= 95) return {
      level: 'Alta',
      color: 'text-green-600 bg-green-50 border-green-200',
      description: 'Resultado alto nesta verificação automática'
    };
    if (score >= 85) return {
      level: 'Boa',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Resultado bom nesta verificação automática'
    };
    if (score >= 70) return {
      level: 'Média',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      description: 'Alguns pontos precisam de revisão'
    };
    if (score >= 50) return {
      level: 'Baixa',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      description: 'Vários pontos precisam de revisão'
    };
    return {
      level: 'Revisar',
      color: 'text-red-600 bg-red-50 border-red-200',
      description: 'Revisão de acessibilidade recomendada'
    };
  };

  const overallScore = getOverallComplianceScore();
  const complianceInfo = getComplianceLevel(overallScore);

  const criticalIssues = getCriticalIssues();
  const seriousIssues = getSeriousIssues();
  const moderateIssues = getModerateIssues();
  const totalIssues = htmlIssues.length + (compliance?.issues.length || 0);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: <ChartNoAxesCombined className="h-5 w-5" aria-hidden="true" /> },
    { id: 'principles', label: '4 Princípios WCAG', icon: <Layers className="h-5 w-5" aria-hidden="true" /> },
    { id: 'issues', label: `Problemas (${totalIssues})`, icon: <TriangleAlert className="h-5 w-5" aria-hidden="true" /> },
    { id: 'recommendations', label: 'Recomendações', icon: <Lightbulb className="h-5 w-5" aria-hidden="true" /> }
  ];

  return (
    <>
      {/* Floating Report Button */}
      <button
        onClick={openReport}
        className={`
          fixed bottom-20 right-4 z-40 p-4 rounded-full shadow-lg
          bg-purple-600 hover:bg-purple-700 text-white
          focus:outline-none focus:ring-4 focus:ring-purple-500/30
          transition-all duration-200 transform hover:scale-105
          ${className}
        `}
        title="Abrir verificação automática de acessibilidade"
        aria-label={`Verificação automática: indicador ${complianceInfo.level} (${overallScore}%). Clique para ver detalhes completos.`}
      >
        <div className="flex items-center gap-2" aria-hidden="true">
          <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
          <div className="flex flex-col items-center text-xs">
            <span className="font-bold">{complianceInfo.level}</span>
            <span>{overallScore}%</span>
          </div>
        </div>
      </button>

      {/* Report Dialog */}
      {isOpen && (
        <dialog
          ref={dialogRef}
          open
          className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          aria-modal="true"
          aria-labelledby="wcag-report-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <header className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div>
                <h2 id="wcag-report-title" className="text-2xl font-bold">
                  Verificação automática de acessibilidade
                </h2>
                <p className="mt-1 opacity-90">
                  Resultados automáticos que complementam a avaliação com usuários
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg border-2 ${complianceInfo.color}`}>
                  <span className="font-bold text-lg">{complianceInfo.level}</span>
                  <span className="ml-2 text-sm">{overallScore}%</span>
                </div>
                <button
                  onClick={closeReport}
                  className="p-2 text-white hover:text-gray-200"
                  aria-label="Fechar relatório"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </header>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`${tab.id}-tab`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    px-6 py-3 font-medium text-sm border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="mr-2" aria-hidden="true">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <main className="flex-1 overflow-auto p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Overall Score */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                      <h3 className="text-lg font-bold text-purple-800 mb-2">Pontuação Geral</h3>
                      <div className="text-4xl font-bold text-purple-600 mb-2">{overallScore}%</div>
                      <p className="text-sm text-purple-700">{complianceInfo.description}</p>
                    </div>

                    {/* WCAG Compliance */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                      <h3 className="text-lg font-bold text-green-800 mb-2">WCAG 2.1</h3>
                      <div className="text-4xl font-bold text-green-600 mb-2">{compliance?.score || 0}%</div>
                      <p className="text-sm text-green-700">
                        {compliance?.passedRules.length || 0} de {(compliance?.passedRules.length || 0) + (compliance?.failedRules.length || 0)} critérios
                      </p>
                    </div>

                    {/* HTML Robustness */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                      <h3 className="text-lg font-bold text-blue-800 mb-2">Robustez HTML</h3>
                      <div className="text-4xl font-bold text-blue-600 mb-2">{getOverallScore()}%</div>
                      <p className="text-sm text-blue-700">{htmlIssues.length} problemas encontrados</p>
                    </div>
                  </div>

                  {/* Issues Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Siren className="h-5 w-5 text-red-600" aria-hidden="true" />
                        <h4 className="font-bold text-red-800">Críticos</h4>
                      </div>
                      <div className="text-2xl font-bold text-red-600">{criticalIssues.length}</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TriangleAlert className="h-5 w-5 text-orange-600" aria-hidden="true" />
                        <h4 className="font-bold text-orange-800">Sérios</h4>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{seriousIssues.length}</div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-yellow-600" aria-hidden="true" />
                        <h4 className="font-bold text-yellow-800">Moderados</h4>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">{moderateIssues.length}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={runFullScan}
                      disabled={wcagChecking || isValidating}
                      className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 focus:outline-2 focus:outline-purple-600 focus:outline-offset-2"
                    >
                      <RefreshCw className={`mr-2 inline h-4 w-4 ${wcagChecking || isValidating ? 'animate-spin' : ''}`} aria-hidden="true" /> {wcagChecking || isValidating ? 'Escaneando...' : 'Escanear novamente'}
                    </button>
                    
                    <button
                      onClick={handleAutoFix}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-2 focus:outline-green-600 focus:outline-offset-2"
                    >
                      <Wrench className="mr-2 inline h-4 w-4" aria-hidden="true" /> Correção automática
                    </button>
                  </div>
                </div>
              )}

              {/* Principles Tab */}
              {activeTab === 'principles' && (
                <div id="principles-panel" role="tabpanel" aria-labelledby="principles-tab">
                  <div className="grid gap-6">
                    {[
                      {
                        name: '1. Perceptível',
                        description: 'A informação e os componentes da interface devem ser apresentados de forma que possam ser percebidos pelos usuários.',
                        items: ['Alt text em imagens', 'Contraste de cores', 'Texto redimensionável', 'Conteúdo adaptável'],
                        status: 'compliant'
                      },
                      {
                        name: '2. Operável',
                        description: 'Os componentes da interface e a navegação devem ser operáveis por todos os usuários.',
                        items: ['Navegação por teclado', 'Sem epilepsia', 'Tempo suficiente', 'Navegação facilitada'],
                        status: 'compliant'
                      },
                      {
                        name: '3. Compreensível',
                        description: 'A informação e o funcionamento da interface devem ser compreensíveis.',
                        items: ['Texto legível', 'Conteúdo previsível', 'Assistência de entrada'],
                        status: 'compliant'
                      },
                      {
                        name: '4. Robusto',
                        description: 'O conteúdo deve ser robusto o suficiente para funcionar com diversas tecnologias assistivas.',
                        items: ['HTML válido', 'Compatibilidade', 'Parsing correto'],
                        status: 'partial'
                      }
                    ].map((principle, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-lg border">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{principle.name}</h3>
                            <p className="text-gray-600">{principle.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            principle.status === 'compliant' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {principle.status === 'compliant' ? 'Itens de referência' : 'Revisão necessária'}
                          </div>
                        </div>
                        
                        <ul className="grid grid-cols-2 gap-2">
                          {principle.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues Tab */}
              {activeTab === 'issues' && (
                <div id="issues-panel" role="tabpanel" aria-labelledby="issues-tab">
                  {totalIssues === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" aria-hidden="true" />
                      <h3 className="text-2xl font-bold text-green-600 mb-2">
                        Nenhum problema detectado nesta verificação
                      </h3>
                      <p className="text-gray-600">
                        Uma verificação automática não substitui a avaliação manual de acessibilidade.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* WCAG Issues */}
                      {compliance?.issues && compliance.issues.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-red-600">Problemas WCAG ({compliance.issues.length})</h3>
                          <div className="space-y-3">
                            {compliance.issues.map((issue, index) => (
                              <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-bold text-red-800">{issue.message}</h4>
                                    <p className="text-sm text-red-600 mt-1">{issue.suggestion}</p>
                                    <p className="text-xs text-red-500 mt-2">{issue.wcagReference}</p>
                                  </div>
                                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                    Corrigir
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* HTML Issues */}
                      {htmlIssues.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-orange-600">Problemas HTML ({htmlIssues.length})</h3>
                          <div className="space-y-3">
                            {htmlIssues.map((issue, index) => (
                              <div key={index} className={`p-4 rounded-lg border ${
                                issue.wcagImpact === 'critical' ? 'bg-red-50 border-red-200' :
                                issue.wcagImpact === 'serious' ? 'bg-orange-50 border-orange-200' :
                                'bg-yellow-50 border-yellow-200'
                              }`}>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className={`font-bold ${
                                      issue.wcagImpact === 'critical' ? 'text-red-800' :
                                      issue.wcagImpact === 'serious' ? 'text-orange-800' :
                                      'text-yellow-800'
                                    }`}>
                                      {issue.message}
                                    </h4>
                                    <p className={`text-sm mt-1 ${
                                      issue.wcagImpact === 'critical' ? 'text-red-600' :
                                      issue.wcagImpact === 'serious' ? 'text-orange-600' :
                                      'text-yellow-600'
                                    }`}>
                                      {issue.suggestion}
                                    </p>
                                    {issue.selector && (
                                      <p className="text-xs text-gray-500 mt-2 font-mono">
                                        Seletor: {issue.selector}
                                      </p>
                                    )}
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    issue.wcagImpact === 'critical' ? 'bg-red-200 text-red-800' :
                                    issue.wcagImpact === 'serious' ? 'bg-orange-200 text-orange-800' :
                                    'bg-yellow-200 text-yellow-800'
                                  }`}>
                                    {issue.wcagImpact.charAt(0).toUpperCase() + issue.wcagImpact.slice(1)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div id="recommendations-panel" role="tabpanel" aria-labelledby="recommendations-tab">
                  <div className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <h3 className="text-xl font-bold text-green-800 mb-4"><ClipboardCheck className="mr-2 inline h-5 w-5" aria-hidden="true" /> Recursos disponíveis</h3>
                      <ul className="space-y-2 text-green-700">
                        <li><Check className="mr-2 inline h-4 w-4" aria-hidden="true" /> Navegação por teclado</li>
                        <li><Check className="mr-2 inline h-4 w-4" aria-hidden="true" /> Recursos para leitores de tela</li>
                        <li><Check className="mr-2 inline h-4 w-4" aria-hidden="true" /> Alto contraste e temas adaptativos</li>
                        <li><Check className="mr-2 inline h-4 w-4" aria-hidden="true" /> Skip links e landmarks ARIA</li>
                        <li><Check className="mr-2 inline h-4 w-4" aria-hidden="true" /> Rótulos e mensagens em formulários</li>
                        <li><Check className="mr-2 inline h-4 w-4" aria-hidden="true" /> VLibras integrado para Libras</li>
                        <li><Check className="mr-2 inline h-4 w-4" aria-hidden="true" /> Verificações automáticas de acessibilidade</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <h3 className="text-xl font-bold text-blue-800 mb-4"><Lightbulb className="mr-2 inline h-5 w-5" aria-hidden="true" /> Recomendações gerais</h3>
                      <ul className="space-y-3 text-blue-700">
                        <li>
                          <strong>Testes regulares:</strong> Execute validações de acessibilidade regularmente
                        </li>
                        <li>
                          <strong>Testes com usuários:</strong> Realize testes com usuários reais que usam tecnologias assistivas
                        </li>
                        <li>
                          <strong>Treinamento:</strong> Mantenha a equipe atualizada sobre práticas de acessibilidade
                        </li>
                        <li>
                          <strong>Documentação:</strong> Mantenha documentação sobre recursos de acessibilidade
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                      <h3 className="text-xl font-bold text-purple-800 mb-4"><Target className="mr-2 inline h-5 w-5" aria-hidden="true" /> Próximos passos</h3>
                      <ul className="space-y-2 text-purple-700">
                        <li>• Realizar testes com usuários reais</li>
                        <li>• Implementar analytics de acessibilidade</li>
                        <li>• Criar guia de acessibilidade para usuários</li>
                        <li>• Avaliação manual de conformidade com as WCAG</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Footer */}
            <footer className="p-4 border-t border-gray-200 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">
                Relatório baseado nas{' '}
                <a 
                  href="https://www.w3c.br/traducoes/wcag/wcag21-pt-BR/" 
                  target="_blank" 
                  rel="noopener"
                  className="text-purple-600 hover:underline"
                >
                  Diretrizes WCAG 2.1 AAA
                </a>
                {' '}• Gerado em {new Date().toLocaleString('pt-BR')}
              </p>
            </footer>
          </div>
        </dialog>
      )}
    </>
  );
};

export default WCAGComplianceReport;