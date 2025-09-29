# 🚀 Guia de Deploy - Aproxima

## Informações do Servidor

**Portainer**: https://app.ufn.edu.br  
**Nginx Proxy Manager**: https://proxy.app.ufn.edu.br  

## 📋 Pré-requisitos

1. Acesso ao Portainer configurado
2. Docker e Docker Compose disponíveis no servidor
3. Código fonte do projeto no servidor

## 🔧 Passos para Deploy

### 1. Preparar o código no servidor

```bash
# Clone ou atualize o repositório
git clone https://github.com/KallebyX/aproxima.git
cd aproxima

# Ou se já existe, atualize
git pull origin main
```

### 2. Build e execução via Docker Compose

```bash
# Build e execução em segundo plano
docker-compose -f docker-compose.simple.yml up -d --build
```

### 3. Via Portainer (Alternativa)

1. Acesse https://app.ufn.edu.br
2. Vá em "Stacks" > "Add Stack"
3. Nome: `aproxima`
4. Copie o conteúdo do `docker-compose.simple.yml`
5. Clique em "Deploy the stack"

### 4. Configurar Proxy Reverso

1. Acesse https://proxy.app.ufn.edu.br
2. Vá em "Proxy Hosts" > "Add Proxy Host"
3. Configure:
   - **Domain Names**: `aproxima.ufn.edu.br` (ou subdomínio desejado)
   - **Scheme**: `http`
   - **Forward Hostname/IP**: `localhost` ou IP do container
   - **Forward Port**: `3000`
4. Na aba "SSL":
   - Marque "Force SSL"
   - Marque "HTTP/2 Support"
   - Selecione "Request a new SSL Certificate"
   - Marque "Force SSL"

## 🔍 Verificação

Após o deploy:
- Verifique se o container está rodando: `docker ps`
- Teste localmente: `curl http://localhost:3000`
- Acesse via domínio configurado

## 📝 Comandos Úteis

```bash
# Ver logs do container
docker-compose -f docker-compose.simple.yml logs -f

# Parar o serviço
docker-compose -f docker-compose.simple.yml down

# Rebuild completo
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d --build

# Ver status dos containers
docker ps
```

## 🔄 Atualizações

Para atualizações futuras:
```bash
git pull origin main
docker-compose -f docker-compose.simple.yml up -d --build
```