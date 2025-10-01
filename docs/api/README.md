# 🔌 API Reference - Aproxima

## 📋 Visão Geral

A API da Aproxima fornece endpoints seguros e acessíveis para integração com sistemas hospitalares e aplicações terceiras. Todas as APIs seguem padrões REST e incluem validação robusta de dados.

## 🔐 Autenticação

### Headers Obrigatórios

```http
Content-Type: application/json
Authorization: Bearer {token}
X-API-Version: 2.0
```

### Obtenção de Token

```bash
curl -X POST https://aproxima-six.vercel.app/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha_segura"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "refreshToken": "rt_abc123..."
  }
}
```

## 👥 Endpoints de Usuários

### GET /api/users/profile

Retorna o perfil do usuário autenticado.

**Request:**
```bash
curl -X GET https://aproxima-six.vercel.app/api/users/profile \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "name": "Maria Silva",
    "email": "maria@exemplo.com",
    "role": "gestante",
    "accessibilitySettings": {
      "highContrast": true,
      "largeText": false,
      "screenReader": true,
      "reduceMotion": false
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "lastAccess": "2024-10-01T14:30:00Z"
  }
}
```

### PUT /api/users/profile

Atualiza o perfil do usuário.

**Request:**
```bash
curl -X PUT https://aproxima-six.vercel.app/api/users/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva Santos",
    "accessibilitySettings": {
      "highContrast": true,
      "largeText": true,
      "screenReader": true,
      "reduceMotion": false
    }
  }'
```

### PUT /api/users/accessibility

Atualiza apenas configurações de acessibilidade.

**Request:**
```json
{
  "highContrast": true,
  "largeText": true,
  "underlinkText": false,
  "magnification": 125,
  "reducedMotion": false,
  "focusIndicator": true,
  "soundFeedback": false,
  "autoplay": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configurações de acessibilidade atualizadas",
  "data": {
    "settingsUpdated": 8,
    "timestamp": "2024-10-01T14:30:00Z"
  }
}
```

## 🤰 Endpoints de Gestantes

### GET /api/gestantes/caderneta

