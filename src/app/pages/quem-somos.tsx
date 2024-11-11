import Link from 'next/link';

export default function QuemSomos() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#2A1B5D',
      color: '#FFB6F3',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Desktop Header */}
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          '@media (max-width: 768px)': {
            width: '100%',
            justifyContent: 'space-between',
          }
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <img 
              src="/logo.svg" 
              alt="Aproxima Logo" 
              style={{
                width: '60px',
                height: '60px',
                '@media (max-width: 768px)': {
                  width: '40px',
                  height: '40px',
                }
              }}
            />
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                margin: 0,
                '@media (max-width: 768px)': {
                  fontSize: '1.8rem',
                }
              }}>
                Aproxima
              </h1>
              <h2 style={{
                fontSize: '1.8rem',
                margin: 0,
                '@media (max-width: 768px)': {
                  fontSize: '1.4rem',
                }
              }}>
                Saúde Inclusiva
              </h2>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            aria-label="Menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              '@media (max-width: 768px)': {
                display: 'block',
              }
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFB6F3" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav style={{
          width: '100%',
          backgroundColor: '#FFB6F3',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
          '@media (max-width: 768px)': {
            display: 'none',
          }
        }}>
          <ul style={{
            display: 'flex',
            gap: '4rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}>
            <li><Link href="/quem-somos" passHref style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Quem somos</Link></li>
            <li><Link href="/produtos-acessiveis" passHref style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Produtos acessíveis</Link></li>
            <li><Link href="/area-do-profissional" passHref style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Área do profissional</Link></li>
            <li><Link href="/contato" passHref style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Contato</Link></li>
          </ul>
        </nav>

        {/* Mobile Header Border */}
        <div style={{
          display: 'none',
          width: '100%',
          borderBottom: '2px solid #FFB6F3',
          '@media (max-width: 768px)': {
            display: 'block',
          }
        }} />
      </header>

      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
        textAlign: 'center',
        '@media (max-width: 768px)': {
          textAlign: 'left',
          padding: '2rem 1.5rem',
        }
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
          <h3 style={{
            fontSize: '2rem',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1.5rem',
            }
          }}>
            Bem-vindo(a) à Aproxima Saúde Inclusiva
          </h3>
          
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Nossa página surgiu com um propósito muito especial: facilitar o acesso às informações de saúde, 
            especialmente para pessoas com deficiência visual. Aqui, nos dedicamos a criar uma experiência 
            verdadeiramente inclusiva, onde os conteúdos são apresentados de maneira acessível, intuitiva e 
            adaptada às necessidades de quem utiliza tecnologias assistivas, como leitores de tela.
          </p>
          
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Nosso objetivo é tornar a saúde acessível a todos, incluindo pessoas com deficiência. Estamos 
            comprometidos em garantir que todos tenham acesso a informações de saúde de forma equitativa e 
            sem barreiras.
          </p>
          
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Explore nossos recursos acessíveis e junte-se à nossa missão de tornar os serviços e produtos 
            saúde mais acessíveis!
          </p>
          
          <p style={{
            fontSize: '1.2rem',
            margin: '1rem 0 0 0',
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Obrigada pela sua visita!
          </p>
        </div>
      </main>
    </div>
  )
}
