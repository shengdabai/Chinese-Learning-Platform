FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

COPY index.html tsconfig.json tsconfig.app.json vite.config.ts tailwind.config.js postcss.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY scripts/serve.mjs ./scripts/serve.mjs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["node", "scripts/serve.mjs"]
