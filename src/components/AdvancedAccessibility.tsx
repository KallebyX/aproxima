'use client';

import { useAccessibility } from '../hooks/useAccessibility';
import { useAccessibilityNotification, AccessibilityNotification } from './AccessibilityNotification';

interface AccessibilityProps {
  className?: string;
}

const AdvancedAccessibility = ({ className = '' }: AccessibilityProps) => {
  const { settings, updateSettings, resetSettings, mounted } = useAccessibility();
  const { notifications, addNotification, removeNotification } = useAccessibilityNotification();

  // Helper function to update individual setting with notification
  const updateSetting = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
    
    // Add notification for setting change
    const settingNames: Record<string, string> = {
      highContrast: 'Alto Contraste',
      largeText: 'Texto Grande',
      underlinkText: 'Links Sublinhados',
      magnification: 'Ampliação',
      reducedMotion: 'Reduzir Movimento',
      focusIndicator: 'Foco Aumentado',
      soundFeedback: 'Feedback Sonoro',
      autoplay: 'Reprodução Automática'
    };

    const settingName = settingNames[key] || key;
    const action = value ? 'ativado' : 'desativado';
    const message = key === 'magnification' 
      ? `Ampliação alterada para ${value}%`
      : `${settingName} ${action}`;
    
    addNotification(message, 'success', 2000);
  };

  const handleResetSettings = () => {
    resetSettings();
    addNotification('Configurações restauradas aos padrões', 'info', 3000);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 lg:space-y-6 ${className}`}>
      {/* Compact Header Section */}
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 lg:h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <span className="text-base lg:text-lg font-semibold text-gray-700">Configurações Detalhadas</span>
        </div>
        <button
          onClick={handleResetSettings}
          className="text-xs lg:text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-200 border border-blue-200/50"
          aria-label="Restaurar configurações padrão de acessibilidade"
        >
          ↺ Restaurar Padrões
        </button>
      </div>
      
      {/* Main Content Grid - Better responsive layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Visual Section */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center gap-3 mb-4 lg:mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-base lg:text-lg">👁️</span>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">
              Configurações Visuais
            </h3>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            {/* Alto Contraste */}
            <div className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-blue-500" />
                <label htmlFor="high-contrast" className="text-sm lg:font-medium text-gray-800">
                  Alto Contraste
                </label>
              </div>
              <button
                id="high-contrast"
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Texto Grande */}
            <div className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500" />
                <label htmlFor="large-text" className="text-sm lg:font-medium text-gray-800">
                  Texto Grande
                </label>
              </div>
              <button
                id="large-text"
                onClick={() => updateSetting('largeText', !settings.largeText)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  settings.largeText ? 'bg-green-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.largeText}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                  settings.largeText ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Links Sublinhados */}
            <div className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-purple-500" />
                <label htmlFor="underline-links" className="text-sm lg:font-medium text-gray-800">
                  Links Sublinhados
                </label>
              </div>
              <button
                id="underline-links"
                onClick={() => updateSetting('underlinkText', !settings.underlinkText)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  settings.underlinkText ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.underlinkText}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                  settings.underlinkText ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Ampliação */}
            <div className="p-3 lg:p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <label htmlFor="magnification" className="text-sm lg:font-medium text-gray-800">
                  Ampliação da Página
                </label>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                  {settings.magnification}%
                </span>
              </div>
              <input
                id="magnification"
                type="range"
                min="75"
                max="200"
                step="25"
                value={settings.magnification}
                onChange={(e) => updateSetting('magnification', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>75%</span>
                <span>200%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Motor Section */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center gap-3 mb-4 lg:mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-base lg:text-lg">🤚</span>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">
              Configurações Motoras & Outras
            </h3>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            {/* Reduzir Movimento */}
            <div className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-orange-500" />
                <label htmlFor="reduced-motion" className="text-sm lg:font-medium text-gray-800">
                  Reduzir Movimento
                </label>
              </div>
              <button
                id="reduced-motion"
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  settings.reducedMotion ? 'bg-orange-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Foco Aumentado */}
            <div className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-yellow-500" />
                <label htmlFor="focus-indicator" className="text-sm lg:font-medium text-gray-800">
                  Foco Aumentado
                </label>
              </div>
              <button
                id="focus-indicator"
                onClick={() => updateSetting('focusIndicator', !settings.focusIndicator)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  settings.focusIndicator ? 'bg-yellow-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.focusIndicator}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                  settings.focusIndicator ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Feedback Sonoro */}
            <div className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-violet-500" />
                <label htmlFor="sound-feedback" className="text-sm lg:font-medium text-gray-800">
                  Feedback Sonoro
                </label>
              </div>
              <button
                id="sound-feedback"
                onClick={() => updateSetting('soundFeedback', !settings.soundFeedback)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  settings.soundFeedback ? 'bg-violet-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.soundFeedback}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                  settings.soundFeedback ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Reprodução Automática */}
            <div className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-pink-500" />
                <label htmlFor="autoplay" className="text-sm lg:font-medium text-gray-800">
                  Reprodução Automática
                </label>
              </div>
              <button
                id="autoplay"
                onClick={() => updateSetting('autoplay', !settings.autoplay)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  settings.autoplay ? 'bg-pink-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.autoplay}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${
                  settings.autoplay ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
        <div className="flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs lg:text-sm font-medium text-gray-700">
            Configurações salvas automaticamente • Compatível com leitores de tela
          </span>
        </div>
      </div>
      
      {/* Accessibility Notifications */}
      {notifications.map(notification => (
        <AccessibilityNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default AdvancedAccessibility;
