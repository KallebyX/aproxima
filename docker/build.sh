#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="${APROXIMA_IMAGE:-aproxima:local}"

docker build --file "$PROJECT_ROOT/docker/Dockerfile" --tag "$IMAGE" "$PROJECT_ROOT"
printf 'Image built: %s\n' "$IMAGE"
printf 'Local verification: docker compose -f %s/docker/docker-compose.yml up -d\n' "$PROJECT_ROOT"
