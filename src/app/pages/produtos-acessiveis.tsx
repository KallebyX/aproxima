export default function ProdutosAcessiveis() {
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
              <li><a href="#" style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Quem somos</a></li>
              <li><a href="#" style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Produtos acessíveis</a></li>
              <li><a href="#" style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Área do profissional</a></li>
              <li><a href="#" style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Contato</a></li>
            </ul>
          </nav>
  
          {/* Mobile Header */}
          <div style={{
            display: 'none',
            width: '100%',
            '@media (max-width: 768px)': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              borderBottom: '2px solid #FFB6F3',
            }
          }}>
            <button 
              aria-label="Menu"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFB6F3" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </header>
  
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            '@media (max-width: 768px)': {
              fontSize: '1.2rem',
            }
          }}>
            Abaixo estão disponíveis arquivos acessíveis relacionados à saúde
          </h3>
          
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '3rem',
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Basta clicar em cima e baixar o conteúdo.
          </p>
  
          <button
            style={{
              backgroundColor: '#FFB6F3',
              color: '#2A1B5D',
              border: 'none',
              borderRadius: '1rem',
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              width: 'auto',
              maxWidth: '600px',
              margin: '0 auto',
              display: 'block',
              '@media (max-width: 768px)': {
                fontSize: '1rem',
                padding: '1rem 1.5rem',
              }
            }}
          >
            Caderneta da Gestante Acessível para Pessoas com Deficiência Visual
          </button>
  
          <div style={{
            marginTop: '4rem',
            fontSize: '1.2rem',
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            <p style={{ marginBottom: '1rem' }}>
              Você tem algum produto acessível que possa disponibilizar para a plataforma?
            </p>
            <p>
              Entre em contato pelo e-mail{' '}
              <a 
                href="mailto:rejanecassol@hotmail.com"
                style={{
                  color: '#FFB6F3',
                  textDecoration: 'none',
                }}
              >
                rejanecassol@hotmail.com
              </a>
            </p>
          </div>
        </main>
      </div>
    )
  }