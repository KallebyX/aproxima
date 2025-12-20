#!/bin/bash

echo "🔍 Diagnóstico de Rede - Aproxima"
echo "=================================="
echo ""

# 1. Verificar se container está rodando
echo "1. Status do Container:"
docker ps | grep aproxima || echo "❌ Container não encontrado"
echo ""

# 2. Verificar portas expostas
echo "2. Portas do Container:"
docker port aproxima 2>/dev/null || echo "❌ Não foi possível verificar portas"
echo ""

# 3. Testar internamente no servidor
echo "3. Teste Local (dentro do servidor):"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://127.0.0.1:3010/api/health 2>/dev/null || echo "❌ Porta 3010 não responde localmente"
echo ""

# 4. Verificar se porta está escutando
echo "4. Porta 3010 está aberta?"
netstat -tlnp | grep 3010 || ss -tlnp | grep 3010 || echo "❌ Porta 3010 não está escutando"
echo ""

# 5. Verificar firewall
echo "5. Firewall Status:"
if command -v ufw &> /dev/null; then
    sudo ufw status | grep 3010 || echo "⚠️  Porta 3010 não está na regra do UFW"
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --list-ports | grep 3010 || echo "⚠️  Porta 3010 não está no firewall"
else
    echo "ℹ️  Firewall não detectado (ufw/firewalld)"
fi
echo ""

# 6. Verificar logs do container
echo "6. Últimas linhas do log:"
docker logs aproxima --tail 20 2>/dev/null || echo "❌ Não foi possível ler logs"
echo ""

echo "=================================="
echo "📋 Próximos Passos:"
echo ""
echo "Se porta 3010 não responde localmente:"
echo "  → Verificar mapeamento de portas do Docker"
echo ""
echo "Se responde localmente mas não externamente:"
echo "  → Abrir porta no firewall:"
echo "     sudo ufw allow 3010/tcp"
echo "     sudo ufw reload"
echo ""
echo "  Ou com firewalld:"
echo "     sudo firewall-cmd --permanent --add-port=3010/tcp"
echo "     sudo firewall-cmd --reload"
echo ""
