import React from 'react';
import Link from 'next/link';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
      
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
          <p className="text-gray-700 mb-4">
            Ao acessar e usar o site da Aproxima e seus serviços, você concorda em cumprir e ficar 
            vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, 
            não deve usar nossos serviços.
          </p>
          <p className="text-gray-700">
            Estes termos constituem um acordo legalmente vinculativo entre você e a Aproxima 
            Tecnologia e Acessibilidade Ltda.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição dos Serviços</h2>
          <p className="text-gray-700 mb-4">
            A Aproxima oferece serviços de tecnologia e acessibilidade, incluindo:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Consultoria em acessibilidade digital</li>
            <li>Desenvolvimento de soluções acessíveis</li>
            <li>Treinamentos e capacitação</li>
            <li>Avaliação de conformidade WCAG</li>
            <li>Recursos e ferramentas de acessibilidade</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Elegibilidade</h2>
          <p className="text-gray-700 mb-4">
            Para usar nossos serviços, você deve:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Ter pelo menos 18 anos de idade ou ter autorização de pais/responsáveis</li>
            <li>Ter capacidade legal para firmar contratos</li>
            <li>Fornecer informações precisas e atualizadas</li>
            <li>Usar os serviços em conformidade com todas as leis aplicáveis</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Uso Aceitável</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Usos Permitidos</h3>
          <p className="text-gray-700 mb-4">Você pode usar nossos serviços para:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Acessar informações sobre acessibilidade</li>
            <li>Solicitar serviços de consultoria</li>
            <li>Participar de treinamentos e eventos</li>
            <li>Usar ferramentas e recursos disponibilizados</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 Usos Proibidos</h3>
          <p className="text-gray-700 mb-4">Você não pode:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Violar qualquer lei ou regulamento aplicável</li>
            <li>Infringir direitos de propriedade intelectual</li>
            <li>Transmitir malware, vírus ou código malicioso</li>
            <li>Realizar atividades fraudulentas ou enganosas</li>
            <li>Interferir com o funcionamento dos serviços</li>
            <li>Tentar obter acesso não autorizado aos sistemas</li>
            <li>Usar os serviços para spam ou comunicações não solicitadas</li>
            <li>Reproduzir, distribuir ou modificar conteúdo sem autorização</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Propriedade Intelectual</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">5.1 Conteúdo da Aproxima</h3>
          <p className="text-gray-700 mb-4">
            Todo o conteúdo do site, incluindo textos, gráficos, logos, ícones, imagens, clipes de 
            áudio, downloads digitais e software, é propriedade da Aproxima ou de seus licenciadores 
            e é protegido por leis de direitos autorais e outras leis de propriedade intelectual.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">5.2 Licença de Uso</h3>
          <p className="text-gray-700 mb-4">
            Concedemos a você uma licença limitada, não exclusiva, não transferível e revogável para 
            acessar e usar o site para fins pessoais e comerciais legítimos, em conformidade com estes Termos.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">5.3 Conteúdo do Usuário</h3>
          <p className="text-gray-700">
            Ao enviar conteúdo para nossos serviços (comentários, feedback, sugestões), você nos 
            concede uma licença perpétua, irrevogável, mundial e livre de royalties para usar, 
            reproduzir, modificar e distribuir esse conteúdo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacidade e Proteção de Dados</h2>
          <p className="text-gray-700 mb-4">
            Sua privacidade é importante para nós. O tratamento de seus dados pessoais é regido por 
            nossa <Link href="/politica-privacidade" className="text-blue-600 hover:underline">
            Política de Privacidade</Link>, que faz parte integrante destes Termos de Uso.
          </p>
          <p className="text-gray-700">
            Ao usar nossos serviços, você consente com a coleta e uso de informações conforme 
            descrito em nossa Política de Privacidade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disponibilidade dos Serviços</h2>
          <p className="text-gray-700 mb-4">
            Nos esforçamos para manter nossos serviços disponíveis 24 horas por dia, 7 dias por semana. 
            No entanto, podemos:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Realizar manutenções programadas com aviso prévio</li>
            <li>Suspender serviços temporariamente por questões técnicas</li>
            <li>Modificar ou descontinuar recursos com aviso adequado</li>
            <li>Restringir acesso em caso de uso indevido</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-yellow-900 mb-2">Isenção de Garantias</h3>
            <p className="text-yellow-800 text-sm">
              Os serviços são fornecidos "como estão" e "conforme disponíveis", sem garantias de 
              qualquer tipo, expressas ou implícitas.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            Na máxima extensão permitida por lei, a Aproxima não será responsável por:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Danos indiretos, incidentais, especiais ou consequenciais</li>
            <li>Perda de lucros, dados ou oportunidades de negócio</li>
            <li>Interrupção de negócios ou uso</li>
            <li>Falhas de segurança ou acesso não autorizado</li>
            <li>Conteúdo de terceiros ou links externos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indenização</h2>
          <p className="text-gray-700">
            Você concorda em indenizar e isentar a Aproxima, seus funcionários, diretores e agentes 
            de quaisquer reivindicações, perdas, responsabilidades, custos e despesas (incluindo 
            honorários advocatícios) decorrentes de:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-4 space-y-1">
            <li>Seu uso dos serviços</li>
            <li>Violação destes Termos de Uso</li>
            <li>Violação de direitos de terceiros</li>
            <li>Qualquer conteúdo que você enviar ou transmitir</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Rescisão</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">10.1 Rescisão pelo Usuário</h3>
          <p className="text-gray-700 mb-4">
            Você pode parar de usar nossos serviços a qualquer momento. Se tiver uma conta, 
            pode solicitar seu encerramento entrando em contato conosco.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">10.2 Rescisão pela Aproxima</h3>
          <p className="text-gray-700 mb-4">
            Podemos suspender ou encerrar seu acesso aos serviços imediatamente, sem aviso prévio, se:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Você violar estes Termos de Uso</li>
            <li>Seu uso prejudicar outros usuários ou nossos sistemas</li>
            <li>For necessário por questões legais ou regulatórias</li>
            <li>Suspeitarmos de atividade fraudulenta</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modificações dos Termos</h2>
          <p className="text-gray-700 mb-4">
            Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
            Alterações significativas serão comunicadas através de:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Aviso no site</li>
            <li>Email para usuários registrados</li>
            <li>Notificação ao fazer login</li>
          </ul>
          <p className="text-gray-700">
            O uso continuado dos serviços após as modificações constitui aceitação dos novos termos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Lei Aplicável e Jurisdição</h2>
          <p className="text-gray-700 mb-4">
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, 
            sem considerar conflitos de disposições legais.
          </p>
          <p className="text-gray-700">
            Qualquer disputa relacionada a estes termos será resolvida exclusivamente pelos 
            tribunais competentes do Brasil, renunciando a qualquer outro foro, por mais 
            privilegiado que seja.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Disposições Gerais</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">13.1 Integralidade</h3>
          <p className="text-gray-700 mb-4">
            Estes Termos de Uso, juntamente com nossa Política de Privacidade, constituem o 
            acordo completo entre você e a Aproxima.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">13.2 Divisibilidade</h3>
          <p className="text-gray-700 mb-4">
            Se qualquer disposição destes termos for considerada inválida ou inexequível, 
            as demais disposições permanecerão em pleno vigor e efeito.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">13.3 Não Renúncia</h3>
          <p className="text-gray-700 mb-4">
            A falha da Aproxima em exercer qualquer direito ou disposição destes termos não 
            constituirá uma renúncia a esse direito ou disposição.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mb-3">13.4 Cessão</h3>
          <p className="text-gray-700">
            Você não pode ceder seus direitos sob estes termos sem nosso consentimento prévio por escrito. 
            Podemos ceder nossos direitos a qualquer momento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contato</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> contato@aproxima.com.br</p>
              <p className="text-gray-700"><strong>Jurídico:</strong> juridico@aproxima.com.br</p>
              <p className="text-gray-700"><strong>Formulário de Contato:</strong> <Link href="/contato" className="text-blue-600 hover:underline">Acesse aqui</Link></p>
            </div>
          </div>
        </section>

        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Aproxima Tecnologia e Acessibilidade Ltda. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;