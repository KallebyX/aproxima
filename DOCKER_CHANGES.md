# Otimizações Docker - Stack Portainer

## ✅ Mudanças Implementadas

### 1. Dockerfile Simplificado
- **Antes**: Multi-stage complexo com base desnecessária
- **Depois**: 2 stages simples (builder + runner)
- Removidas dependências extras (libc6-compat)
- Build otimizado com standalone Next.js
- Imagem final ~150MB

### 2. .dockerignore Otimizado
Adicionados para reduzir build context:
- Arquivos de teste (e2e, __tests__, *.test.*)
- Documentação (docs/, *.md)
- Scripts de dev (scripts/)
- Configs desnecessários em produção
- Reports e logs

### 3. docker-compose.yml
- Context corrigido para `..` (build a partir da raiz)
- Dockerfile path: `docker/Dockerfile`
- Porta configurada: `3010:3000`
- Healthcheck adicionado usando `/api/health`
- Removed network desnecessária

### 4. Arquivos Removidos
- ❌ `docker-compose.portainer.yml` (fazia clone do git - completamente desnecessário)

## 📦 Como Usar no Portainer

### Opção 1: Git Repository
1. Stack > Add Stack
2. Nome: `aproxima`
3. Build method: Repository
4. Repository URL: seu repo
5. Compose path: `docker/docker-compose.yml`
6. Deploy

### Opção 2: Upload docker-compose.yml
1. Stack > Add Stack  
2. Nome: `aproxima`
3. Upload: `docker/docker-compose.yml`
4. Deploy

### Opção 3: Terminal Manual
```bash
cd /workspaces/aproxima/docker
docker-compose up -d
```

## 🔧 Configuração Nginx

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

## 🎯 Resultado

- Build time reduzido
- Imagem Docker otimizada (~150MB)
- Apenas dependências de produção
- Configuração limpa e manutenível
- Pronto para Portainer

## 📊 Estrutura Final

```
docker/
├── Dockerfile          # Simplificado (2 stages)
├── docker-compose.yml  # Config para Portainer
└── README.md          # Instruções de deploy
```
