FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
ENV DATABASE_URL="mysql://ecoswap:ecoswap@127.0.0.1:3306/ecoswap"
RUN npm ci

COPY . .

RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Hanya untuk build; runtime di-override oleh docker-compose
ENV DATABASE_URL="mysql://ecoswap:ecoswap@127.0.0.1:3306/ecoswap"

RUN npm run build

EXPOSE 5173

COPY docker/entrypoint.prod.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
