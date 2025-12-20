# 📖 Manual de Deploy - Ambiente UFN (Portainer + Nginx Proxy Manager)

## 🎯 Visão Geral

Este projeto está configurado para deploy no ambiente da **Universidade Franciscana (UFN)**, utilizando:

- **Portainer** (https://app.ufn.edu.br) - Gerenciamento de containers
- **Nginx Proxy Manager** (https://proxy.app.ufn.edu.br) - Proxy reverso com SSL
- **Servidor Docker**: 10.21.19.45
- **Domínio**: aproxima.app.ufn.edu.br

---

## 🚀 Deploy Rápido (3 Passos)

### 1️⃣ Deploy da Stack no Portainer

```bash
1. Acesse: https://app.ufn.edu.br
2. Stacks → + Add stack
3. Name: aproxima
4. Web editor: Cole docker-compose.ufn.yml
5. Deploy the stack
```

➡️ Arquivo: [`docker/docker-compose.ufn.yml`](docker/docker-compose.ufn.yml)

### 2️⃣ Configurar Nginx Proxy Manager

```bash
1. Acesse: https://proxy.app.ufn.edu.br
2. Hosts → Proxy Hosts → Add Proxy Host
3. Domain: aproxima.app.ufn.edu.br
4. Forward: http://10.21.19.45:3000
5. SSL: Request new (Let's Encrypt)
6. Save
```

### 3️⃣ Acessar a Aplicação

🌐 **https://aproxima.app.ufn.edu.br**

---

## 📚 Documentação Detalhada

| Documento | Descrição |
|-----------|-----------|
| **[README_UFN.md](docs/deployment/README_UFN.md)** | Guia rápido de deploy UFN |
| **[NGINX_PROXY_MANAGER_UFN.md](docs/deployment/NGINX_PROXY_MANAGER_UFN.md)** | Configuração completa do proxy reverso |
| **[PORTAINER_SETUP.md](PORTAINER_SETUP.md)** | Deploy genérico (outros ambientes) |

---

## 📁 Arquivos de Configuração

```
aproxima/
├── docker/
│   ├── Dockerfile                    # Build otimizado Next.js
│   ├── docker-compose.yml            # Compose genérico
│   └── docker-compose.ufn.yml        # ⭐ Compose UFN (USE ESTE)
├── .dockerignore                     # Exclusões de build
├── .env.example                      # Variáveis de ambiente
└── docs/deployment/
    ├── README_UFN.md                 # Guia rápido UFN
    └── NGINX_PROXY_MANAGER_UFN.md    # Config proxy completa
```

---

## ⚙️ Configuração Docker Compose UFN

```yaml
version: '3.8'

services:
  app:
    build:
      context: https://github.com/KallebyX/aproxima.git
      dockerfile: docker/Dockerfile
    container_name: aproxima-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
      - PORT=3000
    networks:
      - aproxima-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  aproxima-network:
    driver: bridge
```

---

## 🔧 Variáveis de Ambiente

### Obrigatórias
```env
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

### Opcionais
Ver [`.env.example`](.env.example) para lista completa de variáveis disponíveis.

---

## 🔄 Atualização da Aplicação

### Via Portainer:

```bash
# Após push para GitHub:
1. Portainer → Stacks → aproxima
2. Editor → Deploy the stack
# OU
3. Containers → aproxima-app → Recreate
```

### Via Git:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

---

## 📊 Monitoramento

### Status do Container (Portainer)
```
Containers → aproxima-app
├─ Status: Running ✅
├─ CPU: XX%
├─ Memory: XX MB
└─ Logs: View
```

### Logs em Tempo Real
```bash
# Via Portainer
Stacks → aproxima → Logs → ☑ Auto-refresh

# Via Docker CLI (se tiver SSH)
docker logs -f aproxima-app
```

### Verificar Proxy (Nginx Proxy Manager)
```
Hosts → aproxima.app.ufn.edu.br
├─ Status: Online ✅
├─ SSL: Valid 🔒
└─ Access Log
```

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| **502 Bad Gateway** | Verificar se container está rodando: `docker logs aproxima-app` |
| **SSL Certificate Error** | Renovar certificado no Nginx Proxy Manager |
| **Connection Timeout** | Confirmar porta 3000 aberta e container UP |
| **Build Failed** | Ver logs do build no Portainer |

➡️ **Troubleshooting completo**: [NGINX_PROXY_MANAGER_UFN.md](docs/deployment/NGINX_PROXY_MANAGER_UFN.md#-troubleshooting)

---

## ✅ Checklist Pré-Deploy

- [ ] Código commitado e pushado para GitHub
- [ ] `docker-compose.ufn.yml` revisado
- [ ] Variáveis de ambiente definidas
- [ ] Porta 3000 disponível no servidor
- [ ] Acesso ao Portainer UFN
- [ ] Acesso ao Nginx Proxy Manager
- [ ] Domínio `aproxima.app.ufn.edu.br` configurado no DNS

---

## 🔐 Segurança

### Implementado:
- ✅ SSL/TLS via Let's Encrypt
- ✅ HTTPS obrigatório (Force SSL)
- ✅ HTTP/2 habilitado
- ✅ HSTS enabled
- ✅ Block Common Exploits
- ✅ Rede Docker isolada (bridge)
- ✅ Healthcheck configurado

### Recomendações:
- Use senhas fortes para variáveis sensíveis
- Não commite arquivos `.env` com valores reais
- Rotacione secrets regularmente
- Monitore logs de acesso
- Mantenha imagens Docker atualizadas

---

## 📞 Suporte

- **TI UFN**: suporte-ti@ufn.edu.br
- **GitHub Issues**: https://github.com/KallebyX/aproxima/issues
- **Documentação**: [`/docs/deployment/`](docs/deployment/)

---

## 🎓 Recursos Adicionais

- **Portainer Docs**: https://docs.portainer.io/
- **Nginx Proxy Manager**: https://nginxproxymanager.com/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Docker Compose**: https://docs.docker.com/compose/

---

## 📝 Notas Importantes

### Diferenças entre Ambientes:

| Item | Desenvolvimento | UFN Produção |
|------|----------------|--------------|
| **Porta** | 3000 (direto) | 3000 → Nginx Proxy |
| **Domínio** | localhost:3000 | aproxima.app.ufn.edu.br |
| **SSL** | Não | Sim (Let's Encrypt) |
| **Build** | Local | Portainer (do GitHub) |
| **Compose** | docker-compose.yml | docker-compose.ufn.yml |

### Arquitetura de Deploy UFN:

```
Internet
    ↓
Nginx Proxy Manager (proxy.app.ufn.edu.br)
    ↓ HTTPS
[SSL Termination - Let's Encrypt]
    ↓ HTTP
10.21.19.45:3000 (Container aproxima-app)
    ↓
Next.js Standalone Server
```

---

*Última atualização: Dezembro 2025*
*Configurado para: Universidade Franciscana (UFN)*
