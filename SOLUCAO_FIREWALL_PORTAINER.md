# 🔥 SOLUÇÃO: Firewall Bloqueando Porta 3010

## ⚠️ Problema Atual:
```
ERR_CONNECTION_TIMED_OUT em http://10.21.19.45:3010
```

**Causa:** Firewall do servidor está bloqueando a porta 3010.

---

## ✅ SOLUÇÃO SEM SSH - Via Portainer

### Opção 1: Usar Porta que JÁ está Aberta (Recomendado)

Se o Portainer está em `http://10.21.19.45:9000`, significa que a **porta 9000 já está liberada** no firewall!

**Mude a porta da aplicação para uma que já funciona:**

1. **No Portainer, edite a Stack:**
   - Stacks > aproxima > Editor

2. **Mude a linha de ports para uma porta já aberta:**

```yaml
ports:
  - "9001:3010"  # Porta 9001 (provavelmente já liberada)
  # ou
  - "8080:3010"  # Porta 8080 (comum estar aberta)
  # ou  
  - "80:3010"    # Porta 80 (HTTP padrão)
```

3. **Update the stack**

4. **Teste:**
```
http://10.21.19.45:9001
# ou
http://10.21.19.45:8080
# ou
http://10.21.19.45
```

---

### Opção 2: Usar Network Host (Bypass do Firewall Interno)

Essa configuração faz o container usar a rede do host diretamente:

```yaml
version: '3.8'

services:
  aproxima:
    image: node:18-alpine
    container_name: aproxima
    network_mode: host  # <-- Importante!
    environment:
      NODE_ENV: production
      PORT: 3010
    volumes:
      - app_data:/tmp/aproxima
    command: >
      sh -c "
        apk add --no-cache git &&
        if [ ! -d /tmp/aproxima/.git ]; then
          git clone https://github.com/KallebyX/aproxima.git /tmp/aproxima &&
          cd /tmp/aproxima &&
          npm ci --include=dev --ignore-scripts &&
          npm run build;
        fi &&
        cd /tmp/aproxima &&
        cp -r public .next/standalone/ &&
        mkdir -p .next/standalone/.next &&
        cp -r .next/static .next/standalone/.next/ &&
        cd .next/standalone &&
        HOSTNAME=0.0.0.0 PORT=3010 node server.js
      "
    restart: unless-stopped

volumes:
  app_data:
```

**Nota:** Com `network_mode: host`, remova a seção `ports:`.

---

### Opção 3: Pedir ao Admin para Liberar Porta

Se você tem contato com quem gerencia o servidor, peça para executar:

```bash
sudo ufw allow 3010/tcp
sudo ufw reload
```

Ou no firewalld:
```bash
sudo firewall-cmd --permanent --add-port=3010/tcp
sudo firewall-cmd --reload
```

---

## 🎯 Qual usar?

**RECOMENDADO:** Opção 1 - Usar porta que já está aberta

Exemplo prático:
- Se Portainer está em `:9000`
- Use `:9001` para sua aplicação
- Provavelmente já está liberado no firewall

---

## 📝 YAML Completo Recomendado (Porta 9001)

```yaml
version: '3.8'

services:
  aproxima:
    image: node:18-alpine
    container_name: aproxima
    ports:
      - "9001:3010"  # Porta 9001 externa (provavelmente já liberada)
    environment:
      NODE_ENV: production
      PORT: 3010
    volumes:
      - app_data:/tmp/aproxima
    command: >
      sh -c "
        apk add --no-cache git &&
        if [ ! -d /tmp/aproxima/.git ]; then
          echo '📥 Clonando repositório...' &&
          git clone https://github.com/KallebyX/aproxima.git /tmp/aproxima &&
          cd /tmp/aproxima &&
          npm ci --include=dev --ignore-scripts &&
          npm run build;
        else
          echo '✅ Repositório já existe...' &&
          cd /tmp/aproxima &&
          git pull;
        fi &&
        echo '📁 Preparando arquivos...' &&
        cd /tmp/aproxima &&
        cp -r public .next/standalone/ &&
        mkdir -p .next/standalone/.next &&
        cp -r .next/static .next/standalone/.next/ &&
        echo '🚀 Iniciando aplicação...' &&
        cd .next/standalone &&
        HOSTNAME=0.0.0.0 PORT=3010 node server.js
      "
    restart: unless-stopped

volumes:
  app_data:
```

**Acesse em:** `http://10.21.19.45:9001`

---

## 🔍 Como Descobrir Portas Abertas?

Tente acessar estas portas comuns no navegador:

- `http://10.21.19.45:80` (HTTP padrão)
- `http://10.21.19.45:8080` (HTTP alternativo)
- `http://10.21.19.45:9000` (Portainer)
- `http://10.21.19.45:9001` (Próxima ao Portainer)
- `http://10.21.19.45:443` (HTTPS)

Se alguma responder (mesmo com erro 404), significa que está aberta no firewall!
