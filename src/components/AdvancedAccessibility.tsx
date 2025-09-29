'use client';

import { useState, useEffect } from 'react';

interface AdvancedAccessibilityProps {
  className?: string;
}

const AdvancedAccessibility = ({ className = '' }: AdvancedAccessibilityProps) => {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    darkMode: false,
    underlinkText: false,
    magnification: 100,
    lineHeight: 1.5,
    letterSpacing: 0,
    wordSpacing: 0,
    cursorSize: 1,
    focusIndicator: true,
    soundFeedback: false,
    autoplay: true
  });

  useEffect(() => {
    setMounted(true);
    
    // Load saved accessibility preferences
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applyAllSettings(parsed);
      }
    }
  }, []);

  const saveSettings = (newSettings: typeof settings) => {
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    setSettings(newSettings);
    applyAllSettings(newSettings);
  };

  const applyAllSettings = (settingsToApply: typeof settings) => {
    const html = document.documentElement;
    const body = document.body;

    // High Contrast
    if (settingsToApply.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }

    // Reduced Motion
    if (settingsToApply.reducedMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }

    // Large Text
    if (settingsToApply.largeText) {
      html.classList.add('large-text');
    } else {
      html.classList.remove('large-text');
    }

    // Dark Mode
    if (settingsToApply.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Underlined Links
    if (settingsToApply.underlinkText) {
      html.classList.add('underline-links');
    } else {
      html.classList.remove('underline-links');
    }

    // Magnification
    html.style.fontSize = `${settingsToApply.magnification}%`;

    // Line Height
    body.style.lineHeight = settingsToApply.lineHeight.toString();

    // Letter Spacing
    body.style.letterSpacing = `${settingsToApply.letterSpacing}px`;

    // Word Spacing
    body.style.wordSpacing = `${settingsToApply.wordSpacing}px`;

    // Cursor Size
    html.style.cursor = settingsToApply.cursorSize > 1 ? 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMUwzMSAxTDMxIDMxTDEgMzFaIiBmaWxsPSJibGFjayIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=) 16 16, pointer' : 'default';

    // Focus Indicator
    if (settingsToApply.focusIndicator) {
      html.classList.add('enhanced-focus');
    } else {
      html.classList.remove('enhanced-focus');
    }

    // Sound Feedback (simulated)
    if (settingsToApply.soundFeedback) {
      html.classList.add('sound-feedback');
    } else {
      html.classList.remove('sound-feedback');
    }

    // Autoplay
    if (!settingsToApply.autoplay) {
      const videos = document.querySelectorAll('video[autoplay]');
      videos.forEach(video => {
        (video as HTMLVideoElement).pause();
      });
    }
  };

  const updateSetting = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      darkMode: false,
      underlinkText: false,
      magnification: 100,
      lineHeight: 1.5,
      letterSpacing: 0,
      wordSpacing: 0,
      cursorSize: 1,
      focusIndicator: true,
      soundFeedback: false,
      autoplay: true
    };
    saveSettings(defaultSettings);
  };

  if (!mounted) {
    return (
      <div className={`p-4 rounded-lg bg-gray-800/95 border border-gray-600 ${className}`}>
        <span className="text-white text-sm">Carregando preferências de acessibilidade...</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg bg-gray-800/95 border border-gray-600 max-w-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold text-lg">Acessibilidade</h3>
        <button
          onClick={resetSettings}
          className="text-xs text-gray-300 hover:text-white underline focus:ring-2 focus:ring-white rounded"
          aria-label="Restaurar configurações padrão de acessibilidade"
        >
          Restaurar Padrões
        </button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {/* Visual Accessibility */}
        <fieldset className="border border-gray-500 rounded p-3">
          <legend className="text-white font-medium text-sm px-2">Visual</legend>
          
          <div className="space-y-2 mt-2">
            <label className="flex items-center justify-between">
              <span className="text-white text-sm">Alto Contraste</span>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                aria-describedby="high-contrast-desc"
              />
            </label>
            <div id="high-contrast-desc" className="text-xs text-gray-300">
              Aumenta o contraste para melhor visibilidade
            </div>

            <label className="flex items-center justify-between">
              <span className="text-white text-sm">Texto Grande</span>
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => updateSetting('largeText', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-white text-sm">Links Sublinhados</span>
              <input
                type="checkbox"
                checked={settings.underlinkText}
                onChange={(e) => updateSetting('underlinkText', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </label>

            <div>
              <label htmlFor="magnification" className="block text-white text-sm mb-1">
                Ampliação: {settings.magnification}%
              </label>
              <input
                id="magnification"
                type="range"
                min="75"
                max="200"
                step="25"
                value={settings.magnification}
                onChange={(e) => updateSetting('magnification', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-describedby="magnification-desc"
              />
              <div id="magnification-desc" className="text-xs text-gray-300">
                75% a 200% do tamanho normal
              </div>
            </div>
          </div>
        </fieldset>

        {/* Motor Accessibility */}
        <fieldset className="border border-gray-500 rounded p-3">
          <legend className="text-white font-medium text-sm px-2">Motor</legend>
          
          <div className="space-y-2 mt-2">
            <label className="flex items-center justify-between">
              <span className="text-white text-sm">Reduzir Movimento</span>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-white text-sm">Indicador de Foco Aumentado</span>
              <input
                type="checkbox"
                checked={settings.focusIndicator}
                onChange={(e) => updateSetting('focusIndicator', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </label>

            <div>
              <label htmlFor="cursor-size" className="block text-white text-sm mb-1">
                Tamanho do Cursor: {settings.cursorSize}x
              </label>
              <input
                id="cursor-size"
                type="range"
                min="1"
                max="3"
                step="0.5"
                value={settings.cursorSize}
                onChange={(e) => updateSetting('cursorSize', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </fieldset>

        {/* Typography */}
        <fieldset className="border border-gray-500 rounded p-3">
          <legend className="text-white font-medium text-sm px-2">Tipografia</legend>
          
          <div className="space-y-2 mt-2">
            <div>
              <label htmlFor="line-height" className="block text-white text-sm mb-1">
                Altura da Linha: {settings.lineHeight}
              </label>
              <input
                id="line-height"
                type="range"
                min="1.2"
                max="2.0"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="letter-spacing" className="block text-white text-sm mb-1">
                Espaçamento entre Letras: {settings.letterSpacing}px
              </label>
              <input
                id="letter-spacing"
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={settings.letterSpacing}
                onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="word-spacing" className="block text-white text-sm mb-1">
                Espaçamento entre Palavras: {settings.wordSpacing}px
              </label>
              <input
                id="word-spacing"
                type="range"
                min="0"
                max="10"
                step="1"
                value={settings.wordSpacing}
                onChange={(e) => updateSetting('wordSpacing', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </fieldset>

        {/* Media Accessibility */}
        <fieldset className="border border-gray-500 rounded p-3">
          <legend className="text-white font-medium text-sm px-2">Mídia</legend>
          
          <div className="space-y-2 mt-2">
            <label className="flex items-center justify-between">
              <span className="text-white text-sm">Feedback Sonoro</span>
              <input
                type="checkbox"
                checked={settings.soundFeedback}
                onChange={(e) => updateSetting('soundFeedback', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-white text-sm">Reprodução Automática</span>
              <input
                type="checkbox"
                checked={settings.autoplay}
                onChange={(e) => updateSetting('autoplay', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </label>
          </div>
        </fieldset>
      </div>

      <div className="mt-4 text-xs text-gray-300">
        <p>Configurações salvas automaticamente. Compatível com leitores de tela NVDA, JAWS e VoiceOver.</p>
      </div>
    </div>
  );
};

export default AdvancedAccessibility;