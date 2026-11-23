import { FormEvent, useEffect, useState } from 'react';

interface DataRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  reference: string;
}
type Preferences = { necessary: boolean; analytics: boolean; marketing: boolean; personalization: boolean };
const defaultPreferences: Preferences = { necessary: true, analytics: false, marketing: false, personalization: false };
const idsKey = 'aproxima-data-request-ids';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const requestTypeLabels = { access: 'Acesso aos Dados', rectification: 'Correção de Dados', erasure: 'Exclusão de Dados', portability: 'Portabilidade de Dados', objection: 'Oposição ao Processamento' };
const statusLabels = { pending: 'Pendente', processing: 'Em processamento', completed: 'Concluída', rejected: 'Rejeitada' };

function savedRequestIds(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(idsKey) || '[]');
    return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string' && uuid.test(id)).slice(-50) : [];
  } catch { return []; }
}

export default function LGPDPrivacyCenter() {
  const [activeTab, setActiveTab] = useState<'preferences' | 'requests' | 'export'>('preferences');
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState<DataRequest['type']>('access');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  async function loadRequest(id: string) {
    const response = await fetch(`/api/lgpd/data-request?requestId=${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(response.status === 404 ? 'Solicitação não encontrada.' : 'Não foi possível consultar a solicitação. Tente novamente.');
    const data = await response.json();
    const request = data.request as DataRequest;
    setRequests(current => [request, ...current.filter(item => item.id !== request.id)]);
  }

  function rememberId(id: string) {
    try { localStorage.setItem(idsKey, JSON.stringify([...new Set([...savedRequestIds(), id])].slice(-50))); }
    catch { setMessage('Guarde o ID da solicitação: este navegador não permite salvar o histórico.'); }
  }

  useEffect(() => {
    for (const id of savedRequestIds()) loadRequest(id).catch(() => {});
    try {
      const stored = JSON.parse(localStorage.getItem('lgpd-consent') || 'null');
      if (stored?.preferences) setPreferences({ necessary: true, analytics: stored.preferences.analytics === true, marketing: stored.preferences.marketing === true, personalization: stored.preferences.personalization === true });
    } catch { /* Preferences remain optional when browser storage is unavailable. */ }
  }, []);

  async function submitDataRequest(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true); setMessage('');
    try {
      const response = await fetch('/api/lgpd/data-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: requestType, email: email.trim(), description: description.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Não foi possível registrar a solicitação.');
      rememberId(data.requestId);
      setMessage(`Solicitação registrada. Referência: ${data.reference}. Guarde seu ID: ${data.requestId}`);
      setDescription('');
      await loadRequest(data.requestId);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha de conexão. Tente novamente.'); }
    finally { setIsSubmitting(false); }
  }

  async function lookupRequest(event: FormEvent) {
    event.preventDefault(); setMessage('');
    if (!uuid.test(lookupId.trim())) { setMessage('Informe o ID completo recebido ao registrar a solicitação.'); return; }
    try { await loadRequest(lookupId.trim()); rememberId(lookupId.trim()); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível consultar a solicitação.'); }
  }

  async function savePreferences(next: Preferences) {
    setIsSubmitting(true); setMessage('');
    try {
      let sessionId: string | undefined;
      try { sessionId = JSON.parse(localStorage.getItem('lgpd-consent') || 'null')?.sessionId; } catch {}
      sessionId ||= crypto.randomUUID();
      const response = await fetch('/api/lgpd/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, cookies: next }) });
      if (!response.ok) throw new Error('Não foi possível salvar as preferências. Tente novamente.');
      setPreferences(next);
      try { localStorage.setItem('lgpd-consent', JSON.stringify({ sessionId, preferences: next, timestamp: new Date().toISOString() })); }
      catch { /* Server confirmation remains valid; storage may be disabled. */ }
      setMessage('Preferências salvas. Você pode alterá-las a qualquer momento.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha de conexão. Tente novamente.'); }
    finally { setIsSubmitting(false); }
  }

  function exportLocalData() {
    let consent = null;
    try { consent = JSON.parse(localStorage.getItem('lgpd-consent') || 'null'); } catch {}
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), consent, requests }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'aproxima-meus-registros.json'; link.click(); URL.revokeObjectURL(url);
    setMessage('Arquivo com as preferências e os protocolos deste navegador preparado.');
  }

  const buttonClass = 'rounded-md bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800 disabled:opacity-50';
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:p-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Central de Privacidade</h1>
      <p className="mb-6 text-gray-700">Gerencie suas preferências e acompanhe solicitações usando o ID do protocolo.</p>
      <div className="mb-6 flex flex-wrap gap-2" aria-label="Seções da central de privacidade">
        {([['preferences', 'Preferências'], ['requests', 'Solicitações de dados'], ['export', 'Exportar registros']] as const).map(([tab, label]) => <button key={tab} onClick={() => { setActiveTab(tab); setMessage(''); }} aria-pressed={activeTab === tab} className={`rounded-md px-4 py-3 font-medium ${activeTab === tab ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>{label}</button>)}
      </div>
      {message && <p role="status" className="mb-6 break-words rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-950">{message}</p>}
      {activeTab === 'preferences' && <section className="space-y-5" aria-labelledby="preferences-heading">
        <h2 id="preferences-heading" className="text-xl font-semibold">Suas preferências</h2>
        <p className="text-gray-700">Os recursos essenciais permitem a navegação. As opções adicionais ficam desativadas até sua escolha.</p>
        {([['necessary', 'Recursos essenciais'], ['analytics', 'Análise de uso'], ['marketing', 'Marketing'], ['personalization', 'Personalização']] as const).map(([key, label]) => <label key={key} className="flex items-center gap-3 rounded-lg border p-4"><input type="checkbox" checked={preferences[key]} disabled={key === 'necessary'} onChange={event => setPreferences(current => ({ ...current, [key]: event.target.checked }))} />{label}{key === 'necessary' && ' (obrigatórios)'}</label>)}
        <div className="flex flex-wrap gap-3"><button disabled={isSubmitting} className={buttonClass} onClick={() => savePreferences(preferences)}>Salvar preferências</button><button disabled={isSubmitting} className="rounded-md border border-gray-400 px-4 py-3" onClick={() => savePreferences(defaultPreferences)}>Desativar opções adicionais</button></div>
        <h2 className="pt-4 text-xl font-semibold">Seus direitos</h2>
        <p className="text-gray-700">Na seção Solicitações de dados, você pode pedir acesso, correção, exclusão, portabilidade ou se opor ao processamento de seus dados. A equipe precisará verificar sua identidade antes de fornecer dados pessoais.</p>
      </section>}
      {activeTab === 'requests' && <section className="space-y-8" aria-labelledby="requests-heading">
        <form onSubmit={submitDataRequest} className="space-y-4 rounded-lg border p-4 sm:p-6">
          <h2 id="requests-heading" className="text-xl font-semibold">Nova solicitação</h2>
          <label className="block">Tipo de solicitação<select value={requestType} onChange={event => setRequestType(event.target.value as DataRequest['type'])} className="mt-2 block w-full rounded-md border border-gray-400 p-3">{Object.entries(requestTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label className="block">E-mail para contato<input type="email" autoComplete="email" value={email} required maxLength={254} onChange={event => setEmail(event.target.value)} className="mt-2 block w-full rounded-md border border-gray-400 p-3" /></label>
          <label className="block">Descrição<textarea value={description} required minLength={10} maxLength={5000} rows={4} onChange={event => setDescription(event.target.value)} className="mt-2 block w-full rounded-md border border-gray-400 p-3" /></label>
          <button disabled={isSubmitting} className={buttonClass}>{isSubmitting ? 'Registrando…' : 'Registrar solicitação'}</button>
        </form>
        <div className="space-y-4"><h2 className="text-xl font-semibold">Acompanhar solicitação</h2><p className="text-gray-700">Use o ID recebido no registro. Os protocolos salvos neste navegador aparecem abaixo. Não compartilhe seu ID.</p><form onSubmit={lookupRequest} className="flex flex-wrap gap-3"><label className="min-w-0 flex-1">ID da solicitação<input value={lookupId} onChange={event => setLookupId(event.target.value)} required className="mt-2 block w-full rounded-md border border-gray-400 p-3" /></label><button className={`${buttonClass} self-end`}>Consultar</button></form></div>
        {requests.length === 0 ? <p className="text-gray-600">Nenhum protocolo salvo neste navegador.</p> : requests.map(request => <article key={request.id} className="space-y-2 rounded-lg border p-4"><h3 className="font-semibold">{requestTypeLabels[request.type]}</h3><p>{statusLabels[request.status]}</p><p className="break-all">Referência: {request.reference}</p><p className="break-all">ID: {request.id}</p><p>Registrada em: {new Date(request.createdAt).toLocaleDateString('pt-BR')}</p></article>)}
      </section>}
      {activeTab === 'export' && <section className="space-y-5" aria-labelledby="export-heading"><h2 id="export-heading" className="text-xl font-semibold">Exportar registros deste navegador</h2><p className="text-gray-700">Baixe um arquivo JSON com suas preferências e os protocolos consultados neste navegador. Para solicitar uma cópia de outros dados mantidos pela equipe, registre uma solicitação de portabilidade.</p><button className={buttonClass} onClick={exportLocalData}>Baixar meus registros</button><button className="ml-0 block rounded-md border border-gray-400 px-4 py-3" onClick={() => { setRequestType('portability'); setActiveTab('requests'); }}>Solicitar portabilidade</button></section>}
    </div>
  );
}
