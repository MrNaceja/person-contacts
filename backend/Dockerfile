# Monta a stack backend
FROM node:22-alpine3.21 AS builder

WORKDIR /app

COPY package*.json .
RUN npm ci --omit-dev

COPY tsconfig.json .
COPY src ./src

RUN npm run build

# Inicia a stack backend
FROM node:22-alpine3.21 AS runner 

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY /src/db/migrations ./dist/db/migrations
COPY drizzle.config.ts ./

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
CMD ["sh", "./entrypoint.sh"]