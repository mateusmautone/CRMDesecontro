# syntax=docker/dockerfile:1

FROM node:20-slim AS base
WORKDIR /app

# ---- Install OS deps once ----
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# ---- Dependencies (cached) ----
FROM base AS deps

COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install ALL deps (cached unless package.json changes)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN npm run build

# ---- Production image ----
FROM base AS runtime

WORKDIR /app

# Copy only production deps
COPY --from=deps /app/node_modules ./node_modules

# Copy build output
COPY --from=build /app/dist ./dist
COPY package.json .

EXPOSE 4000
CMD ["node", "dist/server.js"]
