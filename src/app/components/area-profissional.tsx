'use client'

export default function AreaProfissional() {
  const copyText = () => {
    const textArea = document.querySelector('textarea')
    if (textArea) {
      navigator.clipboard.writeText(textArea.value)
    }
  }

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
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
          <p style={{
            fontSize: '1.5rem',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1.2rem',
            }
          }}>
            Esta seção é destinada aos profissionais de saúde – médicos e dentistas – terem um melhor contato com seus pacientes.
          </p>

          <p style={{
            fontSize: '1.2rem',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Abaixo, preencha as informações que serão enviadas ao seu paciente.
          </p>

          <p style={{
            fontSize: '1.2rem',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Comece com seu nome, os dados do paciente e a data que foi realizada a consulta.
          </p>

          <p style={{
            fontSize: '1.2rem',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Descreva os resultados do exame ou consulta de maneira clara e detalhada para o paciente ter entendimento.
          </p>

          <p style={{
            fontSize: '1.2rem',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Coloque as orientações finais e a data da próxima consulta do seu paciente.
          </p>

          <p style={{
            fontSize: '1.2rem',
            margin: 0,
            '@media (max-width: 768px)': {
              fontSize: '1rem',
            }
          }}>
            Ao final, copie o texto pelo botão abaixo, abra seu e-mail, coloque as informações e envie-as para o e-mail de seu paciente.
          </p>

          <textarea
            aria-label="Área de texto para informações do paciente"
            style={{
              width: '100%',
              height: '200px',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              resize: 'vertical',
              marginTop: '1rem',
            }}
          />

          <button
            onClick={copyText}
            style={{
              backgroundColor: '#FFB6F3',
              color: '#2A1B5D',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              alignSelf: 'flex-end',
              '@media (max-width: 768px)': {
                fontSize: '1rem',
              }
            }}
          >
            Copiar dados
          </button>
        </div>
      </main>
    </div>
  )
}