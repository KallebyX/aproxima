# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar package files e instalar dependências
COPY package*.json ./
RUN npm ci --include=dev --ignore-scripts

# Copiar código e buildar
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar apenas o necessário
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3010

CMD ["node", "server.js"]