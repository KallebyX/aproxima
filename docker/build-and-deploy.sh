#!/bin/bash
set -e

echo "🚀 Build e Deploy para Portainer"
echo "================================="

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

IMAGE_NAME="aproxima"
IMAGE_TAG="latest"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${BLUE}1. Fazendo build da imagem Docker...${NC}"
docker build -f docker/Dockerfile -t $FULL_IMAGE .

echo -e "${GREEN}✓ Build concluído${NC}"
echo ""

echo -e "${BLUE}2. Testando a imagem...${NC}"
docker images | grep $IMAGE_NAME

echo ""
echo -e "${GREEN}✓ Imagem criada com sucesso!${NC}"
echo ""

echo "Próximos passos:"
echo "================"
echo ""
echo "OPÇÃO A - Se seu Portainer está neste servidor:"
echo "  1. No Portainer, crie uma Stack"
echo "  2. Use: docker/docker-compose.portainer.yml"
echo "  3. Deploy"
echo ""
echo "OPÇÃO B - Se seu Portainer está em outro servidor:"
echo "  1. Salve a imagem: docker save ${FULL_IMAGE} -o aproxima.tar"
echo "  2. Transfira para o servidor: scp aproxima.tar user@servidor:/tmp/"
echo "  3. No servidor: docker load -i /tmp/aproxima.tar"
echo "  4. No Portainer, use docker-compose.portainer.yml"
echo ""
echo "OPÇÃO C - Docker Registry (recomendado para produção):"
echo "  1. Tag: docker tag ${FULL_IMAGE} seu-registry/aproxima:latest"
echo "  2. Push: docker push seu-registry/aproxima:latest"
echo "  3. Atualize docker-compose.portainer.yml com a imagem do registry"
echo ""
