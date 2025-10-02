// 🚀 APROXIMA - Performance Dashboard Component
// FASE 3: Real-time Performance Monitoring Dashboard

import React, { useState, useEffect } from 'react';
import { usePerformanceMonitoring } from '../utils/performanceTracker';

interface PerformanceDashboardProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isVisible = false,
  onClose
}) => {
  const { metrics, bundleAnalysis, generateReport, performanceScore } = usePerformanceMonitoring();
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = async () => {
    try {
      const report = await generateReport();
      console.log('📊 Performance Report:', report);
      setReportGenerated(true);
      setTimeout(() => setReportGenerated(false), 3000);
    } catch (error) {
      console.error('❌ Error generating report:', error);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRatingColor = (value: number, thresholds: [number, number], isReverse = false): string => {
    const [good, poor] = thresholds;
    
    if (isReverse) {
      if (value <= good) return 'text-green-500';
      if (value <= poor) return 'text-yellow-500';
      return 'text-red-500';
    } else {
      if (value <= good) return 'text-green-500';
      if (value <= poor) return 'text-yellow-500';
      return 'text-red-500';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-6 w-96 max-h-[600px] overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📊 Performance Monitor
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close performance dashboard"
          >
            ✕
          </button>
        )}
      </div>

      {/* Performance Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Score
          </span>
          <span className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
            {performanceScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              performanceScore >= 90 ? 'bg-green-500' :
              performanceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${performanceScore}%` }}
          />
        </div>
      </div>

      {/* Web Vitals */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
          🚀 Core Web Vitals
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">FCP</span>
            <span className={`text-sm font-mono ${getRatingColor(metrics?.fcp || 0, [2000, 4000])}`}>
              {metrics?.fcp ? `${(metrics.fcp / 1000).toFixed(2)}s` : '--'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">LCP</span>
            <span className={`text-sm font-mono ${getRatingColor(metrics?.lcp || 0, [2500, 4000])}`}>
              {metrics?.lcp ? `${(metrics.lcp / 1000).toFixed(2)}s` : '--'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">CLS</span>
            <span className={`text-sm font-mono ${getRatingColor(metrics?.cls || 0, [0.1, 0.25])}`}>
              {metrics?.cls ? metrics.cls.toFixed(3) : '--'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">FID</span>
            <span className={`text-sm font-mono ${getRatingColor(metrics?.fid || 0, [100, 300])}`}>
              {metrics?.fid ? `${metrics.fid.toFixed(0)}ms` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Bundle Analysis */}
      {bundleAnalysis && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
            📦 Bundle Analysis
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Size</span>
              <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {formatBytes(bundleAnalysis.totalSize)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Main Bundle</span>
              <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {formatBytes(bundleAnalysis.mainBundle)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Vendor Bundle</span>
              <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {formatBytes(bundleAnalysis.vendorBundle)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Compression</span>
              <span className="text-sm font-mono text-green-600">
                {bundleAnalysis.compressionRatio.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Service Worker Status */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
          ⚙️ Service Worker
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            <span className={`text-sm font-mono ${
              metrics?.serviceWorkerStatus === 'active' ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {metrics?.serviceWorkerStatus || 'unknown'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cache Hit Rate</span>
            <span className={`text-sm font-mono ${
              (metrics?.cacheHitRate || 0) > 80 ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {metrics?.cacheHitRate ? `${metrics.cacheHitRate.toFixed(1)}%` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={handleGenerateReport}
          disabled={reportGenerated}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            reportGenerated
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-700'
          }`}
        >
          {reportGenerated ? '✅ Report Generated' : '📊 Generate Report'}
        </button>
      </div>
    </div>
  );
};

// Hook to show/hide dashboard with keyboard shortcut
export function usePerformanceDashboard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl+Shift+P to toggle dashboard
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return { isVisible, setIsVisible };
}

export default PerformanceDashboard;