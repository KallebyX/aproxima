# Deploy no Portainer - Aproxima

## 🚀 Deploy Rápido

### IMPORTANTE: Build Local + Upload de Imagem

O Portainer pode ter problemas com build via Git. **Recomendado fazer build local:**

#### 1. Build da Imagem Localmente
```bash
cd /workspaces/aproxima
docker build -f docker/Dockerfile -t aproxima:latest .
```

#### 2. Opções de Deploy

**OPÇÃO A - Portainer no mesmo servidor (dev container):**
```bash
# A imagem já está disponível localmente
# No Portainer:
# 1. Stacks > Add Stack
# 2. Name: aproxima
# 3. Web editor: cole o conteúdo de docker-compose.portainer.yml
# 4. Deploy
```

**OPÇÃO B - Portainer em servidor remoto:**
```bash
# 1. Salvar imagem
docker save aproxima:latest -o aproxima.tar

# 2. Transferir para servidor
scp aproxima.tar user@SEU_SERVIDOR_IP:/tmp/

# 3. No servidor, carregar imagem
ssh user@SEU_SERVIDOR_IP
docker load -i /tmp/aproxima.tar

# 4. No Portainer do servidor:
# Stacks > Add Stack > Web editor
# Cole o conteúdo de docker-compose.portainer.yml
```

**OPÇÃO C - Docker Registry (produção):**
```bash
# 1. Tag para seu registry
docker tag aproxima:latest seu-registry.com/aproxima:latest

# 2. Push
docker push seu-registry.com/aproxima:latest

# 3. Atualize docker-compose.portainer.yml:
#    image: seu-registry.com/aproxima:latest
```

## 🔧 Configuração

### Variáveis de Ambiente Importantes
```yaml
environment:
  - NODE_ENV=production
  - HOSTNAME=0.0.0.0    # Escuta em todas interfaces
  - PORT=3000           # Porta interna
```

### Porta
- **Externa (host)**: 3010
- **Interna (container)**: 3000  
- **Mapeamento**: `3010:3000`

### Healthcheck
- Endpoint: `/api/health`
- Verifica a cada 30s
- Timeout: 10s
- Start period: 40s (tempo para app iniciar)

## 🌐 Nginx Proxy Reverso

**Se seu servidor tem IP público (ex: 192.168.1.100):**

```nginx
server {
    listen 80;
    server_name seu-dominio.com;  # ou IP público

    location / {
        # Aponta para o IP do servidor + porta externa
        proxy_pass http://127.0.0.1:3010;
        
        # Headers necessários
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Verificações

**Container rodando:**
```bash
docker ps | grep aproxima
```

**Logs em tempo real:**
```bash
docker logs aproxima -f
```

**Testar localmente:**
```bash
curl http://127.0.0.1:3010/api/health
```

**Testar do servidor:**
```bash
curl http://SEU_IP_SERVIDOR:3010/api/health
```

## ⚠️ Solução de Problemas

### Erro "failed to list workers"
- **Causa**: Portainer tentando build via Git
- **Solução**: Fazer build local e usar imagem pré-construída

### Container não inicia
```bash
docker logs aproxima
```

### Healthcheck failing
```bash
# Entrar no container
docker exec -it aproxima sh

# Testar internamente
wget -qO- http://127.0.0.1:3000/api/health
```

## 🎯 Características

- ✅ Next.js standalone (otimizado)
- ✅ Escuta em 0.0.0.0 (todas interfaces)
- ✅ Porta 3010:3000
- ✅ Healthcheck automático
- ✅ Auto-restart
- ✅ Usuário não-root
- ✅ Imagem Alpine (~150MB)
