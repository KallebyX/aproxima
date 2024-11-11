export default function Contato() {
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
              <li><a href="#" style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Quem somos</a></li>
              <li><a href="#" style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Produtos acessíveis</a></li>
              <li><a href="#" style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Área do profissional</a></li>
              <li><a href="#" style={{ color: '#2A1B5D', textDecoration: 'none', fontSize: '1.2rem' }}>Contato</a></li>
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
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            '@media (max-width: 768px)': {
              gap: '2rem',
              textAlign: 'left',
              padding: '0 1rem',
            }
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              margin: 0,
              '@media (max-width: 768px)': {
                fontSize: '1.2rem',
              }
            }}>
              Você tem alguma produto acessível que possa disponibilizar para a plataforma?
            </h3>
            
            <p style={{
              fontSize: '1.2rem',
              margin: 0,
              '@media (max-width: 768px)': {
                fontSize: '1rem',
              }
            }}>
              Entre em contato pelo e-mail disponível abaixo!
            </p>
  
            <a 
              href="mailto:rejanecassol@hotmail.com"
              style={{
                color: '#FFB6F3',
                textDecoration: 'none',
                fontSize: '1.2rem',
                marginTop: '1rem',
                '@media (max-width: 768px)': {
                  fontSize: '1rem',
                }
              }}
            >
              rejanecassol@hotmail.com
            </a>
          </div>
        </main>
      </div>
    )
  }