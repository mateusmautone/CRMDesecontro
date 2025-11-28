# syntax=docker/dockerfile:1

# ---- Base deps ----
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- Dependencies ----
FROM base AS deps
# Install OS deps for build (if needed)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json tsconfig.json ./
COPY prisma ./prisma
RUN npm install --omit=dev
RUN npx prisma generate

# ---- Build ----
FROM base AS build
ENV NODE_ENV=development
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json tsconfig.json ./
RUN npm install
COPY prisma ./prisma
COPY src ./src
RUN npm run build

# ---- Runtime ----
FROM base AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY .env.example ./.env.example
EXPOSE 4000
CMD ["node", "dist/server.js"]
