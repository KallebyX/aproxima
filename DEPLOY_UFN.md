# 🚀 Deploy Aproxima - Servidor UFN

## 📋 Informações de Acesso

### Portainer
- **URL**: https://app.ufn.edu.br
- **Usuário**: evangelho.kalleby
- **Senha**: djSWM18Yb0f9hRQzN41Old5t

### Nginx Proxy Manager  
- **URL**: https://proxy.app.ufn.edu.br
- **Usuário**: evangelho.kalleby@ufn.edu.br
- **Senha**: 5e2e2AZcNK6kOQls2b8AkOXQ

## 🔧 Opções de Deploy

### Opção 1: Deploy via SSH (Recomendado para resolver erro do Portainer)

1. **Conectar ao servidor via SSH**
2. **Clonar o repositório**:
   ```bash
   git clone https://github.com/KallebyX/aproxima.git
   cd aproxima
   ```

3. **Executar o deploy** (escolha uma opção):
   ```bash
   # Opção A: Script robusto com verificações
   ./deploy-manual.sh
   
   # Opção B: Script simples e rápido
   ./deploy-simple.sh
   
   # Opção C: Script original (pode dar erro no Portainer)
   ./deploy.sh
   ```

### Opção 2: Deploy via Portainer

1. **Acessar Portainer**: https://app.ufn.edu.br
2. **Criar novo Stack**:
   - Nome: `aproxima`
   - Método: Git Repository
   - Repository URL: `https://github.com/KallebyX/aproxima`
   - Compose path: `docker-compose.simple.yml`
   - Environment variables (se necessário):
     ```
     NODE_ENV=production
     PORT=3000
     ```

### Opção 3: Deploy Manual

1. **Via Docker Compose**:
   ```bash
   docker-compose -f docker-compose.simple.yml up -d --build
   ```

2. **Via Docker Build**:
   ```bash
   docker build -t aproxima .
   docker run -d -p 3000:3000 --name aproxima-app aproxima
   ```

## 🌐 Configurar Proxy Reverso

1. **Acessar Nginx Proxy Manager**: https://proxy.app.ufn.edu.br

2. **Adicionar Proxy Host**:
   - **Domain Names**: `aproxima.ufn.edu.br` (ou subdomínio desejado)
   - **Scheme**: `http`
   - **Forward Hostname/IP**: `localhost` ou IP do container
   - **Forward Port**: `3000`
   - **Cache Assets**: ✅ (opcional)
   - **Block Common Exploits**: ✅ (opcional)

3. **Configurar SSL**:
   - **SSL Certificate**: Request a new SSL Certificate
   - **Force SSL**: ✅
   - **HTTP/2 Support**: ✅
   - **HSTS Enabled**: ✅ (opcional)

## ✅ Verificação do Deploy

1. **Container Status**:
   ```bash
   docker ps | grep aproxima
   ```

2. **Logs**:
   ```bash
   docker logs aproxima-app
   # ou
   docker-compose -f docker-compose.simple.yml logs -f
   ```

3. **Teste Local**:
   ```bash
   curl http://localhost:3000
   ```

4. **Teste via Domínio**:
   - Acesse: `https://aproxima.ufn.edu.br`

## 🔄 Atualizações

Para atualizações futuras:

```bash
cd aproxima
git pull origin main
docker-compose -f docker-compose.simple.yml up -d --build
```

## 🆘 Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker logs aproxima-app

# Verificar configuração
docker inspect aproxima-app
```

### Problemas de porta
```bash
# Verificar portas em uso
netstat -tulpn | grep :3000

# Parar container e reiniciar
docker stop aproxima-app
docker rm aproxima-app
docker-compose -f docker-compose.simple.yml up -d --build
```

### SSL não funciona
- Verificar se o domínio aponta para o servidor
- Aguardar propagação DNS (pode levar até 24h)
- Verificar logs no Nginx Proxy Manager

## 📞 Suporte

Em caso de problemas, verificar:
1. Logs do container
2. Status no Portainer
3. Configuração do proxy reverso
4. Conectividade de rede