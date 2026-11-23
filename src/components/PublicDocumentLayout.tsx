import type { ReactNode } from 'react';
import Head from 'next/head';
import Header from '../pages/Header';
import Footer from './Footer';

export default function PublicDocumentLayout({ title, children }: { title: string; children: ReactNode }) {
  return <>
    <Head><title>{title} | Aproxima</title></Head>
    <Header />
    <main id="main-content" className="bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-sm [&_p]:leading-7 [&_li]:leading-7 [&_a]:underline-offset-4">{children}</div>
    </main>
    <Footer />
  </>;
}
