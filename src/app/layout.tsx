import dynamic from 'next/dynamic';

// Dynamically import VLibras to prevent SSR issues
const VLibras = dynamic(() => import('../components/VLibras'), { 
  ssr: false 
});

export const metadata = {
  title: 'Aproxima - Caderneta da Gestante Acessível | Saúde Inclusiva',
  description: 'Plataforma digital para saúde inclusiva, conectando gestantes e profissionais com acessibilidade. Caderneta da gestante acessível para pessoas com deficiência visual.',
  keywords: 'caderneta gestante, acessibilidade, deficiência visual, saúde inclusiva, V Libras, gestação, pré-natal',
  author: 'Kalleby Evangelho Mota',
  openGraph: {
    title: 'Aproxima - Caderneta da Gestante Acessível',
    description: 'Plataforma digital para saúde inclusiva com foco em acessibilidade para gestantes',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.openGraph.title} />
        <meta name="twitter:description" content={metadata.openGraph.description} />
        
        {/* Accessibility and inclusive features */}
        <meta name="theme-color" content="#2A1B5D" />
        <meta name="color-scheme" content="dark light" />

        {/* Structured data for SEO */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Aproxima - Caderneta da Gestante Acessível",
              "description": "Plataforma digital para saúde inclusiva, conectando gestantes e profissionais com acessibilidade",
              "url": "https://aproxima-six.vercel.app",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Any",
              "accessibilityFeature": [
                "screenReaderSupport",
                "keyboardNavigation",
                "highContrastDisplay",
                "signLanguageVideo"
              ],
              "accessibilityAPI": "ARIA",
              "author": {
                "@type": "Person",
                "name": "Kalleby Evangelho Mota",
                "email": "kalleby.mota@ufn.edu.br"
              },
              "provider": {
                "@type": "Organization",
                "name": "Universidade Franciscana (UFN)"
              }
            })
          }}
        />
      </head>
      <body>
        {/* Skip to main content link for screen readers */}
        <a 
          href="#main-content" 
          className="skip-link"
        >
          Pular para o conteúdo principal
        </a>
        <div id="root">
          {children}
        </div>
        <VLibras />
      </body>
    </html>
  );
}
