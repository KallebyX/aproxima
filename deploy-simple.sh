#!/bin/bash

echo "🚀 Deploy Aproxima - Comandos Simples"
echo "====================================="

# Parar e remover container existente
echo "1. Parando container existente..."
docker stop aproxima-app 2>/dev/null
docker rm aproxima-app 2>/dev/null

# Remover imagem antiga
echo "2. Removendo imagem antiga..."
docker rmi aproxima-simple 2>/dev/null

# Build nova imagem
echo "3. Fazendo build da imagem..."
docker build -t aproxima-simple .

# Verificar se build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "❌ Erro no build - abortando"
    exit 1
fi

# Executar container
echo "4. Iniciando container..."
docker run -d --name aproxima-app -p 3000:3000 aproxima-simple

# Verificar se container iniciou
echo "5. Verificando status..."
sleep 5
if docker ps | grep -q aproxima-app; then
    echo "✅ Deploy concluído!"
    echo "📱 Acesse: http://localhost:3000"
    echo "📋 Logs: docker logs aproxima-app"
else
    echo "❌ Erro - verificar logs:"
    docker logs aproxima-app
fi