# 🎯 SOLUÇÃO RÁPIDA - Erro Portainer

## ❌ Problema
```
Failed to deploy a stack: compose build operation failed
```

## ✅ SOLUÇÃO IMEDIATA

### 1. Conecte-se ao servidor via SSH

### 2. Execute estes comandos:
```bash
git clone https://github.com/KallebyX/aproxima.git
cd aproxima
./deploy-simple.sh
```

### 3. Configure o proxy no Nginx Manager:
- Domínio: `aproxima.ufn.edu.br`
- Forward: `localhost:3000`

## 🔄 Alternativas se SSH não funcionar:

### Opção A: Build manual no servidor
```bash
git clone https://github.com/KallebyX/aproxima.git
cd aproxima
docker build -t aproxima .
docker run -d --name aproxima-app -p 3000:3000 --restart unless-stopped aproxima
```

### Opção B: Via Portainer com container simples
No Portainer, criar container:
- **Image**: `node:18-alpine`
- **Command**: `sh -c "git clone https://github.com/KallebyX/aproxima.git /app && cd /app && npm install && npm run build && npm start"`
- **Ports**: `3000:3000`

## ✅ Verificação
```bash
curl http://localhost:3000
```

**Status esperado: HTTP 200**

---
**📞 Suporte**: Todos os scripts estão testados e funcionando!