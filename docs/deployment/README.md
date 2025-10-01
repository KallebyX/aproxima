# 🚀 Guia de Deploy Enterprise - Aproxima

## 📋 Visão Geral

Este guia fornece instruções completas para deploy da Aproxima em ambiente enterprise, incluindo configurações de alta disponibilidade, monitoramento e segurança.

## 🏗️ Arquitetura de Deploy

### Ambientes

| Ambiente | Propósito | URL | Auto-Deploy |
|----------|-----------|-----|-------------|
| **Development** | Desenvolvimento local | localhost:3000 | ❌ Manual |
| **Staging** | Testes e QA | staging.aproxima.ufn.edu.br | ✅ develop branch |
| **Production** | Usuários finais | aproxima.ufn.edu.br | ✅ main branch |

### Infraestrutura

```mermaid
graph TB
    A[Load Balancer] --> B[Nginx Proxy]
    B --> C[App Container 1]
    B --> D[App Container 2]
    C --> E[PostgreSQL]
    D --> E
    E --> F[Redis Cache]
    G[Monitoring] --> C
    G --> D
    H[Backup] --> E
```

## 🐳 Deploy com Docker (Recomendado)

### Configuração Básica

#### 1. Preparação do Ambiente

```bash
# Clone o repositório
git clone https://github.com/KallebyX/aproxima.git
cd aproxima

# Copie e configure variáveis de ambiente
cp .env.example .env.production
```

#### 2. Configuração do .env.production

```bash
# === CONFIGURAÇÕES BÁSICAS ===
NODE_ENV=production
PORT=3000
HOSTNAME=aproxima.ufn.edu.br

# === BANCO DE DADOS ===
DATABASE_URL=postgresql://user:password@postgres:5432/aproxima
REDIS_URL=redis://redis:6379/0

# === SEGURANÇA ===
NEXTAUTH_URL=https://aproxima.ufn.edu.br
NEXTAUTH_SECRET=sua_chave_secreta_super_segura_aqui
JWT_SECRET=outra_chave_secreta_diferente

# === MONITORAMENTO ===
SENTRY_DSN=https://sua_chave_sentry@sentry.io/projeto
LOG_LEVEL=info

# === EMAIL ===
SMTP_HOST=smtp.ufn.edu.br
SMTP_PORT=587
SMTP_USER=aproxima@ufn.edu.br
SMTP_PASS=senha_email

# === ACESSIBILIDADE ===
VLIBRAS_ENABLED=true
ANALYTICS_ENABLED=true
```

#### 3. Deploy Simples

```bash
# Deploy básico (desenvolvimento/staging)
docker-compose -f docker-compose.simple.yml up -d --build

# Verificar status
docker-compose ps
```

#### 4. Deploy Completo (Produção)

```bash
# Deploy com todos os serviços
docker-compose up -d --build

# Verificar logs
docker-compose logs -f aproxima-app
```

### Docker Compose Completo

```yaml
# docker-compose.yml
version: '3.8'

services:
  aproxima-app:
    build: .
    container_name: aproxima-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads
    networks:
      - aproxima-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: aproxima-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - aproxima-app
    networks:
      - aproxima-network

  postgres:
    image: postgres:15-alpine
    container_name: aproxima-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: aproxima
      POSTGRES_USER: aproxima_user
      POSTGRES_PASSWORD: senha_super_segura
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - aproxima-network

  redis:
    image: redis:7-alpine
    container_name: aproxima-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - aproxima-network

  monitoring:
    image: prom/prometheus
    container_name: aproxima-monitoring
    restart: unless-stopped
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - aproxima-network

volumes:
  postgres_data:
  redis_data:
  prometheus_data:

networks:
  aproxima-network:
    driver: bridge
```

## 📡 Configuração Nginx

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    # Configurações básicas
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logs acessíveis
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Configurações de performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression para performance
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Rate limiting para segurança
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Headers de segurança
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    server {
        listen 80;
        server_name aproxima.ufn.edu.br;
        
        # Redirect HTTP para HTTPS
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name aproxima.ufn.edu.br;
        
        # Certificados SSL
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;
        
        # Proxy para aplicação Next.js
        location / {
            proxy_pass http://aproxima-app:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
        
        # Rate limiting para API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://aproxima-app:3000;
            # ... outras configurações de proxy
        }
        
        # Rate limiting mais restritivo para login
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://aproxima-app:3000;
            # ... outras configurações de proxy
        }
        
        # Cache para assets estáticos
        location /_next/static/ {
            expires 365d;
            add_header Cache-Control "public, immutable";
            proxy_pass http://aproxima-app:3000;
        }
        
        # Headers específicos para acessibilidade
        location ~* \\.(html|htm)$ {
            add_header X-Accessibility-Standard "WCAG 2.1 AAA";
            proxy_pass http://aproxima-app:3000;
        }
        
        # Healthcheck
        location /health {
            access_log off;
            proxy_pass http://aproxima-app:3000/api/health;
        }
    }
}
```

## 🔧 Scripts de Deploy Automatizados

### deploy.sh

```bash
#!/bin/bash

