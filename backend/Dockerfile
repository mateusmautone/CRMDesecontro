# syntax=docker/dockerfile:1

# ---- Base Node ----
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- Dependencies ----
FROM base AS deps
# Install OS deps for build (openssl for Prisma)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json tsconfig.json ./
COPY prisma ./prisma

# Install all dependencies (including dev) to build
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY package.json tsconfig.json ./
COPY src ./src

# Build the application
RUN npm run build

# ---- Production Dependencies ----
FROM base AS prod-deps
COPY package.json ./
COPY prisma ./prisma
# Install only production dependencies
RUN npm install --omit=dev
# We need prisma client in prod deps too
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# ---- Runtime ----
FROM base AS runtime
# Install openssl for Prisma runtime
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Copy .env.example if needed, but prefer env vars in Cloud Run


EXPOSE 4000
CMD ["node", "dist/server.js"]
