import PublicDocumentLayout from '../components/PublicDocumentLayout';
import { Eye, MousePointer2, Palette, Smartphone, Timer, Type } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const AccessibilityStatement: React.FC = () => {
  return (
    <PublicDocumentLayout title="Declaração de Acessibilidade"><div className="p-5 sm:p-8 lg:p-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Declaração de Acessibilidade</h1>

      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Última atualização:</strong> 02/10/2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nosso Compromisso com a Acessibilidade</h2>
          <p className="text-gray-700 mb-4">
            A Aproxima está comprometida em garantir que nosso site seja acessível a todas as pessoas,
            incluindo aquelas com deficiências. Acreditamos que a tecnologia deve ser inclusiva e
            trabalhamos continuamente para melhorar a experiência de todos os usuários.
          </p>
          <p className="text-gray-700">
            Esta declaração reflete nossos esforços para cumprir as diretrizes de acessibilidade
            estabelecidas nas Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1 nível AA
            e na Lei Brasileira de Inclusão (Lei 13.146/2015).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Padrões de Conformidade</h2>
          <p className="text-gray-700 mb-4">
            Nosso site foi desenvolvido para atender aos seguintes padrões de acessibilidade:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>WCAG 2.1 Nível AA:</strong> Diretrizes internacionais para acessibilidade web</li>
            <li><strong>Lei Brasileira de Inclusão (LBI):</strong> Lei 13.146/2015</li>
            <li><strong>Decreto 9.094/2017:</strong> Regulamentação da acessibilidade em sites públicos</li>
            <li><strong>NBR 17060:</strong> Norma brasileira de acessibilidade em comunicação</li>
            <li><strong>Modelo de Acessibilidade em Governo Eletrônico (eMAG):</strong> Versão 3.1</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recursos de Acessibilidade Implementados</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3"><MousePointer2 className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /> Navegação por Teclado</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Navegação completa por Tab</li>
                <li>• Indicadores visuais de foco</li>
                <li>• Atalhos de teclado</li>
                <li>• Skip links para conteúdo principal</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3"><Eye className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /> Suporte a Leitores de Tela</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Estrutura semântica apropriada</li>
                <li>• Textos alternativos para imagens</li>
                <li>• Labels descritivos para formulários</li>
                <li>• Marcos ARIA (landmarks)</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3"><Palette className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /> Contraste e Cores</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Contraste mínimo de 4.5:1</li>
                <li>• Informação não dependente apenas de cor</li>
                <li>• Suporte a modo de alto contraste</li>
                <li>• Texto redimensionável até 200%</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3"><Smartphone className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /> Design Responsivo</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Adaptação a diferentes dispositivos</li>
                <li>• Orientação de tela flexível</li>
                <li>• Áreas de toque adequadas</li>
                <li>• Zoom sem perda de funcionalidade</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3"><Timer className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /> Controle de Tempo</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Sem limites de tempo desnecessários</li>
                <li>• Pausar/parar conteúdo em movimento</li>
                <li>• Avisos antes de timeout</li>
                <li>• Extensão de tempo quando necessário</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3"><Type className="inline-block h-6 w-6 shrink-0 align-middle" aria-hidden="true" /> Recursos de Texto</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Fontes legíveis e escaláveis</li>
                <li>• Espaçamento adequado entre linhas</li>
                <li>• Linguagem clara e simples</li>
                <li>• Estrutura hierárquica de cabeçalhos</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Integração VLibras</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-3">
              Nosso site inclui o VLibras, uma suíte de ferramentas gratuitas que traduz conteúdos
              digitais (texto, áudio e vídeo) para Língua Brasileira de Sinais (LIBRAS), tornando-os
              acessíveis para pessoas surdas.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Tradução automática para LIBRAS</li>
              <li>• Avatar 3D para interpretação</li>
              <li>• Integração oficial do Governo Federal</li>
              <li>• Disponível em todas as páginas</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tecnologias Assistivas Suportadas</h2>
          <p className="text-gray-700 mb-4">
            Nosso site foi testado e é compatível com as seguintes tecnologias assistivas:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Leitores de Tela</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• NVDA (Windows)</li>
                <li>• JAWS (Windows)</li>
                <li>• VoiceOver (macOS/iOS)</li>
                <li>• TalkBack (Android)</li>
                <li>• Orca (Linux)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Navegadores</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Chrome/Chromium</li>
                <li>• Firefox</li>
                <li>• Safari</li>
                <li>• Edge</li>
                <li>• Opera</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitações Conhecidas</h2>
          <p className="text-gray-700 mb-4">
            Embora nos esforcemos para manter o mais alto nível de acessibilidade, podem existir
            algumas limitações. Estamos trabalhando continuamente para resolver os seguintes itens:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Conteúdo multimídia de terceiros pode não ter legendas/descrições</li>
            <li>Alguns PDFs podem não estar totalmente acessíveis (estamos convertendo gradualmente)</li>
            <li>Mapas interativos podem ter funcionalidade limitada para alguns usuários</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Testes e Avaliações</h2>
          <p className="text-gray-700 mb-4">
            Realizamos testes regulares de acessibilidade utilizando:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Ferramentas automatizadas:</strong> axe-core, WAVE, Lighthouse</li>
            <li><strong>Testes manuais:</strong> Navegação por teclado, leitores de tela</li>
            <li><strong>Usuários reais:</strong> Feedback de pessoas com deficiência</li>
            <li><strong>Auditorias periódicas:</strong> Avaliações trimestrais de conformidade</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback e Suporte</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-4">
              Sua opinião é fundamental para melhorarmos continuamente a acessibilidade do nosso site.
              Se você encontrar barreiras de acessibilidade ou tiver sugestões de melhoria, entre em contato:
            </p>

            <div className="space-y-2">
              <p className="text-gray-700"><strong>Email de Acessibilidade:</strong> rejanecassol@hotmail.com</p>
              <p className="text-gray-700"><strong>Telefone:</strong> [A ser definido]</p>
              <p className="text-gray-700"><strong>Formulário:</strong> <Link href="/contato" className="text-blue-600 hover:underline">Formulário de Contato Acessível</Link></p>
              <p className="text-gray-700"><strong>Tempo de Resposta:</strong> Até 5 dias úteis</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Processo de Melhoria Contínua</h2>
          <p className="text-gray-700 mb-4">
            A acessibilidade é um processo contínuo. Nosso cronograma de melhorias inclui:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Mensal</h3>
              <p className="text-sm text-gray-700">Revisão de feedback dos usuários e correções prioritárias</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900">Trimestral</h3>
              <p className="text-sm text-gray-700">Auditoria completa de acessibilidade e testes com usuários</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Anual</h3>
              <p className="text-sm text-gray-700">Avaliação por especialista externo e atualização desta declaração</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alternativas de Acesso</h2>
          <p className="text-gray-700 mb-4">
            Caso encontre dificuldades para acessar qualquer conteúdo ou funcionalidade,
            oferecemos as seguintes alternativas:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Atendimento por email com descrição do conteúdo</li>
            <li>Versões alternativas de documentos em formatos acessíveis</li>
            <li>Suporte personalizado para navegação</li>
            <li>Informações por telefone quando aplicável</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data da Avaliação</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Última avaliação de acessibilidade:</strong> A confirmar pela equipe
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Método de avaliação:</strong> Combinação de avaliação automatizada e manual
            </p>
            <p className="text-gray-700">
              <strong>Próxima avaliação programada:</strong> A confirmar pela equipe
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recursos Externos</h2>
          <p className="text-gray-700 mb-4">
            Para mais informações sobre acessibilidade web, consulte:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WCAG 2.1 Quick Reference</a></li>
            <li><a href="https://www.gov.br/governodigital/pt-br/acessibilidade-digital" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Acessibilidade Digital - Governo Federal</a></li>
            <li><a href="https://vlibras.gov.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">VLibras - Tradução para LIBRAS</a></li>
            <li><a href="http://emag.governoeletronico.gov.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">eMAG - Modelo de Acessibilidade</a></li>
          </ul>
        </section>

        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Esta declaração de acessibilidade foi criada em 02/10/2025 e
            é atualizada conforme melhorias são implementadas.
          </p>
        </div>
      </div>
    </div></PublicDocumentLayout>
  );
};

export default AccessibilityStatement;
