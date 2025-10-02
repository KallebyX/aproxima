#!/bin/bash

echo "🚀 Iniciando deploy do Aproxima..."

# Verifica se Docker está disponível
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado ou não está no PATH"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado ou não está no PATH"
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Para o serviço se estiver rodando
echo "🛑 Parando serviços existentes..."
docker-compose -f docker-compose.simple.yml down

# Build e start
echo "🔨 Fazendo build e iniciando..."
docker-compose -f docker-compose.simple.yml up -d --build

# Aguarda um pouco para o serviço subir
echo "⏳ Aguardando serviço iniciar..."
sleep 10

# Verifica se está rodando
if docker-compose -f docker-compose.simple.yml ps | grep -q "Up"; then
    echo "✅ Deploy realizado com sucesso!"
    echo "📱 Aplicação disponível em: http://localhost:3000"
    echo "📋 Para verificar logs: docker-compose -f docker-compose.simple.yml logs -f"
else
    echo "❌ Erro no deploy. Verificando logs..."
    docker-compose -f docker-compose.simple.yml logs
fi