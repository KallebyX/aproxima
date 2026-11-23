# Aproxima no Docker

A aplicação usa uma imagem Next.js standalone, Node.js 24 e usuário sem privilégios. O container inicia apenas `node server.js`: não baixa código, instala dependências ou compila ao reiniciar.

## Verificar localmente

Na raiz do repositório, defina `ENCRYPTION_KEY` com 32 bytes aleatórios em hexadecimal e mantenha a chave enquanto precisar dos dados locais:

```sh
export ENCRYPTION_KEY="$(openssl rand -hex 32)"
docker compose -f docker/docker-compose.yml up --build -d
curl --fail http://127.0.0.1:3010/api/health
```

O contexto do build é a raiz do projeto; o Dockerfile fica em `docker/Dockerfile`. A porta interna é sempre 3000. `PORT` altera a porta local publicada (3010 por padrão). O volume local guarda somente os dados de execução.

## Publicar uma imagem

O workflow **Publish production image** executa em `main`, na branch de correção UFN e manualmente. Ele publica `ghcr.io/kallebyx/aproxima:sha-<commit-completo>` e registra o digest no resumo. O marcador `latest` só é atualizado por `main`.

Antes da atualização no servidor, valide a imagem e copie o endereço com digest, por exemplo `ghcr.io/kallebyx/aproxima@sha256:...`. Uma reinicialização da stack não muda essa versão.

## Atualizar na UFN

1. Faça uma cópia da configuração atual da stack e preserve os volumes existentes para permitir reversão.
2. No Portainer, use `docker/docker-compose.ufn.yml` e defina `APROXIMA_IMAGE` com o digest validado. `docker/stack.env` contém somente um modelo das variáveis.
3. Defina `ENCRYPTION_KEY` privadamente no Portainer: 32 bytes aleatórios em hexadecimal. Guarde uma cópia segura e preserve a mesma chave nos próximos deploys.
4. Mantenha `BIND_IP=10.21.19.45` e `PORT=3000`, correspondentes ao destino atual do proxy.
5. Atualize a stack, confirme `healthy` e verifique `https://aproxima.app.ufn.edu.br/api/health` e os fluxos públicos pelo navegador.

O Nginx Proxy Manager deve encaminhar HTTP para `10.21.19.45:3000`, com o certificado do domínio e redirecionamento para HTTPS. O healthcheck consulta `/api/health` dentro do próprio container.

O volume exclusivo `aproxima-runtime-data` é montado em `/app/data`, com escrita para UID 1000. Ele guarda dados de API e não contém o código-fonte. Não monte volumes sobre `/app` ou `.next`. A chave de criptografia e o volume devem ser preservados e copiados juntos para recuperação.

## Diagnóstico e reversão

```sh
bash docker/diagnose.sh
```

O comando exibe estado, imagem e resultado do healthcheck sem imprimir variáveis de ambiente. Para reverter, restaure o digest e a configuração anteriores no Portainer; não remova volumes de dados.