Retorna a caderneta da gestante.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "caderneta-uuid",
    "gestante": {
      "name": "Maria Silva",
      "idade": 28,
      "semanaGestacional": 20
    },
    "consultas": [
      {
        "id": "consulta-1",
        "data": "2024-09-15",
        "medico": "Dr. João Santos",
        "observacoes": "Desenvolvimento normal",
        "peso": 65.5,
        "pressaoArterial": "120/80",
        "accessibility": {
          "screenReaderOptimized": true,
          "altTexts": {
            "ultrassom": "Imagem do ultrassom mostrando feto em posição cefálica"
          }
        }
      }
    ],
    "exames": [
      {
        "id": "exame-1",
        "tipo": "Ultrassom",
        "data": "2024-09-15",
        "resultado": "Normal",
        "accessibility": {
          "audioDescription": "url-audio-description.mp3",
          "tactileDescription": "Descrição tátil do exame disponível"
        }
      }
    ]
  }
}
```

### POST /api/gestantes/consulta

Registra nova consulta.

**Request:**
```json
{
  "data": "2024-10-01",
  "medico": "Dr. João Santos",
  "peso": 66.2,
  "pressaoArterial": "118/78",
  "observacoes": "Desenvolvimento adequado para idade gestacional",
  "accessibility": {
    "screenReaderNotes": "Observações específicas para leitura por screen reader"
  }
}
```

## 👨‍⚕️ Endpoints para Profissionais

### GET /api/profissionais/dashboard

Dashboard do profissional de saúde.

**Response:**
```json
{
  "success": true,
  "data": {
    "estatisticas": {
      "totalPacientes": 45,
      "consultasHoje": 8,
      "consultasSemana": 32,
      "emergencias": 2
    },
    "proximasConsultas": [
      {
        "id": "consulta-uuid",
        "paciente": "Maria Silva",
        "horario": "2024-10-01T15:00:00Z",
        "tipo": "Pré-natal",
        "accessibility": {
          "requiresAssistance": true,
          "preferredCommunication": "audio"
        }
      }
    ],
    "alertas": [
      {
        "tipo": "acessibilidade",
        "mensagem": "3 pacientes necessitam de assistência especial hoje",
        "prioridade": "media"
      }
    ]
  }
}
```

### GET /api/profissionais/pacientes

Lista pacientes do profissional.

**Query Parameters:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `search`: Busca por nome
- `accessibility`: Filtro por necessidades de acessibilidade

**Response:**
```json
{
  "success": true,
  "data": {
    "pacientes": [
      {
        "id": "paciente-uuid",
        "name": "Maria Silva",
        "idade": 28,
        "semanaGestacional": 20,
        "accessibility": {
          "screenReader": true,
          "highContrast": true,
          "assistanceLevel": "high"
        },
        "proximaConsulta": "2024-10-05T14:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## ♿ Endpoints de Acessibilidade

### GET /api/accessibility/settings

Retorna configurações globais de acessibilidade.

**Response:**
```json
{
  "success": true,
  "data": {
    "wcagLevel": "AAA",
    "supportedFeatures": [
      "screenReader",
      "highContrast",
      "largeText",
      "keyboardNavigation",
      "voiceCommands",
      "gestureControls"
    ],
    "languages": [
      {
        "code": "pt-BR",
        "name": "Português (Brasil)",
        "signLanguage": "libras"
      }
    ],
    "assistiveTechnologies": [
      "NVDA",
      "JAWS",
      "VoiceOver",
      "Dragon",
      "Switch Control"
    ]
  }
}
```

### POST /api/accessibility/feedback

Envia feedback sobre acessibilidade.

**Request:**
```json
{
  "tipo": "bug",
  "categoria": "navegacao",
  "descricao": "Botão não está acessível por teclado",
  "url": "/gestante/consultas",
  "tecnologiaAssistiva": "NVDA",
  "navegador": "Chrome 118",
  "severidade": "alta"
}
```

### GET /api/accessibility/compliance

Retorna relatório de conformidade WCAG.

**Response:**
```json
{
  "success": true,
  "data": {
    "wcagVersion": "2.1",
    "level": "AAA",
    "score": 98.5,
    "lastAudit": "2024-09-30T10:00:00Z",
    "criteria": {
      "perceivable": {
        "score": 100,
        "issues": 0
      },
      "operable": {
        "score": 98,
        "issues": 1
      },
      "understandable": {
        "score": 99,
        "issues": 0
      },
      "robust": {
        "score": 97,
        "issues": 2
      }
    },
    "recommendations": [
      "Melhorar contraste em alguns elementos secundários",
      "Adicionar mais landmarks ARIA"
    ]
  }
}
```

## 📊 Endpoints de Analytics

### GET /api/analytics/usage

Métricas de uso da plataforma.

**Query Parameters:**
- `startDate`: Data inicial (ISO 8601)
- `endDate`: Data final (ISO 8601)
- `granularity`: Granularidade (hour, day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-09-01T00:00:00Z",
      "end": "2024-09-30T23:59:59Z"
    },
    "metrics": {
      "totalUsers": 1250,
      "activeUsers": 980,
      "sessionsTotal": 4560,
      "averageSessionDuration": 1800,
      "accessibility": {
        "screenReaderUsers": 450,
        "highContrastUsers": 320,
        "keyboardOnlyUsers": 180
      }
    },
    "trends": [
      {
        "date": "2024-09-01",
        "users": 42,
        "sessions": 156
      }
    ]
  }
}
```

## 🔍 Endpoints de Busca

### GET /api/search

Busca universal na plataforma.

**Query Parameters:**
- `q`: Termo de busca
- `type`: Tipo de conteúdo (users, consultas, exames)
- `accessibility`: Incluir metadados de acessibilidade

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "maria",
    "results": [
      {
        "type": "gestante",
        "id": "user-123",
        "title": "Maria Silva Santos",
        "description": "Gestante, 28 anos, 20 semanas",
        "url": "/gestante/profile/user-123",
        "accessibility": {
          "screenReaderText": "Maria Silva Santos, gestante de 28 anos, atualmente com 20 semanas de gestação"
        }
      }
    ],
    "totalResults": 15,
    "processingTime": "0.045s"
  }
}
```

## ❌ Códigos de Erro

### Estrutura de Erro Padrão

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email deve ter formato válido"
      }
    ],
    "timestamp": "2024-10-01T14:30:00Z",
    "requestId": "req-uuid-123"
  }
}
```

### Códigos de Status HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| **200** | Success | Operação realizada com sucesso |
| **201** | Created | Recurso criado com sucesso |
| **400** | Bad Request | Dados de entrada inválidos |
| **401** | Unauthorized | Token inválido ou ausente |
| **403** | Forbidden | Permissões insuficientes |
| **404** | Not Found | Recurso não encontrado |
| **422** | Unprocessable Entity | Validação de negócio falhou |
| **429** | Too Many Requests | Rate limit excedido |
| **500** | Internal Server Error | Erro interno do servidor |

### Códigos de Erro Específicos

| Código | Descrição |
|--------|-----------|
| `AUTH_001` | Token expirado |
| `AUTH_002` | Token inválido |
| `USER_001` | Usuário não encontrado |
| `USER_002` | Email já está em uso |
| `ACCESS_001` | Configuração de acessibilidade inválida |
| `RATE_001` | Muitas tentativas, tente novamente em X segundos |

## 🔒 Rate Limiting

### Limites por Endpoint

| Endpoint | Limite | Janela |
|----------|--------|--------|
| **Auth** | 5 tentativas | 15 minutos |
| **Profile** | 100 requests | 1 hora |
| **Search** | 1000 requests | 1 hora |
| **Analytics** | 50 requests | 1 hora |

### Headers de Rate Limit

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1633024800
```

