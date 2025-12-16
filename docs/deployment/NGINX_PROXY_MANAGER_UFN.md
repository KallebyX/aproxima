# 🌐 Configuração Nginx Proxy Manager - Aproxima UFN

## 📋 Informações do Ambiente

| Item | Valor |
|------|-------|
| **Portainer** | https://app.ufn.edu.br |
| **Nginx Proxy Manager** | https://proxy.app.ufn.edu.br |
| **IP Servidor Docker** | 10.21.19.45 |
| **Porta Aplicação** | 3000 |
| **Domínio** | aproxima.app.ufn.edu.br |

---

## 🚀 PASSO 1: Deploy da Stack no Portainer

### 1.1 Acessar Portainer

1. Acesse https://app.ufn.edu.br
2. Faça login com suas credenciais UFN
3. Selecione o **Environment** correto (Docker UFN)

### 1.2 Criar Nova Stack

1. No menu lateral, clique em **Stacks**
2. Clique no botão **+ Add stack**
3. Preencha os campos:

```
┌─────────────────────────────────────────────────────────────┐
│ Name: aproxima                                              │
│ (minúsculas, sem espaços)                                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Colar Docker Compose

Na seção **Web editor**, cole o conteúdo do arquivo [`docker-compose.ufn.yml`](docker-compose.ufn.yml):

```yaml
version: '3.8'

services:
  app:
    build:
      context: https://github.com/KallebyX/aproxima.git
      dockerfile: docker/Dockerfile
    container_name: aproxima-app
    restart: always
    
    ports:
      - "3000:3000"
    
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
      - PORT=3000
    
    networks:
      - aproxima-network
    
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  aproxima-network:
    driver: bridge
```

### 1.4 Adicionar Variáveis de Ambiente (Opcional)

Se precisar de variáveis adicionais:

1. Role até a seção **Environment variables**
2. Escolha uma das opções:
   - **Simple editor**: Cole as variáveis no formato `KEY=value`
   - **Advanced editor**: Use formato JSON

**Exemplo - Simple editor**:
```env
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

### 1.5 Configurar Access Control

```
┌─────────────────────────────────────────────────────────────┐
│ Access control: [Restricted ▼]                              │
│                                                             │
│ ☑ Administrators                                            │
│ ☑ Seu time/grupo UFN                                        │
└─────────────────────────────────────────────────────────────┘
```

### 1.6 Deploy

1. Clique em **Deploy the stack**
2. Aguarde o build e inicialização (pode levar 2-5 minutos na primeira vez)
3. Verifique os logs:
   - **Stacks** → **aproxima** → **Logs**
   - Procure por mensagens como:
     ```
     ✓ Ready in XXXms
     Server running on http://0.0.0.0:3000
     ```

---

## 🔗 PASSO 2: Configurar Proxy Reverso no Nginx Proxy Manager

### 2.1 Acessar Nginx Proxy Manager

1. Acesse https://proxy.app.ufn.edu.br
2. Faça login com suas credenciais

### 2.2 Criar Novo Proxy Host

1. No menu lateral, clique em **Hosts**
2. Clique na aba **Proxy Hosts**
3. Clique no botão **Add Proxy Host**

### 2.3 Configurar Detalhes (Aba Details)

```
┌─────────────────────────────────────────────────────────────────┐
│                      NEW PROXY HOST                              │
├─────────────────────────────────────────────────────────────────┤
│  Domain Names:     [ aproxima.app.ufn.edu.br ]                  │
│                    [+ Add Domain Name]                           │
│                                                                  │
│  Scheme:           [http ▼] (NÃO usar https aqui!)             │
│  Forward Hostname: [ 10.21.19.45 ]                              │
│  Forward Port:     [ 3000 ]                                     │
│                                                                  │
│  ☑ Cache Assets                                                 │
│  ☑ Block Common Exploits                                        │
│  ☑ Websockets Support                                           │
│     (Importante se usar WebSocket/Socket.io)                    │
├─────────────────────────────────────────────────────────────────┤
```

**⚠️ IMPORTANTE**: 
- **Scheme** deve ser `http` (a comunicação interna é HTTP)
- O HTTPS será configurado pelo Nginx Proxy Manager na aba SSL

