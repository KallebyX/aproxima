import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Baby, BookOpen, Hand, HeartHandshake, Keyboard, MessageCircle, Settings2, Stethoscope, Users } from 'lucide-react';
import Header from './Header';
import Footer from '../components/Footer';

const VLibras = dynamic(() => import('../components/VLibras'), { ssr: false });
const areas = [
  { title: 'Área da Gestante', description: 'Cadernetas e materiais para acompanhar a gestação e a chegada do bebê.', href: '/gestante', icon: Baby, action: 'Ver materiais para gestantes', accent: 'rose' },
  { title: 'Área do Profissional', description: 'Recursos para apoiar um cuidado acolhedor e atento às diferentes necessidades.', href: '/area-do-profissional', icon: Stethoscope, action: 'Explorar recursos', accent: 'violet' },
  { title: 'Produtos Acessíveis', description: 'Conheça materiais que ajudam a tornar a informação em saúde mais acessível.', href: '/produtos-acessiveis', icon: BookOpen, action: 'Conhecer os materiais', accent: 'teal' },
  { title: 'Quem Somos', description: 'Conheça as pessoas, a pesquisa e o compromisso que fazem parte do Aproxima.', href: '/quem-somos', icon: Users, action: 'Conhecer o projeto', accent: 'slate' },
];
const features = [
  { title: 'Navegação por teclado', description: 'Acesse os links e controles usando o teclado e os atalhos de navegação.', icon: Keyboard },
  { title: 'Leitura do seu jeito', description: 'Ajuste o tamanho do texto, o contraste e outras preferências no painel de acessibilidade.', icon: Settings2 },
  { title: 'Tradução em Libras', description: 'Use o tradutor VLibras disponível no site para apoiar a leitura dos conteúdos.', icon: Hand },
];

