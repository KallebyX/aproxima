# 🚨 PORTAINER BUILD ERROR - SOLUÇÕES IMEDIATAS

## ❌ Erro Confirmado
O Portainer está com problemas de comunicação HTTP/2 com o Docker daemon durante builds.

## ✅ SOLUÇÕES TESTADAS

### 🥇 SOLUÇÃO 1: Stack sem Build (Recomendada)

**No Portainer, use estas configurações:**

**Compose path:** `docker-compose.no-build.yml`

Este arquivo usa uma imagem base e clona o repo durante a execução, evitando o build problemático.

### 🥈 SOLUÇÃO 2: Stack com Volume

**Compose path:** `docker-compose.volume.yml` 

*Nota: Funciona apenas se o código já estiver no servidor*

### 🥉 SOLUÇÃO 3: Deploy via SSH (100% Confiável)

**Execute no servidor:**
```bash
# Conectar ao servidor
ssh usuario@servidor

# Deploy direto
git clone https://github.com/KallebyX/aproxima.git
cd aproxima
./deploy-simple.sh
```

### 🔄 SOLUÇÃO 4: Container Manual no Portainer

**Ao invés de Stack, criar Container:**

1. **Containers** → **Add container**
2. **Name:** `aproxima-app`
3. **Image:** `node:18-alpine`
4. **Command:** 
   ```
   sh -c "apk add --no-cache git && git clone https://github.com/KallebyX/aproxima.git /app && cd /app && npm install && npm run build && npm start"
   ```
5. **Network ports:** `3000:3000`
6. **Restart policy:** `Unless stopped`
7. **Environment variables:**
   - `NODE_ENV=production`
   - `PORT=3000`

## 🎯 TESTE RÁPIDO

**Após qualquer deploy, teste:**
```bash
curl http://localhost:3000
```

**Resposta esperada:** HTTP 200

## 🌐 CONFIGURAÇÃO DO PROXY

**No Nginx Proxy Manager:**
- **Domain:** `aproxima.ufn.edu.br`
- **Forward Hostname:** `localhost` (ou IP do servidor)
- **Forward Port:** `3000`
- **SSL:** Request new certificate

---

## 🔧 RECOMENDAÇÃO FINAL

**Use a SOLUÇÃO 1** no Portainer com `docker-compose.no-build.yml` - ela evita completamente o problema de build que está causando o erro.