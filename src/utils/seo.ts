// utils/seo.ts - Utilities para SEO dinâmico

// Interface local para substituir NextSeoProps
export interface NextSeoProps {
  title?: string;
  titleTemplate?: string;
  defaultTitle?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    type?: string;
    title?: string;
    description?: string;
    url?: string;
    locale?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
      type?: string;
    }>;
  };
  twitter?: {
    handle?: string;
    site?: string;
    cardType?: string;
  };
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
    type?: string;
    media?: string;
    sizes?: string;
  }>;
}

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogType?: string;
  ogImage?: string;
  structuredData?: any;
}

export const defaultSEO: NextSeoProps = {
  titleTemplate: '%s | Aproxima - Saúde Inclusiva',
  defaultTitle: 'Aproxima - Saúde Inclusiva e Acessível',
  description: 'Plataforma de saúde inclusiva com foco em acessibilidade e cuidado humanizado para gestantes e profissionais de saúde. Conformidade WCAG 2.1 AAA.',
  canonical: 'https://aproxima.com.br',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://aproxima.com.br',
    siteName: 'Aproxima',
    title: 'Aproxima - Saúde Inclusiva e Acessível',
    description: 'Plataforma de saúde inclusiva com foco em acessibilidade e cuidado humanizado para gestantes e profissionais de saúde.',
    images: [
      {
        url: 'https://aproxima.com.br/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Aproxima - Saúde Inclusiva',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    handle: '@aproxima_saude',
    site: '@aproxima_saude',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'saúde inclusiva, acessibilidade, gestantes, profissionais saúde, WCAG, libras, cuidado humanizado, telemedicina acessível',
    },
    {
      name: 'author',
      content: 'Aproxima - Saúde Inclusiva',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover',
    },
    {
      name: 'theme-color',
      content: '#2A1B5D',
    },
    {
      name: 'msapplication-TileColor',
      content: '#2A1B5D',
    },
    {
      name: 'application-name',
      content: 'Aproxima',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Aproxima',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent',
    },
    {
      name: 'format-detection',
      content: 'telephone=no, date=no, email=no, address=no',
    },
    {
      property: 'og:locale:alternate',
      content: 'pt_BR',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
    {
      rel: 'sitemap',
      type: 'application/xml',
      href: '/sitemap.xml',
    },
  ],
};

export const generatePageSEO = (data: SEOData): NextSeoProps => ({
  title: data.title,
  description: data.description,
  canonical: data.canonical || `https://aproxima.com.br`,
  openGraph: {
    title: data.title,
    description: data.description,
    url: data.canonical || `https://aproxima.com.br`,
    type: data.ogType || 'website',
    images: data.ogImage ? [
      {
        url: data.ogImage,
        width: 1200,
        height: 630,
        alt: data.title,
      }
    ] : undefined,
  },
  additionalMetaTags: data.keywords ? [
    {
      name: 'keywords',
      content: data.keywords.join(', '),
    },
  ] : undefined,
});

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aproxima - Saúde Inclusiva',
  description: 'Plataforma de saúde inclusiva com foco em acessibilidade e cuidado humanizado para gestantes e profissionais de saúde.',
  url: 'https://aproxima.com.br',
  logo: 'https://aproxima.com.br/favicon.png',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-99999-9999',
    contactType: 'customer service',
    availableLanguage: ['Portuguese', 'Brazilian Sign Language']
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
    addressLocality: 'Brasil'
  },
  sameAs: [
    'https://aproxima.com.br'
  ],
  offers: {
    '@type': 'Offer',
    description: 'Serviços de saúde inclusiva e acessível'
  },
  accessibility: {
    '@type': 'WebAccessibility',
    accessibilityAPI: ['ARIA'],
    accessibilityControl: ['fullKeyboardControl', 'fullMouseControl', 'fullTouchControl'],
    accessibilityFeature: ['highContrastDisplay', 'largePrint', 'signLanguage', 'audioDescription'],
    accessibilityHazard: 'none',
    accessibilitySummary: 'Site 100% acessível com conformidade WCAG 2.1 AAA'
  }
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'Website',
  name: 'Aproxima - Saúde Inclusiva',
  url: 'https://aproxima.com.br',
  description: 'Plataforma de saúde inclusiva com foco em acessibilidade e cuidado humanizado.',
  inLanguage: 'pt-BR',
  publisher: organizationSchema,
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://aproxima.com.br/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};