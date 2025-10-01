'use client';

import { useState, useEffect } from 'react';

interface AccessibilityNotificationProps {
  message: string;
  type?: 'success' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export const AccessibilityNotification = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}: AccessibilityNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black'
  };

  const typeIcons = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠'
  };

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${typeStyles[type]}
      `}
      role="alert"
      aria-live="polite"
    >
      <span className="text-lg font-bold" aria-hidden="true">
        {typeIcons[type]}
      </span>
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="ml-2 text-lg hover:opacity-70 transition-opacity"
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
};

// Hook para gerenciar notificações
export const useAccessibilityNotification = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning';
    duration?: number;
  }>>([]);

  const addNotification = (
    message: string, 
    type: 'success' | 'info' | 'warning' = 'info',
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
};