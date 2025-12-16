# 🐳 Deploy no Portainer - Método Definitivo

## ⚡ MÉTODO RECOMENDADO: Repository (Build Automático)

### Passo a Passo:

1. **Portainer > Stacks > Add Stack**

2. **Configuração:**
   - **Name:** `aproxima`
   - **Build method:** Repository ⭐

3. **Repository settings:**
   - **Repository URL:** `https://github.com/KallebyX/aproxima`
   - **Repository reference:** `refs/heads/main`
   - **Compose path:** `docker/docker-compose.yml`

4. **Authentication (se repositório privado):**
   - **Username:** `KallebyX`
   - **Personal Access Token:** [Criar token](https://github.com/settings/tokens)
   - Permissões necessárias: `repo`

5. **Environment variables:** Deixe vazio

6. **Deploy the stack** 🚀

---

## 🎯 O que acontece:

1. ✅ Portainer clona do GitHub
2. ✅ Lê `docker/docker-compose.yml`
3. ✅ Executa build do Dockerfile
4. ✅ Inicia o container na porta 3010

---

## 🔄 Para atualizar o código:

1. Faça commit/push no GitHub
2. No Portainer: **Stacks > aproxima > Pull and redeploy**
3. Portainer vai:
   - Git pull
   - Rebuild
   - Restart container

---

## ⚠️ Se der erro "failed to list workers":

Use o **MÉTODO 2** abaixo (Web Editor).

---

## MÉTODO 2: Web Editor (Clone em Runtime)

### Passo a Passo:

1. **Portainer > Stacks > Add Stack**

2. **Name:**
   ```
   aproxima
   ```

3. **Build method:** Selecione **"Web editor"**

4. **Cole este código no editor:**

```yaml
version: '3.8'

services:
  aproxima:
    image: node:18-alpine
    container_name: aproxima
    restart: unless-stopped
    network_mode: host
    working_dir: /app
    environment:
      - NODE_ENV=production
      - HOSTNAME=0.0.0.0
      - PORT=3010
    command: >
      sh -c "
        echo '🚀 Clonando repositório...' &&
        apk add --no-cache git &&
        cd /tmp &&
        rm -rf aproxima 2>/dev/null || true &&
        git clone https://github.com/KallebyX/aproxima.git &&
        cd aproxima &&
        echo '📦 Instalando dependências...' &&
        npm ci --include=dev --ignore-scripts &&
        echo '🔨 Fazendo build...' &&
        npm run build &&
        echo '✅ Iniciando aplicação na porta 3010...' &&
        cd /tmp/aproxima &&
        PORT=3010 node .next/standalone/server.js
      "
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://127.0.0.1:3010/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 120s
```

5. **Environment variables:** Deixe vazio

6. **Deploy the stack** 🚀

### ⏱️ Tempo de Deploy:
- Primeira vez: ~3-5 minutos (clona, instala, builda)
- Próximas vezes: ~3-5 minutos (sempre rebuilda)

---

## MÉTODO 2: Web Editor (Clone em Runtime)

**Use se o Método 1 der erro de build.**

### Passo a Passo:
  - Permissões necessárias: `repo` (acesso ao código)

### 5. Environment variables:

**DEIXE VAZIO** - as variáveis já estão no docker-compose.yml

### 6. Deploy the Stack

Clique em **"Deploy the stack"**

---

## 📊 O que vai acontecer:

1. ✅ Portainer clona o repositório do GitHub
2. ✅ Lê o arquivo `docker/docker-compose.yml`
3. ✅ Executa `docker build -f docker/Dockerfile`
4. ✅ Cria o container na porta 3010:3000
5. ✅ Inicia a aplicação

---

## 🔍 Verificar se funcionou:

```bash
# Ver containers rodando
docker ps | grep aproxima

# Ver logs
docker logs aproxima -f

# Testar healthcheck
curl http://127.0.0.1:3010/api/health
```

---

## ⚠️ Problemas Comuns:

### "Authentication required"
→ Repositório é privado, adicione Personal Access Token

### "Failed to clone repository"
→ Verifique URL e branch name

### "Build failed"
→ Verifique logs do Portainer, pode ser falta de memória/disco

### "Context error"
→ Já está configurado corretamente: `context: ..` (raiz do repo)

---

## 🔄 Atualizar a Stack:

Quando fizer mudanças no código:

1. Commit e push para o GitHub
2. No Portainer: **Stacks > aproxima**
3. Clique em **"Pull and redeploy"** ou **"Update the stack"**
4. Portainer vai:
   - Fazer git pull
   - Rebuild a imagem
   - Recriar o container

---

## 🌐 Nginx (depois que subir):

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Restart nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```
