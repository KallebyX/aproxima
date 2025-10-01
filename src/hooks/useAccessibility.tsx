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

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load settings from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (error) {
          console.warn('Failed to parse accessibility settings:', error);
        }
      }

      // Detect system preferences
      const detectSystemPreferences = () => {
        const mediaQueries = {
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
          highContrast: window.matchMedia('(prefers-contrast: high)'),
          colorScheme: window.matchMedia('(prefers-color-scheme: dark)')
        };

        // Apply system preferences if no user settings exist
        if (!saved) {
          setSettings(prev => ({
            ...prev,
            reducedMotion: mediaQueries.reducedMotion.matches,
            highContrast: mediaQueries.highContrast.matches
          }));
        }

        // Listen for changes in system preferences
        Object.entries(mediaQueries).forEach(([key, mq]) => {
          mq.addEventListener('change', () => {
            if (key === 'reducedMotion') {
              setSettings(prev => ({ ...prev, reducedMotion: mq.matches }));
            } else if (key === 'highContrast') {
              setSettings(prev => ({ ...prev, highContrast: mq.matches }));
            }
          });
        });
      };

      detectSystemPreferences();
    }
  }, []);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-settings', JSON.stringify(updated));
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessibility-settings');
    }
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