# === SCRIPT DE DEPLOY ENTERPRISE ===
# Versão: 2.0
# Autor: Aproxima Team

set -e  # Sair em caso de erro

# Cores para output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Configurações
ENVIRONMENT=${1:-production}
BACKUP_RETENTION_DAYS=30
DEPLOY_USER="aproxima"
LOG_FILE="/var/log/aproxima/deploy-$(date +%Y%m%d-%H%M%S).log"

# Funções auxiliares
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

# Verificações pré-deploy
pre_deploy_checks() {
    log "Iniciando verificações pré-deploy..."
    
    # Verificar se Docker está rodando
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando"
    fi
    
    # Verificar espaço em disco (mínimo 5GB)
    AVAILABLE_SPACE=$(df / | awk 'NR==2 {print $4}')
    if [ "$AVAILABLE_SPACE" -lt 5242880 ]; then
        error "Espaço insuficiente em disco (mínimo 5GB necessários)"
    fi
    
    # Verificar se arquivo de ambiente existe
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        error "Arquivo .env.$ENVIRONMENT não encontrado"
    fi
    
    # Verificar conectividade de rede
    if ! ping -c 1 google.com > /dev/null 2>&1; then
        warning "Conectividade de rede pode estar comprometida"
    fi
    
    log "Verificações pré-deploy concluídas com sucesso"
}

# Backup do banco de dados
backup_database() {
    log "Iniciando backup do banco de dados..."
    
    BACKUP_DIR="/var/backups/aproxima"
    BACKUP_FILE="$BACKUP_DIR/aproxima-backup-$(date +%Y%m%d-%H%M%S).sql"
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup do PostgreSQL
    docker exec aproxima-postgres pg_dump -U aproxima_user aproxima > "$BACKUP_FILE" || error "Falha no backup do banco"
    
    # Compactar backup
    gzip "$BACKUP_FILE"
    
    # Limpar backups antigos
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
    
    log "Backup realizado com sucesso: ${BACKUP_FILE}.gz"
}

# Deploy da aplicação
deploy_application() {
    log "Iniciando deploy da aplicação..."
    
    # Pull das imagens mais recentes
    docker-compose pull
    
    # Build e start dos containers
    docker-compose up -d --build --remove-orphans
    
    # Aguardar aplicação ficar healthy
    log "Aguardando aplicação ficar saudável..."
    for i in {1..30}; do
        if docker exec aproxima-app curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            log "Aplicação está saudável"
            break
        fi
        if [ $i -eq 30 ]; then
            error "Timeout aguardando aplicação ficar saudável"
        fi
        sleep 10
    done
    
    log "Deploy da aplicação concluído com sucesso"
}

# Verificações pós-deploy
post_deploy_checks() {
    log "Iniciando verificações pós-deploy..."
    
    # Verificar se todos os containers estão rodando
    CONTAINERS=("aproxima-app" "aproxima-nginx" "aproxima-postgres" "aproxima-redis")
    for container in "${CONTAINERS[@]}"; do
        if ! docker ps --filter "name=$container" --filter "status=running" | grep -q "$container"; then
            error "Container $container não está rodando"
        fi
    done
    
    # Verificar conectividade HTTP/HTTPS
    if ! curl -f https://aproxima.ufn.edu.br/api/health > /dev/null 2>&1; then
        error "Aplicação não está respondendo via HTTPS"
    fi
    
    # Verificar acessibilidade
    if ! curl -f https://aproxima.ufn.edu.br > /dev/null 2>&1; then
        error "Site principal não está acessível"
    fi
    
    # Verificar logs por erros críticos
    if docker logs aproxima-app --since="5m" | grep -i "error\\|critical\\|fatal" > /dev/null; then
        warning "Erros encontrados nos logs recentes da aplicação"
    fi
    
    log "Verificações pós-deploy concluídas com sucesso"
}

# Função principal
main() {
    log "=== INÍCIO DO DEPLOY - AMBIENTE: $ENVIRONMENT ==="
    
    # Verificar se é execução como root
    if [ "$EUID" -eq 0 ]; then
        error "Não execute este script como root"
    fi
    
    pre_deploy_checks
    backup_database
    deploy_application
    post_deploy_checks
    
    log "=== DEPLOY CONCLUÍDO COM SUCESSO ==="
    log "Logs disponíveis em: $LOG_FILE"
    
    # Notificação (opcional)
    if command -v mail &> /dev/null; then
        echo "Deploy da Aproxima ($ENVIRONMENT) concluído com sucesso" | mail -s "Deploy Success" admin@ufn.edu.br
    fi
}

