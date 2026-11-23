'use client';

import { useEffect, useState } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  underlinkText: boolean;
  magnification: number;
  reducedMotion: boolean;
  focusIndicator: boolean;
  soundFeedback: boolean;
  autoplay: boolean;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  underlinkText: false,
  magnification: 100,
  reducedMotion: false,
  focusIndicator: true,
  soundFeedback: false,
  autoplay: true
};

function normalizeSettings(values: Record<string, unknown>): Partial<AccessibilitySettings> {
  const normalized: Partial<AccessibilitySettings> = {};
  const booleanKeys = ['highContrast', 'largeText', 'underlinkText', 'reducedMotion', 'focusIndicator', 'soundFeedback', 'autoplay'] as const;
  for (const key of booleanKeys) {
    if (typeof values[key] === 'boolean') normalized[key] = values[key];
  }
  if (typeof values.magnification === 'number' && [75, 100, 125, 150, 175, 200].includes(values.magnification)) {
    normalized.magnification = values.magnification;
  }
  return normalized;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let saved: Partial<AccessibilitySettings> | null = null;
    try {
      const raw = localStorage.getItem('accessibility-settings');
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          saved = normalizeSettings(parsed as Record<string, unknown>);
        }
      }
    } catch {
      // A blocked or invalid browser store must not stop the panel from opening.
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrast = window.matchMedia('(prefers-contrast: high)');
    setSettings({
      ...defaultSettings,
      reducedMotion: reducedMotion.matches,
      highContrast: highContrast.matches,
      ...saved,
    });

    const onMotionChange = () => setSettings(previous => ({ ...previous, reducedMotion: reducedMotion.matches }));
    const onContrastChange = () => setSettings(previous => ({ ...previous, highContrast: highContrast.matches }));
    const onSettingsChange = (event: Event) => {
      const values: unknown = (event as CustomEvent).detail;
      if (values && typeof values === 'object' && !Array.isArray(values)) {
        setSettings({ ...defaultSettings, ...normalizeSettings(values as Record<string, unknown>) });
      }
    };
    const onStorageChange = (event: StorageEvent) => {
      if (event.key !== 'accessibility-settings') return;
      try {
        const values: unknown = event.newValue ? JSON.parse(event.newValue) : {};
        if (values && typeof values === 'object' && !Array.isArray(values)) {
          setSettings({ ...defaultSettings, ...normalizeSettings(values as Record<string, unknown>) });
        }
      } catch { /* Ignore malformed changes from another tab. */ }
    };
    reducedMotion.addEventListener('change', onMotionChange);
    highContrast.addEventListener('change', onContrastChange);
    window.addEventListener('aproxima-accessibility-change', onSettingsChange);
    window.addEventListener('storage', onStorageChange);
    return () => {
      reducedMotion.removeEventListener('change', onMotionChange);
      highContrast.removeEventListener('change', onContrastChange);
      window.removeEventListener('aproxima-accessibility-change', onSettingsChange);
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...settings, ...normalizeSettings(newSettings) };
    setSettings(updated);
    try { localStorage.setItem('accessibility-settings', JSON.stringify(updated)); }
    catch { /* The current page still applies preferences if storage is unavailable. */ }
    window.dispatchEvent(new CustomEvent('aproxima-accessibility-change', { detail: updated }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try { localStorage.removeItem('accessibility-settings'); }
    catch { /* Reset also works when persistent browser storage is unavailable. */ }
    window.dispatchEvent(new CustomEvent('aproxima-accessibility-change', { detail: defaultSettings }));
  };

  // Apply settings to DOM
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const body = document.body;

    // High Contrast
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Large Text
    root.classList.toggle('large-text', settings.largeText);
    
    // Underlined Links
    root.classList.toggle('underline-links', settings.underlinkText);
    
    // Page Magnification
    if (settings.magnification !== 100) {
      const scale = settings.magnification / 100;
      body.style.zoom = `${scale}`;
    } else {
      body.style.zoom = '';
    }
    
    // Reduced Motion
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    
    // Enhanced Focus
    root.classList.toggle('enhanced-focus', settings.focusIndicator);
    
    // Sound Feedback
    root.classList.toggle('sound-feedback', settings.soundFeedback);
    
    // Autoplay control
    if (!settings.autoplay) {
      const mediaElements = document.querySelectorAll('video[autoplay], audio[autoplay]');
      mediaElements.forEach((element) => {
        const mediaElement = element as HTMLMediaElement;
        mediaElement.autoplay = false;
        mediaElement.pause();
      });
    }

  }, [settings, mounted]);

  return {
    settings,
    updateSettings,
    resetSettings,
    mounted
  };
};
