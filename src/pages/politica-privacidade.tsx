import React from 'react';
import Link from 'next/link';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
      
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
          <p className="text-gray-700 mb-4">
            A Aproxima está comprometida com a proteção de seus dados pessoais e transparência no 
            tratamento das informações coletadas. Esta Política de Privacidade descreve como coletamos, 
            usamos, armazenamos e protegemos suas informações pessoais em conformidade com a Lei Geral 
            de Proteção de Dados (LGPD - Lei 13.709/2018) e outras legislações aplicáveis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Controlador de Dados</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2"><strong>Razão Social:</strong> Aproxima Tecnologia e Acessibilidade Ltda.</p>
            <p className="text-gray-700 mb-2"><strong>CNPJ:</strong> [A ser definido]</p>
            <p className="text-gray-700 mb-2"><strong>Endereço:</strong> [A ser definido]</p>
            <p className="text-gray-700 mb-2"><strong>Email de Contato:</strong> privacidade@aproxima.com.br</p>
            <p className="text-gray-700"><strong>Encarregado de Dados (DPO):</strong> dpo@aproxima.com.br</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Dados Pessoais Coletados</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 Dados fornecidos voluntariamente</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Nome completo</li>
            <li>Endereço de email</li>
            <li>Número de telefone</li>
            <li>Mensagens enviadas através de formulários de contato</li>
            <li>Preferências de acessibilidade</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 Dados coletados automaticamente</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Endereço IP</li>
            <li>Informações do navegador e dispositivo</li>
            <li>Dados de navegação (páginas visitadas, tempo de permanência)</li>
            <li>Cookies e tecnologias similares</li>
            <li>Dados de geolocalização (quando autorizado)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Finalidades do Tratamento</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">4.1 Prestação de Serviços</h3>
              <p className="text-gray-700 text-sm mb-2"><strong>Base Legal:</strong> Execução de contrato ou medidas pré-contratuais</p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Fornecer serviços de acessibilidade</li>
                <li>Responder a solicitações de contato</li>
                <li>Manter funcionalidades do site</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">4.2 Melhoria dos Serviços</h3>
              <p className="text-gray-700 text-sm mb-2"><strong>Base Legal:</strong> Interesse legítimo</p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Análise de uso do site</li>
                <li>Desenvolvimento de novos recursos</li>
                <li>Otimização da experiência do usuário</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">4.3 Comunicação</h3>
              <p className="text-gray-700 text-sm mb-2"><strong>Base Legal:</strong> Consentimento</p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Envio de newsletters (quando autorizado)</li>
                <li>Comunicações promocionais (quando autorizado)</li>
                <li>Atualizações sobre serviços</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">4.4 Cumprimento Legal</h3>
              <p className="text-gray-700 text-sm mb-2"><strong>Base Legal:</strong> Obrigação legal</p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Cumprimento de determinações judiciais</li>
                <li>Atendimento a órgãos reguladores</li>
                <li>Prevenção à fraude</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Compartilhamento de Dados</h2>
          
          <p className="text-gray-700 mb-4">
            Não vendemos, alugamos ou comercializamos seus dados pessoais. Podemos compartilhar 
            informações nas seguintes situações:
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">5.1 Prestadores de Serviços</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Serviços de hospedagem e infraestrutura</li>
            <li>Provedores de análise de dados (Google Analytics)</li>
            <li>Serviços de email e comunicação</li>
            <li>VLibras (Governo Federal - Acessibilidade)</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">5.2 Obrigações Legais</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Cumprimento de ordens judiciais</li>
            <li>Atendimento a autoridades competentes</li>
            <li>Proteção de direitos, propriedade ou segurança</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies e Tecnologias Similares</h2>
          
          <p className="text-gray-700 mb-4">
            Utilizamos cookies para melhorar sua experiência em nosso site. Os cookies são categorizados como:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Cookies Necessários</h3>
              <p className="text-gray-700 text-sm">
                Essenciais para o funcionamento básico do site. Não podem ser desabilitados.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Cookies de Análise</h3>
              <p className="text-gray-700 text-sm">
                Coletam informações sobre como o site é utilizado para melhorias.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Cookies de Marketing</h3>
              <p className="text-gray-700 text-sm">
                Utilizados para personalizar anúncios e conteúdo relevante.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Cookies de Personalização</h3>
              <p className="text-gray-700 text-sm">
                Permitem personalizar sua experiência no site.
              </p>
            </div>
          </div>

          <p className="text-gray-700">
            Você pode gerenciar suas preferências de cookies através do banner de consentimento 
            ou nas configurações do seu navegador.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Seus Direitos</h2>
          
          <p className="text-gray-700 mb-4">
            Em conformidade com a LGPD, você possui os seguintes direitos:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Acesso</h3>
              <p className="text-gray-700 text-sm">
                Solicitar informações sobre quais dados pessoais tratamos sobre você.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Correção</h3>
              <p className="text-gray-700 text-sm">
                Solicitar a correção de dados incompletos, inexatos ou desatualizados.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Exclusão</h3>
              <p className="text-gray-700 text-sm">
                Solicitar a eliminação de dados pessoais desnecessários ou tratados em desconformidade.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Portabilidade</h3>
              <p className="text-gray-700 text-sm">
                Solicitar a portabilidade de dados a outro fornecedor de serviço.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Oposição</h3>
              <p className="text-gray-700 text-sm">
                Opor-se ao tratamento realizado com fundamento em interesse legítimo.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Revogação do Consentimento</h3>
              <p className="text-gray-700 text-sm">
                Retirar o consentimento a qualquer momento, quando aplicável.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Segurança dos Dados</h2>
          
          <p className="text-gray-700 mb-4">
            Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Criptografia de dados em trânsito e em repouso</li>
            <li>Controles de acesso rigorosos</li>
            <li>Monitoramento contínuo de segurança</li>
            <li>Treinamento regular de funcionários</li>
            <li>Avaliações de segurança periódicas</li>
            <li>Planos de resposta a incidentes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Retenção de Dados</h2>
          
          <p className="text-gray-700 mb-4">
            Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades 
            para as quais foram coletados:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Dados de contato:</strong> Até o cumprimento da finalidade ou solicitação de exclusão</li>
            <li><strong>Dados de navegação:</strong> 24 meses para análise</li>
            <li><strong>Cookies:</strong> Conforme política de cookies específica</li>
            <li><strong>Dados para cumprimento legal:</strong> Conforme exigido por lei</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Transferência Internacional</h2>
          
          <p className="text-gray-700 mb-4">
            Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. 
            Garantimos que essas transferências sejam realizadas com adequado nível de proteção:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Países com nível adequado de proteção reconhecido pela ANPD</li>
            <li>Cláusulas contratuais padrão de proteção de dados</li>
            <li>Certificações internacionais de segurança</li>
            <li>Consentimento específico quando necessário</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Menores de Idade</h2>
          
          <p className="text-gray-700">
            Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente 
            dados pessoais de menores sem o consentimento dos pais ou responsáveis legais. Se tomarmos 
            conhecimento de que coletamos dados de um menor sem consentimento adequado, tomaremos medidas 
            para remover essas informações.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Alterações na Política</h2>
          
          <p className="text-gray-700">
            Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre 
            alterações significativas através do site ou por email. A data da última atualização 
            está indicada no início deste documento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contato</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade:
            </p>
            
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> privacidade@aproxima.com.br</p>
              <p className="text-gray-700"><strong>Encarregado de Dados:</strong> dpo@aproxima.com.br</p>
              <p className="text-gray-700"><strong>Central de Privacidade:</strong> <Link href="/central-privacidade" className="text-blue-600 hover:underline">Acesse aqui</Link></p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
          
          <p className="text-gray-700">
            Você também pode apresentar reclamações à ANPD sobre o tratamento de seus dados pessoais. 
            Mais informações em: <a href="https://www.gov.br/anpd/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            www.gov.br/anpd/
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;