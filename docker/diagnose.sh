#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME="${APROXIMA_CONTAINER:-aproxima-app}"
printf 'Container: %s\n' "$CONTAINER_NAME"
docker inspect --format 'Running={{.State.Running}} Health={{if .State.Health}}{{.State.Health.Status}}{{else}}not configured{{end}} Image={{.Config.Image}}' "$CONTAINER_NAME"
docker port "$CONTAINER_NAME"
docker exec "$CONTAINER_NAME" node -e '
  fetch("http://127.0.0.1:" + (process.env.PORT || "3000") + "/api/health", {signal: AbortSignal.timeout(5000)})
    .then(async response => {
      console.log("Health HTTP status:", response.status);
      if (!response.ok) process.exit(1);
    })
    .catch(error => { console.error(error.message); process.exit(1); });
'
