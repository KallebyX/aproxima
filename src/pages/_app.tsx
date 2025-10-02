import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import Head from 'next/head';
import SkipLinks from '../components/SkipLinks';
import KeyboardNavigation from '../components/KeyboardNavigation';
import AccessibilityToggle from '../components/AccessibilityToggle';
import { FeedbackContainer } from '../components/FeedbackSystem';
import { LiveRegionManager } from '../components/LiveRegion';
import PerformanceDashboard, { usePerformanceDashboard } from '../components/PerformanceDashboard';
import { useCSSOptimization } from '../utils/criticalCSS';

// Import optimizers (they initialize automatically)
import '../utils/intelligentPreloader';
import '../utils/imageOptimizer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true
});

export default function App({ Component, pageProps }: AppProps) {
  const { isVisible, setIsVisible } = usePerformanceDashboard();
  const { isOptimized } = useCSSOptimization();

  useEffect(() => {
    // Initialize global live regions for screen reader announcements
    const liveRegionManager = LiveRegionManager.getInstance();
    liveRegionManager.init();
    
    // Announce page load
    setTimeout(() => {
      liveRegionManager.announce('Aplicação carregada. Use Tab para navegar ou F6 para pular entre seções principais.', 'status');
    }, 1000);

    // Add performance dashboard hint for developers
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 APROXIMA Performance Dashboard: Press Ctrl+Shift+P to toggle');
      console.log(`🎨 CSS Optimization: ${isOptimized ? 'Active' : 'Loading...'}`);
      console.log('🖼️ Image Optimizer: Active');
      console.log('🔮 Intelligent Preloader: Active');
    }
  }, [isOptimized]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover" />
      </Head>
      <KeyboardNavigation>
        <div className={`${inter.variable} font-sans`}>
          <SkipLinks />
          <Component {...pageProps} />
          <AccessibilityToggle />
          <FeedbackContainer />
          
          {/* Performance Dashboard - Development Only */}
          {process.env.NODE_ENV === 'development' && (
            <PerformanceDashboard 
              isVisible={isVisible} 
              onClose={() => setIsVisible(false)} 
            />
          )}
        </div>
      </KeyboardNavigation>
    </>
  );
}