import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html 
      lang="pt-BR" 
      dir="ltr"
      className="scroll-smooth"
    >
      <Head>
        <meta charSet="utf-8" />
        
        {/* Accessibility meta tags */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-navbutton-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Preload critical resources */}
        <link 
          rel="preload" 
          href="/fonts/inter-var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* Icons for better UX */}
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        
        {/* Ensure proper rendering */}
        <meta name="robots" content="index,follow" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <body 
        className="min-h-screen bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        {/* Skip to main content for screen readers */}
        <a 
          href="#main-content" 
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:no-underline focus:rounded"
        >
          Pular para o conteúdo principal
        </a>
        
        <Main />
        <NextScript />
        
        {/* No-JS fallback message */}
        <noscript>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              backgroundColor: '#fef3cd',
              color: '#856404',
              padding: '12px',
              textAlign: 'center',
              fontSize: '14px',
              borderBottom: '1px solid #ffeaa7',
              zIndex: 9999
            }}
          >
            Este site funciona melhor com JavaScript habilitado.
          </div>
        </noscript>
      </body>
    </Html>
  );
}