FROM node:22-alpine3.21 AS builder

WORKDIR /app

COPY package*.json .
RUN npm i

COPY drizzle.config.ts .
COPY tsconfig.json .
COPY src ./src

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run build
RUN npm run migrate

FROM node:22-slim AS runner 

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start"]