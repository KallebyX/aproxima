# Deploy no Portainer - Aproxima

## 🚀 Deploy Rápido

### Via Portainer (Recomendado)

1. **Acesse seu Portainer**
2. **Stacks > Add Stack**
3. **Configure:**
   - Name: `aproxima`
   - Build method: **Repository**
   - Repository URL: `seu-repositorio-git`
   - Repository reference: `refs/heads/main`
   - Compose path: `docker/docker-compose.yml`
4. **Deploy the stack**

### Via Docker Compose Manual

```bash
cd docker
docker-compose up -d
```

## 🔧 Configuração

- **Porta externa**: 3010
- **Porta interna**: 3000
- **Healthcheck**: `/api/health`
- **Container**: `aproxima`

## 🌐 Nginx Proxy Reverso

Adicione ao seu nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3010;
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

**Logs:**
```bash
docker logs aproxima -f
```

**Health check:**
```bash
curl http://localhost:3010/api/health
```

## 🎯 Características

- ✅ Build otimizado Next.js standalone
- ✅ Imagem Alpine (~150MB)
- ✅ Usuário não-root (segurança)
- ✅ Healthcheck automático
- ✅ Auto-restart
- ✅ Apenas dependências de produção
