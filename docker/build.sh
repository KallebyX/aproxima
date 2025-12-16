#!/bin/bash
set -e

echo "🐳 Building Docker Image"
echo "======================="

cd /workspaces/aproxima
docker build -f docker/Dockerfile -t aproxima:latest .

echo ""
echo "✅ Build concluído!"
echo ""
echo "Próximos passos:"
echo "================"
echo ""
echo "1. Ver imagem criada:"
echo "   docker images | grep aproxima"
echo ""
echo "2. Testar localmente:"
echo "   docker run -d -p 3010:3000 --name aproxima-test aproxima:latest"
echo "   curl http://localhost:3010/api/health"
echo ""
echo "3. Deploy no Portainer:"
echo "   - Use docker-compose.portainer.yml"
echo "   - A imagem 'aproxima:latest' já está disponível"
echo ""
