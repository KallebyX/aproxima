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
        
        {/* DNS Prefetch para performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//vlibras.gov.br" />
        
        {/* Preconnect para recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* SEO Meta Tags Avançadas */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        <meta name="bingbot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://aproxima.com.br" />
        
        {/* Hreflang para SEO internacional */}
        <link rel="alternate" hrefLang="pt-BR" href="https://aproxima.com.br" />
        <link rel="alternate" hrefLang="pt" href="https://aproxima.com.br" />
        <link rel="alternate" hrefLang="x-default" href="https://aproxima.com.br" />
        
        {/* Accessibility e UX meta tags */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#2A1B5D" />
        <meta name="msapplication-TileColor" content="#2A1B5D" />
        <meta name="msapplication-navbutton-color" content="#2A1B5D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Aproxima" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        
        {/* Performance e Security Headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* Preload recursos críticos */}
        <link 
          rel="preload" 
          href="/fonts/inter-var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* Favicon otimizado */}
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="mask-icon" href="/favicon.png" color="#2A1B5D" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aproxima - Saúde Inclusiva",
              "description": "Plataforma de saúde inclusiva com foco em acessibilidade e cuidado humanizado para gestantes e profissionais de saúde.",
              "url": "https://aproxima.com.br",
              "logo": "https://aproxima.com.br/favicon.png",
              "foundingDate": "2024",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-99999-9999",
                "contactType": "customer service",
                "availableLanguage": ["Portuguese", "Brazilian Sign Language"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR",
                "addressLocality": "Brasil"
              },
              "sameAs": [
                "https://aproxima.com.br"
              ],
              "offers": {
                "@type": "Offer",
                "description": "Serviços de saúde inclusiva e acessível"
              },
              "accessibility": {
                "@type": "WebAccessibility",
                "accessibilityAPI": ["ARIA"],
                "accessibilityControl": ["fullKeyboardControl", "fullMouseControl", "fullTouchControl"],
                "accessibilityFeature": ["highContrastDisplay", "largePrint", "signLanguage", "audioDescription"],
                "accessibilityHazard": "none",
                "accessibilitySummary": "Site 100% acessível com conformidade WCAG 2.1 AAA"
              }
            })
          }}
        />
        
        {/* Performance optimization */}
        <meta name="next-head-count" content="0" />
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