// pages/index.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2A1B5D' }}>
      <header className="hidden md:block">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center">
            <Image 
              src="/logo.png" 
              alt="Aproxima Saúde Inclusiva" 
              width={80} 
              height={80} 
              className="mr-4"
            />
            <div>
              <h1 style={{ color: '#FFB6F3', fontSize: '2.5rem' }}>Aproxima</h1>
              <h2 style={{ color: '#FFB6F3', fontSize: '1.8rem' }}>Saúde Inclusiva</h2>
            </div>
          </div>
        </div>
        <nav style={{ backgroundColor: '#FFB6F3' }}>
          <ul className="flex justify-center space-x-12 py-4">
            <li><Link href="/quem-somos" style={{ color: '#2A1B5D', fontSize: '1.2rem' }}>Quem somos</Link></li>
            <li><Link href="/produtos-acessiveis" style={{ color: '#2A1B5D', fontSize: '1.2rem' }}>Produtos acessíveis</Link></li>
            <li><Link href="/area-profissional" style={{ color: '#2A1B5D', fontSize: '1.2rem' }}>Área do profissional</Link></li>
            <li><Link href="/contato" style={{ color: '#2A1B5D', fontSize: '1.2rem' }}>Contato</Link></li>
          </ul>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#FFB6F3' }}>
          <h3 className="text-2xl md:text-3xl font-medium">
            Bem-vindo(a) à Aproxima Saúde Inclusiva
          </h3>
          {/* ... rest of your content ... */}
        </div>
      </main>
    </div>
  );
}