### 2.4 Configurar SSL (Aba SSL)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Aba SSL]                                                      │
│                                                                  │
│  SSL Certificate: [Request a new SSL Certificate ▼]             │
│                                                                  │
│  ☑ Force SSL                                                    │
│     (Redireciona HTTP → HTTPS automaticamente)                  │
│                                                                  │
│  ☑ HTTP/2 Support                                               │
│     (Melhora performance)                                       │
│                                                                  │
│  ☑ HSTS Enabled                                                 │
│     (Segurança adicional)                                       │
│                                                                  │
│  ☑ HSTS Subdomains                                              │
│                                                                  │
│  Email Address: [ seu-email@ufn.edu.br ]                        │
│                 (Para notificações Let's Encrypt)               │
│                                                                  │
│  ☑ I Agree to the Let's Encrypt Terms of Service               │
├─────────────────────────────────────────────────────────────────┤
│                              [SAVE]                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.5 Configurações Avançadas (Aba Advanced - Opcional)

Se precisar de configurações personalizadas do Nginx:

```nginx
# Aumentar timeout para uploads grandes
client_max_body_size 50M;

# Headers de segurança adicionais
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;

# Cache de assets estáticos
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Configuração para Next.js
location /_next/static {
    proxy_cache STATIC;
    proxy_pass http://10.21.19.45:3000;
}
```

---

## ✅ PASSO 3: Verificar Funcionamento

### 3.1 Testes de Conectividade

1. **Teste local (dentro da rede UFN)**:
   ```bash
   curl http://10.21.19.45:3000
   ```
   ✅ Deve retornar HTML da aplicação

2. **Teste via domínio**:
   ```bash
   curl https://aproxima.app.ufn.edu.br
   ```
   ✅ Deve retornar HTML da aplicação

3. **Acesso via navegador**:
   - Abra: https://aproxima.app.ufn.edu.br
   - Verifique se o cadeado SSL está verde 🔒
   - Inspecione o certificado (deve ser Let's Encrypt)

### 3.2 Verificar Logs

**No Portainer**:
```
Stacks → aproxima → Logs
```
Procure por:
- ✅ `Ready in XXXms`
- ✅ `Server running on http://0.0.0.0:3000`
- ❌ Erros de conexão, build, etc.

**No Nginx Proxy Manager**:
```
Access Lists → aproxima.app.ufn.edu.br → View Access Log
```
- Verifique requests HTTP/HTTPS
- Status codes (200, 304, etc.)

---

## 🔧 TROUBLESHOOTING

### Problema 1: "502 Bad Gateway"

**Causa**: Container não está rodando ou porta incorreta

**Solução**:
1. Verifique se o container está UP:
   ```
   Portainer → Containers → aproxima-app → Status: Running
   ```
2. Verifique logs do container:
   ```bash
   # No container
   docker logs aproxima-app
   ```
3. Confirme porta no compose: `3000:3000`

---

### Problema 2: "SSL Certificate Error"

**Causa**: Certificado Let's Encrypt falhou ou expirou

**Solução**:
1. No Nginx Proxy Manager:
   ```
   Hosts → aproxima.app.ufn.edu.br → Editar
   ```
2. Vá na aba **SSL**
3. Clique em **Force Renew** (se existir)
4. Ou delete o certificado e crie novo

---

### Problema 3: "Connection Timeout"

**Causa**: Firewall bloqueando ou porta não mapeada

**Solução**:
1. Teste conectividade direta:
   ```bash
   telnet 10.21.19.45 3000
   ```
2. Verifique regras de firewall UFN
3. Confirme que porta 3000 está aberta

---

### Problema 4: Aplicação reiniciando constantemente

**Causa**: Erro no código ou healthcheck muito agressivo

**Solução**:
1. Verifique logs:
   ```bash
   docker logs aproxima-app --tail 100
   ```
2. Desative temporariamente healthcheck:
   ```yaml
   # Comentar no docker-compose.yml
   # healthcheck:
   #   test: [...]
   ```
3. Corrija o erro e reative healthcheck

---

## 📊 Monitoramento

### Verificar Status do Container

**Via Portainer**:
```
Containers → aproxima-app
├─ Status: Running ✅
├─ CPU Usage: XX%
├─ Memory: XX MB / XX GB
└─ Network: RX/TX
```

### Verificar Logs em Tempo Real

**Via Portainer**:
```
Containers → aproxima-app → Logs → ☑ Auto-refresh
```

**Via Docker CLI** (se tiver acesso SSH):
```bash
docker logs -f aproxima-app
```

### Métricas de Acesso

**Nginx Proxy Manager**:
```
Hosts → aproxima.app.ufn.edu.br → View Access Log
```
- Total de requests
- IPs de origem
- User agents
- Status codes

---

## 🔄 Atualizações

### Atualizar Código da Aplicação

1. **Push para GitHub**:
   ```bash
   git push origin main
   ```

2. **Rebuild no Portainer**:
   ```
   Stacks → aproxima → Editor → Deploy the stack
   ```
   Ou:
   ```
   Containers → aproxima-app → Recreate
   ☑ Pull latest image
   ```

### Atualizar Configuração do Proxy

1. Acesse Nginx Proxy Manager
2. Edite o Proxy Host existente
3. Faça as alterações necessárias
4. Clique em **Save**

---

## 📚 Recursos Adicionais

- **Documentação Portainer**: https://docs.portainer.io/
- **Nginx Proxy Manager**: https://nginxproxymanager.com/guide/
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## 🆘 Suporte UFN

Em caso de problemas persistentes:

1. **TI UFN**: suporte-ti@ufn.edu.br
2. **Logs**: Anexe logs do container e do Nginx
3. **Screenshots**: Print de erros no navegador
4. **Informações**:
   - Nome da stack: `aproxima`
   - Domínio: `aproxima.app.ufn.edu.br`
   - IP/Porta: `10.21.19.45:3000`

---

*Configurado para ambiente UFN - Dezembro 2025*
