#!/usr/bin/env bash
set -euo pipefail

# This command builds and starts the local preview only. UFN uses a published,
# tested image digest through docker-compose.ufn.yml in Portainer.
PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
docker compose --file "$PROJECT_ROOT/docker/docker-compose.yml" up --build --detach
printf 'Local preview: http://127.0.0.1:%s\n' "${PORT:-3010}"
printf 'Health: http://127.0.0.1:%s/api/health\n' "${PORT:-3010}"
