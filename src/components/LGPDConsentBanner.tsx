import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface LGPDConsentBannerProps {
  onConsentChange?: (consent: CookiePreferences) => void;
}

export const LGPDConsentBanner: React.FC<LGPDConsentBannerProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = localStorage.getItem('lgpd-consent');
    if (!existingConsent) {
      setShowBanner(true);
    } else {
      try {
        const consent = JSON.parse(existingConsent);
        setPreferences(consent.preferences);
      } catch (error) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = async () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    await saveConsent(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = async () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    
    await saveConsent(onlyNecessary);
    setShowBanner(false);
  };

  const handleCustomize = async () => {
    await saveConsent(preferences);
    setShowBanner(false);
  };

  const saveConsent = async (consent: CookiePreferences) => {
    try {
      const sessionId = generateSessionId();
      const consentData = {
        sessionId,
        preferences: consent,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('lgpd-consent', JSON.stringify(consentData));

      // Send to API
      const response = await fetch('/api/lgpd/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          cookies: consent
        })
      });

      if (response.ok) {
        setPreferences(consent);
        onConsentChange?.(consent);
      }
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Proteção de Dados Pessoais (LGPD)
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site, 
              personalizar conteúdo e analisar o tráfego. Ao continuar navegando, você concorda com 
              nossa <Link href="/politica-privacidade" className="text-blue-600 hover:underline">
              Política de Privacidade</Link> e o uso de cookies conforme descrito.
            </p>
            
            {showDetails && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Configurações de Cookies</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="cookie-necessary" className="font-medium text-gray-700">Cookies Necessários</label>
                      <p className="text-xs text-gray-500">
                        Essenciais para o funcionamento do site
                      </p>
                    </div>
                    <input
                      id="cookie-necessary"
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="cookie-analytics" className="font-medium text-gray-700">Cookies de Análise</label>
                      <p className="text-xs text-gray-500">
                        Ajudam a entender como os visitantes usam o site
                      </p>
                    </div>
                    <input
                      id="cookie-analytics"
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        analytics: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="cookie-marketing" className="font-medium text-gray-700">Cookies de Marketing</label>
                      <p className="text-xs text-gray-500">
                        Utilizados para exibir anúncios relevantes
                      </p>
                    </div>
                    <input
                      id="cookie-marketing"
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        marketing: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="cookie-personalization" className="font-medium text-gray-700">Cookies de Personalização</label>
                      <p className="text-xs text-gray-500">
                        Permitem personalizar sua experiência no site
                      </p>
                    </div>
                    <input
                      id="cookie-personalization"
                      type="checkbox"
                      checked={preferences.personalization}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        personalization: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 lg:mt-0 lg:ml-8 flex flex-wrap gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showDetails ? 'Ocultar Detalhes' : 'Personalizar'}
            </button>
            
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Rejeitar Tudo
            </button>
            
            {showDetails && (
              <button
                onClick={handleCustomize}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Salvar Preferências
              </button>
            )}
            
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Aceitar Todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LGPDConsentBanner;