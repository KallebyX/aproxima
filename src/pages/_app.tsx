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

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize global live regions for screen reader announcements
    const liveRegionManager = LiveRegionManager.getInstance();
    liveRegionManager.init();
    
    // Announce page load
    setTimeout(() => {
      liveRegionManager.announce('Aplicação carregada. Use Tab para navegar ou F6 para pular entre seções principais.', 'status');
    }, 1000);
  }, []);

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
        </div>
      </KeyboardNavigation>
    </>
  );
}