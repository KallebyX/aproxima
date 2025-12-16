# 🐳 Deploy no Portainer via GitHub

## Configuração Passo a Passo

### 1. No Portainer, vá em: **Stacks > Add Stack**

### 2. Preencha os campos:

**Name:**
```
aproxima
```

**Build method:** Selecione **"Repository"**

### 3. Configuração do Repository:

**Repository URL:**
```
https://github.com/KallebyX/aproxima
```

**Repository reference:**
```
refs/heads/main
```

**Compose path:**
```
docker/docker-compose.yml
```

### 4. Authentication (se repositório privado):

Se o repositório for privado, configure:
- **Username:** seu-usuario-github
- **Personal Access Token:** [crie em https://github.com/settings/tokens]
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
