# 🔥 Aplicação Buildou mas Não Acessa - Solução

## ⚠️ IMPORTANTE: ONDE EXECUTAR OS COMANDOS

**❌ NÃO execute dentro do container**
**✅ Execute no SERVIDOR HOST (SSH no servidor)**

### Como identificar:
```bash
# Se você vê isso, está DENTRO do container (errado):
/app # ls
/ # 

# Se você vê isso, está no SERVIDOR (correto):
user@servidor:~$ 
```

### Sair do container:
```bash
exit
# ou Ctrl+D
```

---

## ✅ Status Atual:
- Container rodando: ✅
- Build bem-sucedido: ✅  
- Aplicação iniciou: ✅ (http://0.0.0.0:3000)
- **Problema:** Não acessa pelo IP externo (10.21.19.45:3010)

---

## 🔍 Diagnóstico Rápido

**No servidor, execute:**
```bash
./docker/diagnose.sh
```

Ou manualmente:

### 1. Container está rodando?
```bash
docker ps | grep aproxima
```

### 2. Porta está mapeada?
```bash
docker port aproxima
# Deve mostrar: 3000/tcp -> 0.0.0.0:3010
```

### 3. Teste local funciona?
```bash
curl http://127.0.0.1:3010/api/health
# Deve retornar: {"status":"healthy"}
```

### 4. Porta está escutando?
```bash
netstat -tlnp | grep 3010
# ou
ss -tlnp | grep 3010
```

---

## 🛠️ Soluções Baseadas no Diagnóstico

### ❌ Se "Teste local" FALHA:

**Problema:** Docker não está mapeando a porta corretamente.

**Solução:**
```bash
# 1. Parar e remover container
docker stop aproxima
docker rm aproxima

# 2. No Portainer, deletar a stack e recriar
# Ou redeploye via:
cd /tmp/aproxima
docker-compose -f docker/docker-compose.webeditor.yml up -d
```

---

### ✅ Se "Teste local" FUNCIONA mas externo falha:

**Problema:** Firewall bloqueando a porta 3010.

**Solução A - UFW (Ubuntu/Debian):**
```bash
sudo ufw allow 3010/tcp
sudo ufw reload
sudo ufw status
```

**Solução B - Firewalld (CentOS/RHEL):**
```bash
sudo firewall-cmd --permanent --add-port=3010/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

**Solução C - iptables:**
```bash
sudo iptables -A INPUT -p tcp --dport 3010 -j ACCEPT
sudo iptables-save
```

---

## 🌐 Depois de Abrir o Firewall

### Teste externo:
```bash
# Do seu computador local
curl http://10.21.19.45:3010/api/health
```

Deve retornar:
```json
{"status":"healthy"}
```

### Acessar pelo navegador:
```
http://10.21.19.45:3010
```

---

## 🔧 Configurar Nginx (Opcional - Recomendado)

Depois que funcionar direto na porta 3010, configure o Nginx:

### 1. Criar configuração:
```bash
sudo nano /etc/nginx/sites-available/aproxima
```

### 2. Colar:
```nginx
server {
    listen 80;
    server_name 10.21.19.45;  # ou seu domínio

    location / {
        proxy_pass http://127.0.0.1:3010;
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

### 3. Ativar:
```bash
sudo ln -s /etc/nginx/sites-available/aproxima /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Abrir porta 80 no firewall:
```bash
sudo ufw allow 80/tcp
sudo ufw reload
```

Agora acesse sem porta:
```
http://10.21.19.45
```

---

## 📊 Verificações Finais

```bash
# Container rodando
docker ps | grep aproxima

# Logs em tempo real
docker logs aproxima -f

# Teste local
curl http://127.0.0.1:3010/api/health

# Teste externo (do seu PC)
curl http://10.21.19.45:3010/api/health

# Firewall
sudo ufw status | grep 3010
```

---

## 🎯 Resumo dos Comandos Mais Prováveis:

**99% dos casos é firewall:**

```bash
# Abrir porta
sudo ufw allow 3010/tcp
sudo ufw reload

# Testar
curl http://10.21.19.45:3010/api/health
```

Se ainda não funcionar:
```bash
# Ver logs do container
docker logs aproxima --tail 50
```
