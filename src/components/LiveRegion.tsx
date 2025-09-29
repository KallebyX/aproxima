'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface LiveRegionProps {
  message?: string;
  priority?: 'polite' | 'assertive';
  clearDelay?: number;
  type?: 'status' | 'alert' | 'log';
}

const LiveRegion = ({ message, priority = 'polite', clearDelay = 3000, type = 'status' }: LiveRegionProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (message && message !== currentMessage) {
      setCurrentMessage(message);
      setMessageHistory(prev => [...prev.slice(-4), message]); // Keep last 5 messages
      
      // Clear message after delay
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setCurrentMessage('');
      }, clearDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, currentMessage, clearDelay]);

  const getRoleByType = () => {
    switch (type) {
      case 'alert': return 'alert';
      case 'log': return 'log';
      default: return 'status';
    }
  };

  return (
    <>
      {/* Main live region */}
      <div
        id={`live-region-${type}`}
        aria-live={priority}
        aria-atomic="true"
        aria-relevant="additions text"
        className="sr-only"
        role={getRoleByType()}
        tabIndex={-1}
      >
        {currentMessage}
      </div>

      {/* Backup region for better screen reader support */}
      <div
        id={`backup-region-${type}`}
        aria-live={priority === 'assertive' ? 'polite' : 'assertive'}
        aria-atomic="true"
        className="sr-only"
        role="status"
        style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px' }}
      />
    </>
  );
};

// Global Live Region Manager
export class LiveRegionManager {
  private static instance: LiveRegionManager;
  private regions: Map<string, HTMLElement> = new Map();
  private messageQueue: Array<{message: string, type: string, priority: 'polite' | 'assertive'}> = [];
  private isProcessing = false;

  static getInstance(): LiveRegionManager {
    if (!LiveRegionManager.instance) {
      LiveRegionManager.instance = new LiveRegionManager();
    }
    return LiveRegionManager.instance;
  }

  init() {
    // Create global live regions if they don't exist
    this.createRegion('status', 'status', 'polite');
    this.createRegion('navigation', 'status', 'polite');
    this.createRegion('alert', 'alert', 'assertive');
    this.createRegion('log', 'log', 'polite');
    this.createRegion('progress', 'status', 'polite');
  }

  private createRegion(id: string, role: string, ariaLive: 'polite' | 'assertive') {
    if (!document.getElementById(`live-region-${id}`)) {
      const region = document.createElement('div');
      region.id = `live-region-${id}`;
      region.setAttribute('role', role);
      region.setAttribute('aria-live', ariaLive);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      region.style.position = 'absolute';
      region.style.left = '-10000px';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.overflow = 'hidden';
      document.body.appendChild(region);
      this.regions.set(id, region);
    }
  }

  private async processMessage(message: string, type: string, priority: 'polite' | 'assertive') {
    const region = this.regions.get(type) || document.getElementById(`live-region-${type}`);
    
    if (region) {
      // Clear previous content
      region.textContent = '';
      
      // Wait for screen readers to process the clearing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Add new message
      region.textContent = message;
      
      // Log for debugging
      console.log(`[LiveRegion] Announced (${type}): ${message}`);
      
      // Clear after delay
      setTimeout(() => {
        if (region.textContent === message) {
          region.textContent = '';
        }
      }, type === 'alert' ? 7000 : 4000);
    }
  }

  async announce(message: string, type: 'status' | 'navigation' | 'alert' | 'log' | 'progress' = 'status') {
    const priority = type === 'alert' ? 'assertive' : 'polite';
    
    this.messageQueue.push({ message, type, priority });
    
    if (!this.isProcessing) {
      this.isProcessing = true;
      
      while (this.messageQueue.length > 0) {
        const { message: msg, type: msgType, priority: msgPriority } = this.messageQueue.shift()!;
        await this.processMessage(msg, msgType, msgPriority);
        
        // Wait between messages to avoid overwhelming screen readers
        if (this.messageQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      this.isProcessing = false;
    }
  }
}

// Hook para usar as live regions
export const useLiveRegion = () => {
  const manager = useRef<LiveRegionManager>();

  useEffect(() => {
    manager.current = LiveRegionManager.getInstance();
    manager.current.init();
  }, []);

  const announce = useCallback((message: string, type: 'status' | 'navigation' | 'alert' | 'log' | 'progress' = 'status') => {
    manager.current?.announce(message, type);
  }, []);

  const announceNavigation = useCallback((destination: string) => {
    announce(`Navegando para ${destination}`, 'navigation');
  }, [announce]);

  const announceError = useCallback((error: string) => {
    announce(`Erro: ${error}`, 'alert');
  }, [announce]);

  const announceSuccess = useCallback((success: string) => {
    announce(`Sucesso: ${success}`, 'status');
  }, [announce]);

  const announceProgress = useCallback((progress: string) => {
    announce(progress, 'progress');
  }, [announce]);

  const announceLog = useCallback((log: string) => {
    announce(log, 'log');
  }, [announce]);

  const announcePageChange = useCallback((pageName: string) => {
    announce(`Página carregada: ${pageName}. Use Tab para navegar ou F6 para pular entre seções.`, 'navigation');
  }, [announce]);

  const announceFormValidation = useCallback((field: string, error: string) => {
    announce(`Campo ${field}: ${error}`, 'alert');
  }, [announce]);

  const announceModalOpen = useCallback((modalName: string) => {
    announce(`Modal ${modalName} aberto. Use Escape para fechar.`, 'status');
  }, [announce]);

  const announceModalClose = useCallback((modalName: string) => {
    announce(`Modal ${modalName} fechado`, 'status');
  }, [announce]);

  return {
    announce,
    announceNavigation,
    announceError,
    announceSuccess,
    announceProgress,
    announceLog,
    announcePageChange,
    announceFormValidation,
    announceModalOpen,
    announceModalClose
  };
};

export default LiveRegion;