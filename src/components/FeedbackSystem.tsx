'use client';

import { useEffect, useState } from 'react';

interface FeedbackProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: () => void;
}

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<Array<FeedbackProps & { id: string }>>([]);

  const addFeedback = (feedback: Omit<FeedbackProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newFeedback = {
      ...feedback,
      id,
      duration: feedback.duration || 4000,
      onClose: () => removeFeedback(id)
    };
    
    setFeedbacks(prev => [...prev, newFeedback]);
    
    // Auto remove after duration
    setTimeout(() => removeFeedback(id), newFeedback.duration);
    
    // Play sound feedback
    playFeedbackSound(feedback.type);
  };

  const removeFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const playFeedbackSound = (type: FeedbackProps['type']) => {
    if (typeof window === 'undefined') return;
    
    // Create audio context for accessibility sounds
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different feedback types
      const frequencies = {
        success: [523.25, 659.25], // C5, E5 - happy chord
        error: [196, 146.83], // G3, D3 - dissonant
        warning: [440, 493.88], // A4, B4 - alert
        info: [523.25] // C5 - neutral
      };
      
      const freq = frequencies[type];
      
      // Play sequence
      freq.forEach((f, index) => {
        setTimeout(() => {
          oscillator.frequency.setValueAtTime(f, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
        }, index * 100);
      });
    } catch (error) {
      // Fallback to system beep if audio context fails
      console.log('Audio feedback not available');
    }
  };

  return { feedbacks, addFeedback, removeFeedback };
}

function FeedbackToast({ type, message, onClose }: FeedbackProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-400 text-white shadow-green-500/25';
      case 'error':
        return 'bg-red-500 border-red-400 text-white shadow-red-500/25';
      case 'warning':
        return 'bg-yellow-500 border-yellow-400 text-white shadow-yellow-500/25';
      case 'info':
        return 'bg-blue-500 border-blue-400 text-white shadow-blue-500/25';
      default:
        return 'bg-gray-500 border-gray-400 text-white shadow-gray-500/25';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border-2 backdrop-blur-md shadow-2xl
        ${getTypeStyles()}
        hover:scale-105 transition-transform duration-200
      `}>
        <span className="text-xl font-bold" aria-hidden="true">
          {getIcon()}
        </span>
        <span className="font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="ml-2 text-white/80 hover:text-white hover:scale-110 transition-all duration-200 focus:outline-none"
          aria-label="Fechar notificação"
        >
          <span className="text-sm font-bold" aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
}

export function FeedbackContainer() {
  const { feedbacks } = useFeedback();

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="flex flex-col gap-2 p-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="pointer-events-auto">
            <FeedbackToast {...feedback} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default useFeedback;