## 📝 Versionamento

### Estratégia de Versionamento

- **Header**: `X-API-Version: 2.0`
- **URL**: Não utilizada (evita fragmentação)
- **Backward Compatibility**: Mantida por 12 meses

### Changelog da API

#### v2.0 (Atual)
- ✅ Endpoints de acessibilidade completos
- ✅ Suporte aprimorado para screen readers
- ✅ Analytics de uso de acessibilidade
- ✅ Conformidade WCAG 2.1 AAA

#### v1.0 (Descontinuada em 2025)
- ⚠️ Suporte básico de acessibilidade
- ⚠️ Sem analytics especializados

## 🧪 Testando a API

### Coleção Postman

Baixe nossa coleção completa:
- [Aproxima API Collection](./postman/aproxima-collection.json)

### Exemplos com curl

```bash
# Autenticação
curl -X POST https://aproxima-six.vercel.app/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email":"test@exemplo.com","password":"senha123"}'

# Obter perfil
curl -X GET https://aproxima-six.vercel.app/api/users/profile \
  -H "Authorization: Bearer {seu_token}"

# Atualizar acessibilidade
curl -X PUT https://aproxima-six.vercel.app/api/users/accessibility \
  -H "Authorization: Bearer {seu_token}" \
  -H "Content-Type: application/json" \
  -d '{"highContrast":true,"largeText":true}'
```

### SDK JavaScript

```javascript
// Instalação: npm install aproxima-sdk

import { AproximaAPI } from 'aproxima-sdk';

const api = new AproximaAPI({
  baseURL: 'https://aproxima-six.vercel.app',
  apiKey: 'sua_api_key'
});

// Usar a API
const profile = await api.users.getProfile();
const settings = await api.accessibility.getSettings();
```

## 📞 Suporte

- **Documentação Interativa**: [Swagger UI](https://aproxima-six.vercel.app/api/docs)
- **Issues**: [GitHub](https://github.com/KallebyX/aproxima/issues)
- **Email**: [kalleby.mota@ufn.edu.br](mailto:kalleby.mota@ufn.edu.br)

---

*Última atualização: Outubro 2024*