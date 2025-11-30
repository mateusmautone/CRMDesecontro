# CRMDesecontro Backend

API em Node.js + Express com TypeScript, Prisma ORM e Postgres.

## Scripts

- `npm run dev`: modo desenvolvimento (hot reload via `tsx`).
- `npm run build`: compila TypeScript + gera Prisma Client.
- `npm start`: roda a build compilada.
- `npm run typecheck`: checa tipos sem gerar saída.
- `npm run prisma:generate`: gera Prisma Client.
- `npm run migrate:dev`: cria e aplica migração em dev.
- `npm run migrate:deploy`: aplica migrações em produção.
- `npm run db:push`: sync schema sem criar migration (dev rápido).

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

```
PORT=4000
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://crm_user:crm_pass@localhost:5432/crmdesecontro?schema=public
```

## Rodar localmente (sem Docker)

```bash
cd backend
npm install
cp .env.example .env

# subir o Postgres (veja ../database/README.md)
# ou use o compose raiz (veja ../README-docker.md)

# gerar Prisma Client e criar tabelas
npm run prisma:generate
npm run migrate:dev

npm run dev
```

## Rodar com Docker Compose (backend + DB)

Na raiz do workspace:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Dentro do container, rodar migrações:

```bash
docker compose -f docker-compose.dev.yml exec api npm run migrate:deploy
```

## Endpoints

- `GET /health`
- `GET /api/v1/leads` – listar leads
- `GET /api/v1/leads/:id` – buscar lead
- `POST /api/v1/leads` – criar lead
- `PATCH /api/v1/leads/:id` – atualizar lead
- `DELETE /api/v1/leads/:id` – deletar lead

## Modelos Prisma

- **Lead**: `id`, `name`, `email`, `phone`, `source`, `status`, timestamps
- **Client**: `id`, `name`, `email`, `phone`, `company`, timestamps
- **Negotiation**: `id`, `title`, `description`, `value`, `status`, `closedAt`, relações com Lead/Client
- **Interaction**: `id`, `type`, `content`, relações com Lead/Client/Negotiation

## Deploy

O workflow `.github/workflows/backend-ci.yml` faz build e push da imagem para **GitHub Container Registry** a cada push na `main`.

Imagem: `ghcr.io/<owner>/crmdesecontro/backend:latest`

Para rodar em produção:

1. Provisionar Postgres gerenciado (Supabase, Railway, Neon, RDS, etc.).
2. Setar env vars: `DATABASE_URL`, `PORT`, `CORS_ORIGIN`.
3. Rodar `npm run migrate:deploy` antes do `npm start`.
4. Fazer pull da imagem e rodar (Render, Fly.io, Azure Container Apps, etc.).
