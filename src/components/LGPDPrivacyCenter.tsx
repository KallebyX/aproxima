import React, { useState, useEffect } from 'react';

interface DataRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  reference: string;
}

export const LGPDPrivacyCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preferences' | 'requests' | 'export'>('preferences');
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState<'access' | 'rectification' | 'erasure' | 'portability' | 'objection'>('access');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUserRequests();
  }, []);

  const loadUserRequests = async () => {
    const userEmail = prompt('Digite seu email para visualizar suas solicitações:');
    if (userEmail) {
      try {
        const response = await fetch(`/api/lgpd/data-request?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests || []);
          setEmail(userEmail);
        }
      } catch (error) {
        console.error('Error loading requests:', error);
      }
    }
  };

  const submitDataRequest = async () => {
    if (!email || !description) {
      console.warn('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lgpd/data-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: requestType,
          email,
          description
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Solicitação enviada com sucesso!\nReferência: ${data.reference}\nID: ${data.requestId}`);
        setDescription('');
        loadUserRequests();
      } else {
        alert('Erro ao enviar solicitação. Tente novamente.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportUserData = async () => {
    console.info('Funcionalidade de exportação de dados em desenvolvimento.');
  };

  const withdrawConsent = async () => {
    const confirmation = confirm('Tem certeza que deseja retirar todos os consentimentos? Isso pode afetar a funcionalidade do site.');
    if (confirmation) {
      try {
        const sessionId = localStorage.getItem('lgpd-consent');
        if (sessionId) {
          const consent = JSON.parse(sessionId);
          const response = await fetch(`/api/lgpd/consent?sessionId=${consent.sessionId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            localStorage.removeItem('lgpd-consent');
            alert('Consentimento retirado com sucesso.');
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Error withdrawing consent:', error);
        alert('Erro ao retirar consentimento. Tente novamente.');
      }
    }
  };

  const requestTypeLabels = {
    access: 'Acesso aos Dados',
    rectification: 'Correção de Dados',
    erasure: 'Exclusão de Dados',
    portability: 'Portabilidade de Dados',
    objection: 'Oposição ao Processamento'
  };

  const statusLabels = {
    pending: 'Pendente',
    processing: 'Em Processamento',
    completed: 'Concluída',
    rejected: 'Rejeitada'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Central de Privacidade - LGPD</h1>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Preferências de Privacidade
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Solicitações de Dados
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'export'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Exportar Dados
          </button>
        </nav>
      </div>

      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Suas Preferências de Privacidade</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-4">
                Você pode gerenciar suas preferências de cookies e privacidade a qualquer momento. 
                Suas escolhas afetam como coletamos e usamos seus dados.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="mr-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Alterar Preferências de Cookies
                </button>
                <button
                  onClick={withdrawConsent}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Retirar Todos os Consentimentos
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Seus Direitos sob a LGPD</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Acesso:</strong> Você pode solicitar acesso aos seus dados pessoais</li>
              <li><strong>Correção:</strong> Você pode solicitar a correção de dados incorretos</li>
              <li><strong>Exclusão:</strong> Você pode solicitar a exclusão de seus dados</li>
              <li><strong>Portabilidade:</strong> Você pode solicitar seus dados em formato portável</li>
              <li><strong>Oposição:</strong> Você pode se opor ao processamento de seus dados</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nova Solicitação de Dados</h2>
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="request-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Solicitação
                  </label>
                  <select
                    id="request-type"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value as typeof requestType)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    {Object.entries(requestTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="request-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="request-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="request-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Solicitação
                  </label>
                  <textarea
                    id="request-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Descreva detalhadamente sua solicitação..."
                  />
                </div>

                <button
                  onClick={submitDataRequest}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Suas Solicitações</h2>
            {requests.length === 0 ? (
              <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="bg-white p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {requestTypeLabels[request.type]}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Referência: {request.reference}
                        </p>
                        <p className="text-sm text-gray-500">
                          Criada em: {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {statusLabels[request.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Exportar Seus Dados</h2>
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <p className="text-gray-700 mb-4">
                Você pode exportar todos os seus dados pessoais que possuímos em formato JSON. 
                Este processo pode levar alguns minutos dependendo da quantidade de dados.
              </p>
              <button
                onClick={exportUserData}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Exportar Meus Dados
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Informações sobre a Exportação</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Os dados são fornecidos em formato JSON estruturado</li>
              <li>• Incluem todas as informações pessoais que coletamos</li>
              <li>• O arquivo é enviado para o email cadastrado</li>
              <li>• O processo leva até 15 dias úteis conforme a LGPD</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LGPDPrivacyCenter;