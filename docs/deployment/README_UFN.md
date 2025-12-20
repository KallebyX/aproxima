# 🎓 Deploy Aproxima - Ambiente UFN (Portainer + Nginx Proxy Manager)

## 📋 Resumo da Configuração

| Item | Valor |
|------|-------|
| **Nome da Stack** | aproxima |
| **Porta Container** | 3000 |
| **Domínio** | aproxima.app.ufn.edu.br |
| **IP Servidor** | 10.21.19.45 |
| **Repositório** | https://github.com/KallebyX/aproxima |

---

## 🚀 GUIA RÁPIDO (3 Passos)

### ✅ Passo 1: Deploy no Portainer

1. Acesse https://app.ufn.edu.br
2. **Stacks** → **+ Add stack**
3. **Nome**: `aproxima`
4. **Web editor**: Cole o conteúdo de [`docker-compose.ufn.yml`](../../docker/docker-compose.ufn.yml)
5. **Deploy the stack**

### ✅ Passo 2: Configurar Proxy Reverso

1. Acesse https://proxy.app.ufn.edu.br
2. **Hosts** → **Proxy Hosts** → **Add Proxy Host**
3. Configuração:
   - **Domain**: `aproxima.app.ufn.edu.br`
   - **Scheme**: `http`
   - **Forward**: `10.21.19.45:3000`
   - **SSL**: Request new (Let's Encrypt)
4. **Save**

### ✅ Passo 3: Acessar

🌐 **https://aproxima.app.ufn.edu.br**

---

## 📚 Documentação Completa

### Para Deploy e Configuração Detalhada:
➡️ **[Guia Completo Nginx Proxy Manager](NGINX_PROXY_MANAGER_UFN.md)**

### Arquivos de Configuração:

| Arquivo | Descrição |
|---------|-----------|
| [`docker-compose.ufn.yml`](../../docker/docker-compose.ufn.yml) | Stack otimizada para UFN |
| [`.env.example`](../../.env.example) | Variáveis de ambiente |
| [`Dockerfile`](../../docker/Dockerfile) | Build otimizado Next.js |
| [`.dockerignore`](../../.dockerignore) | Exclusões de build |

---

## 🔧 Configuração do Docker Compose

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
      start_period: 40s

networks:
  aproxima-network:
    driver: bridge
```

---

## ⚙️ Variáveis de Ambiente

### Básicas (Obrigatórias)
```env
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

### Opcionais
Ver [`../.env.example`](../../.env.example) para lista completa.

---

## 📊 Monitoramento

### Verificar Status

**Portainer**:
```
Containers → aproxima-app
├─ Status: Running ✅
├─ CPU: XX%
├─ Memory: XX MB
└─ Logs: Auto-refresh
```

**Nginx Proxy Manager**:
```
Hosts → aproxima.app.ufn.edu.br
├─ Status: Online ✅
├─ SSL: Valid 🔒
└─ Access Log: View
```

---

## 🔄 Processo de Atualização

### Método 1: Rebuild Automático (Recomendado)

```bash
# 1. Push código para GitHub
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 2. No Portainer, rebuild a stack
# Stacks → aproxima → Editor → Deploy the stack
# OU
# Containers → aproxima-app → Recreate ☑ Pull latest
```

### Método 2: Deploy Local

```bash
# Build local e push para registry
docker build -t seu-registry/aproxima:latest .
docker push seu-registry/aproxima:latest

# Atualizar docker-compose.yml para usar a imagem
# image: seu-registry/aproxima:latest
```

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| **502 Bad Gateway** | Verificar logs container: `docker logs aproxima-app` |
| **SSL Error** | Renovar certificado no Nginx Proxy Manager |
| **Connection Timeout** | Confirmar porta 3000 aberta, container rodando |
| **Build Failed** | Verificar Dockerfile e dependências |

➡️ **[Troubleshooting Completo](NGINX_PROXY_MANAGER_UFN.md#-troubleshooting)**

---

## 🎯 Checklist Pré-Deploy

- [ ] Código commitado e pushado para GitHub
- [ ] `docker-compose.ufn.yml` revisado
- [ ] Variáveis de ambiente definidas
- [ ] Porta 3000 não está em uso
- [ ] Acesso ao Portainer UFN confirmado
- [ ] Acesso ao Nginx Proxy Manager confirmado
- [ ] Domínio `aproxima.app.ufn.edu.br` disponível

---

## 📞 Suporte

- **TI UFN**: suporte-ti@ufn.edu.br
- **Documentação**: [NGINX_PROXY_MANAGER_UFN.md](NGINX_PROXY_MANAGER_UFN.md)
- **Issues GitHub**: https://github.com/KallebyX/aproxima/issues

---

## 🔐 Segurança

✅ **Implementado**:
- SSL/TLS via Let's Encrypt
- HTTPS obrigatório (Force SSL)
- HTTP/2 habilitado
- HSTS enabled
- Block Common Exploits
- Rede Docker isolada

⚠️ **Recomendações**:
- Usar senhas fortes para variáveis de ambiente
- Rotacionar secrets regularmente
- Monitorar logs de acesso
- Manter imagens Docker atualizadas

---

## 📈 Próximos Passos

1. ✅ Deploy inicial
2. ✅ Configuração SSL
3. ⬜ Configurar backup automático
4. ⬜ Implementar CI/CD
5. ⬜ Monitoramento com Prometheus/Grafana
6. ⬜ Logs centralizados com ELK Stack

---

*Configurado para Universidade Franciscana (UFN) - Dezembro 2025*
