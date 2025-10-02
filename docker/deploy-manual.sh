#!/bin/bash

echo "🚀 Deploy Aproxima - Versão Robusta"
echo "=================================="

# Função para verificar se um comando existe
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 não está disponível"
        return 1
    fi
    return 0
}

# Função para limpar recursos antigos
cleanup_old() {
    echo "🧹 Limpando recursos antigos..."
    docker stop aproxima-app 2>/dev/null || true
    docker rm aproxima-app 2>/dev/null || true
    docker rmi aproxima-img 2>/dev/null || true
    echo "✅ Limpeza concluída"
}

# Função para build manual sem compose
build_manual() {
    echo "🔨 Fazendo build manual da imagem..."
    
    # Build da imagem
    docker build -t aproxima-img . --no-cache
    
    if [ $? -eq 0 ]; then
        echo "✅ Build da imagem concluído"
        return 0
    else
        echo "❌ Erro no build da imagem"
        return 1
    fi
}

# Função para executar container manualmente
run_manual() {
    echo "🚀 Iniciando container..."
    
    docker run -d \
        --name aproxima-app \
        --restart unless-stopped \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e PORT=3000 \
        aproxima-img
    
    if [ $? -eq 0 ]; then
        echo "✅ Container iniciado com sucesso"
        return 0
    else
        echo "❌ Erro ao iniciar container"
        return 1
    fi
}

# Função para verificar saúde do container
health_check() {
    echo "🔍 Verificando saúde do container..."
    sleep 10
    
    # Verifica se container está rodando
    if docker ps | grep -q aproxima-app; then
        echo "✅ Container está executando"
        
        # Testa resposta HTTP
        if curl -f -s http://localhost:3000 > /dev/null; then
            echo "✅ Aplicação respondendo corretamente"
            echo "📱 Acesse: http://localhost:3000"
            return 0
        else
            echo "⚠️ Container rodando mas aplicação não responde"
            echo "📋 Verificando logs..."
            docker logs aproxima-app --tail 20
            return 1
        fi
    else
        echo "❌ Container não está executando"
        echo "📋 Verificando logs..."
        docker logs aproxima-app --tail 20
        return 1
    fi
}

# Função principal
main() {
    # Verificações iniciais
    echo "🔍 Verificando pré-requisitos..."
    check_command docker || exit 1
    check_command curl || echo "⚠️ curl não disponível - testes limitados"
    
    # Limpeza
    cleanup_old
    
    # Build
    if ! build_manual; then
        echo "❌ Falha no build - abortando"
        exit 1
    fi
    
    # Execução
    if ! run_manual; then
        echo "❌ Falha na execução - abortando" 
        exit 1
    fi
    
    # Verificação
    if health_check; then
        echo ""
        echo "🎉 Deploy realizado com sucesso!"
        echo "=================================="
        echo "📱 Aplicação: http://localhost:3000"
        echo "📋 Logs: docker logs aproxima-app -f"
        echo "🛑 Parar: docker stop aproxima-app"
        echo "🔄 Reiniciar: docker restart aproxima-app"
    else
        echo ""
        echo "⚠️ Deploy parcialmente bem-sucedido"
        echo "Container criado mas pode ter problemas"
        echo "Verifique os logs: docker logs aproxima-app -f"
    fi
}

# Executar função principal
main