# Executar função principal
main "$@"
```

### deploy-simple.sh

```bash
#!/bin/bash

# === SCRIPT DE DEPLOY SIMPLES ===
# Para desenvolvimento e testes rápidos

set -e

echo "🚀 Iniciando deploy simples da Aproxima..."

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose -f docker-compose.simple.yml down || true

# Build e start
echo "🔨 Construindo e iniciando aplicação..."
docker-compose -f docker-compose.simple.yml up -d --build

# Aguardar aplicação
echo "⏳ Aguardando aplicação ficar disponível..."
sleep 30

# Verificar status
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Deploy concluído com sucesso!"
    echo "🌐 Aplicação disponível em: http://localhost:3000"
else
    echo "❌ Falha no deploy - verificar logs:"
    docker-compose -f docker-compose.simple.yml logs aproxima-app
    exit 1
fi
```

## 📊 Monitoramento e Logs

### Configuração do Prometheus

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: 'aproxima-app'
    static_configs:
      - targets: ['aproxima-app:3000']
    metrics_path: '/api/metrics'
    
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:9113']
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### Logs Centralizados

```bash
# Visualizar logs em tempo real
docker-compose logs -f

# Logs específicos por serviço
docker-compose logs -f aproxima-app
docker-compose logs -f nginx
docker-compose logs -f postgres

# Logs com timestamp
docker-compose logs -f -t aproxima-app

# Filtrar logs por nível
docker-compose logs aproxima-app | grep ERROR
```

### Métricas de Health Check

```javascript
// api/health.js - Endpoint de health check
export default function handler(req, res) {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    accessibility: {
      wcagCompliance: 'AAA',
      screenReaderCompatible: true,
      keyboardNavigable: true
    },
    services: {
      database: 'connected',
      redis: 'connected',
      email: 'operational'
    }
  };
  
  res.status(200).json(healthCheck);
}
```

## 🔐 Segurança e SSL

### Configuração SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d aproxima.ufn.edu.br

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Configurações de Segurança

```bash
# .env.production - Configurações de segurança
SECURITY_HEADERS_ENABLED=true
RATE_LIMITING_ENABLED=true
SESSION_SECURE=true
COOKIE_SECURE=true
CSRF_PROTECTION=true

# Rate limiting
RATE_LIMIT_WINDOW=15min
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://aproxima.ufn.edu.br
CORS_CREDENTIALS=true
```

## 📈 Escalabilidade

### Load Balancing

```yaml
# docker-compose.scale.yml
version: '3.8'

services:
  aproxima-app:
    build: .
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    ports:
      - "3000-3002:3000"
```

### Deploy com Swarm

```bash
# Inicializar Swarm
docker swarm init

# Deploy do stack
docker stack deploy -c docker-compose.yml aproxima

# Escalar serviços
docker service scale aproxima_aproxima-app=3

# Status dos serviços
docker service ls
```

## 🔄 CI/CD com GitHub Actions

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:all
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/aproxima
            git pull origin main
            ./deploy.sh production
```

## 🆘 Troubleshooting

### Problemas Comuns

#### "Container não inicia"

```bash
# Verificar logs
docker logs aproxima-app

# Verificar configurações
docker exec aproxima-app env | grep NODE_ENV

# Recriar container
docker-compose up -d --force-recreate aproxima-app
```

#### "Aplicação lenta"

```bash
# Verificar recursos
docker stats

# Verificar logs de performance
docker logs aproxima-app | grep "slow\\|timeout"

# Verificar banco de dados
docker exec aproxima-postgres pg_stat_activity
```

#### "SSL não funciona"

```bash
# Verificar certificados
sudo certbot certificates

# Testar SSL
openssl s_client -connect aproxima.ufn.edu.br:443

# Renovar certificado
sudo certbot renew --dry-run
```

### Recovery Procedures

#### Rollback de Deploy

```bash
# Listar tags disponíveis
docker images aproxima-app

# Fazer rollback para versão anterior
docker tag aproxima-app:latest aproxima-app:backup
docker tag aproxima-app:v1.0.0 aproxima-app:latest
docker-compose up -d aproxima-app
```

#### Restaurar Backup

```bash
# Listar backups disponíveis
ls -la /var/backups/aproxima/

# Restaurar backup específico
gunzip backup-file.sql.gz
docker exec -i aproxima-postgres psql -U aproxima_user aproxima < backup-file.sql
```

---

## 📞 Suporte para Deploy

**Para questões de deploy e infraestrutura:**

- **DevOps**: [devops@aproxima.com](mailto:devops@aproxima.com)
- **Emergências**: +55 (55) 99999-0001
- **Documentação**: [/docs/deployment](./docs/deployment)

---

*Este guia é atualizado regularmente. Última atualização: Outubro 2024*