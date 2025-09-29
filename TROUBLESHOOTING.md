# 🔧 Soluções para Erro de Deploy no Portainer

## ❌ Erro Encontrado
```
Failed to deploy a stack: compose build operation failed: 
listing workers for Build: failed to list workers: 
Unavailable: connection error: desc = "error reading server preface: 
http2: failed reading the frame payload: http2: frame too large"
```

## 🔍 Causa do Problema
Este erro indica problemas de comunicação entre Portainer e Docker daemon, comum quando:
- Há conflitos de versão HTTP/2 vs HTTP/1.1
- Docker daemon está sobrecarregado
- Problemas de rede/proxy interno
- Arquivo docker-compose muito complexo para o Portainer processar

## ✅ Soluções (em ordem de prioridade)

### 🥇 Solução 1: Deploy Manual via SSH (Recomendado)

**Conecte-se ao servidor via SSH e execute:**

```bash
# Clone do repositório
git clone https://github.com/KallebyX/aproxima.git
cd aproxima

# Opção A: Script automatizado
./deploy-manual.sh

# Opção B: Script simples
./deploy-simple.sh

# Opção C: Comandos manuais
docker build -t aproxima-app .
docker run -d --name aproxima -p 3000:3000 aproxima-app
```

### 🥈 Solução 2: Via Portainer com Imagem Pre-built

Se tiver acesso SSH, faça o build primeiro e use imagem local:

```bash
# No servidor via SSH:
cd aproxima
docker build -t aproxima-local .

# No Portainer, criar container simples:
# - Image: aproxima-local
# - Ports: 3000:3000
# - Restart: unless-stopped
```

### 🥉 Solução 3: Portainer com Stack Simplificado

Tente este docker-compose ultra-simples no Portainer:

```yaml
services:
  app:
    image: node:18-alpine
    working_dir: /app
    command: sh -c "npm install && npm run build && npm start"
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./:/app
```

### 🔄 Solução 4: Reiniciar Serviços Portainer

Se tiver acesso admin ao servidor:

```bash
# Reiniciar Docker daemon
sudo systemctl restart docker

# Reiniciar Portainer
docker restart portainer
```

## 🚀 Comandos Diretos para o Servidor

### Build e Deploy Completo
```bash
git clone https://github.com/KallebyX/aproxima.git
cd aproxima
docker build -t aproxima .
docker run -d --name aproxima-app --restart unless-stopped -p 3000:3000 aproxima
```

### Verificação
```bash
# Status do container
docker ps | grep aproxima

# Logs da aplicação
docker logs aproxima-app -f

# Teste local
curl http://localhost:3000

# Teste com resposta completa
curl -I http://localhost:3000
```

### Comandos de Manutenção
```bash
# Parar aplicação
docker stop aproxima-app

# Remover container
docker rm aproxima-app

# Atualizar aplicação
git pull
docker build -t aproxima .
docker stop aproxima-app
docker rm aproxima-app  
docker run -d --name aproxima-app --restart unless-stopped -p 3000:3000 aproxima
```

## 🌐 Configuração do Proxy Reverso

Após o container estar rodando, configure no Nginx Proxy Manager:

1. **Proxy Host:**
   - Domain: `aproxima.ufn.edu.br`
   - Scheme: `http`
   - Forward Hostname: `localhost` (ou IP do servidor)
   - Forward Port: `3000`

2. **SSL:**
   - Request new certificate
   - Force SSL: ✅
   - HTTP/2: ✅

## 📞 Troubleshooting Rápido

```bash
# Verificar se porta 3000 está livre
netstat -tulpn | grep :3000

# Verificar Docker daemon
systemctl status docker

# Verificar logs do Portainer
docker logs portainer

# Liberar recursos Docker
docker system prune -f
```

## 🎯 Resultado Esperado

Após seguir qualquer das soluções:
- ✅ Container `aproxima-app` rodando
- ✅ Aplicação acessível em `http://localhost:3000`
- ✅ Logs sem erros críticos
- ✅ Proxy reverso configurado para domínio público