export default function HomePage() {
  return <>
    <Head>
      <title>Aproxima — Saúde inclusiva para gestantes e profissionais</title>
      <meta name="description" content="Cadernetas e materiais de saúde materna para gestantes, famílias e profissionais. Informação, acolhimento e recursos de acessibilidade em um só lugar." />
      <meta property="og:title" content="Aproxima — Saúde inclusiva" />
      <meta property="og:description" content="Informação e cuidado para aproximar gestantes, famílias e profissionais de saúde." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://aproxima.app.ufn.edu.br/" />
      <link rel="canonical" href="https://aproxima.app.ufn.edu.br/" />
    </Head>
    <div className="aproxima-home min-h-screen">
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className="aproxima-hero" aria-labelledby="hero-heading">
          <div className="aproxima-container grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-20">
            <div>
              <p className="aproxima-eyebrow mb-5"><HeartHandshake size={17} aria-hidden="true" />Saúde materna e inclusão</p>
              <h1 id="hero-heading" className="max-w-2xl text-[2.15rem] font-semibold leading-[1.16] tracking-[-0.035em] text-[#30213f] sm:text-5xl lg:text-[3.4rem]">Caderneta da Gestante<span className="mt-2 block text-[#765092]">Informação que cuida.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#655c6e] sm:text-lg">Materiais de saúde para viver a gestação com mais informação, acolhimento e autonomia. Para gestantes, famílias e profissionais.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/gestante" className="aproxima-button aproxima-button-primary">Acessar a caderneta<ArrowRight size={18} aria-hidden="true" /></Link><Link href="/quem-somos" className="aproxima-button aproxima-button-secondary">Conhecer o projeto</Link></div>
              <p className="mt-6 flex items-center gap-2 text-sm text-[#756a7e]"><BookOpen size={16} aria-hidden="true" />Materiais gratuitos para consultar no seu ritmo.</p>
            </div>
            <div className="aproxima-start-panel" aria-labelledby="start-heading">
              <div className="mb-6 flex items-start gap-4"><span className="aproxima-icon"><BookOpen size={24} aria-hidden="true" /></span><div><p className="aproxima-eyebrow mb-1">Encontre seu caminho</p><h2 id="start-heading" className="text-xl font-semibold tracking-tight text-[#30213f]">Como podemos ajudar?</h2></div></div>
              <ul className="space-y-2">
                <li><Link href="/gestante" className="aproxima-start-link"><Baby size={21} aria-hidden="true" /><span><strong>Sou gestante ou familiar</strong><small>Orientações e materiais para essa fase</small></span><ArrowRight size={17} aria-hidden="true" /></Link></li>
                <li><Link href="/area-do-profissional" className="aproxima-start-link"><Stethoscope size={21} aria-hidden="true" /><span><strong>Sou profissional de saúde</strong><small>Recursos para apoiar o cuidado</small></span><ArrowRight size={17} aria-hidden="true" /></Link></li>
                <li><Link href="/produtos-acessiveis" className="aproxima-start-link"><BookOpen size={21} aria-hidden="true" /><span><strong>Quero conhecer os materiais</strong><small>Explore os produtos do projeto</small></span><ArrowRight size={17} aria-hidden="true" /></Link></li>
              </ul>
            </div>
          </div>
        </section>
        <section id="navigation-section" className="aproxima-container py-12 sm:py-16" aria-labelledby="navigation-heading">
          <div className="mb-8 max-w-2xl"><p className="aproxima-eyebrow mb-3">Explore a plataforma</p><h2 id="navigation-heading" className="text-2xl font-semibold tracking-tight text-[#30213f] sm:text-3xl">O cuidado começa com informação.</h2><p className="mt-3 text-base leading-7 text-[#6a6073]">Escolha uma área para encontrar os materiais que fazem sentido para você.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{areas.map(area => <Link key={area.href} href={area.href} className={`aproxima-area-card aproxima-area-${area.accent}`}><span className="aproxima-icon"><area.icon size={23} aria-hidden="true" /></span><h3 className="mt-6 text-lg font-semibold tracking-tight text-[#30213f]">{area.title}</h3><p className="mb-6 mt-3 flex-1 text-sm leading-7 text-[#6a6073]">{area.description}</p><span className="inline-flex items-center gap-2 text-sm font-semibold text-[#64428b]">{area.action}<ArrowRight size={16} aria-hidden="true" /></span></Link>)}</div>
        </section>
        <section id="features-section" className="border-y border-[#e9e3ee] bg-white" aria-labelledby="features-heading">
          <div className="aproxima-container py-12 sm:py-16"><div className="mb-8 max-w-2xl"><p className="aproxima-eyebrow mb-3">Mais formas de acessar</p><h2 id="features-heading" className="text-2xl font-semibold tracking-tight text-[#30213f] sm:text-3xl">Uma experiência que se adapta.</h2><p className="mt-3 text-base leading-7 text-[#6a6073]">Conheça os recursos disponíveis e escolha o que ajuda na sua navegação.</p></div><ul className="grid gap-7 md:grid-cols-3">{features.map(feature => <li key={feature.title} className="flex items-start gap-4"><span className="aproxima-icon !h-11 !w-11 !rounded-xl"><feature.icon size={21} aria-hidden="true" /></span><div><h3 className="text-base font-semibold text-[#30213f]">{feature.title}</h3><p className="mt-2 text-sm leading-7 text-[#6a6073]">{feature.description}</p></div></li>)}</ul></div>
        </section>
        <section id="contact-section" className="aproxima-container py-12 sm:py-16" aria-labelledby="contact-heading"><div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#e5dceb] bg-[#eee7f3] p-6 sm:p-8 lg:flex-row lg:items-center"><div className="flex items-start gap-4"><span className="aproxima-icon !bg-white"><MessageCircle size={23} aria-hidden="true" /></span><div><h2 id="contact-heading" className="text-xl font-semibold tracking-tight text-[#30213f]">Precisa de ajuda ou quer conversar?</h2><p className="mt-2 max-w-lg text-sm leading-7 text-[#65566f]">Compartilhe uma dúvida, uma sugestão ou uma dificuldade de acesso com a nossa equipe.</p></div></div><Link href="/contato" className="aproxima-button aproxima-button-primary shrink-0">Falar com a equipe<ArrowRight size={17} aria-hidden="true" /></Link></div></section>
      </main>
      <VLibras position="bottom-right" avatar="icaro" opacity={0.95} />
      <Footer />
    </div>
  </>;
}
