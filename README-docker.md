# Desenvolvimento com Docker

Compose para rodar backend + Postgres localmente.

## Rodar

```bash
# na raiz do workspace
docker compose -f docker-compose.dev.yml up -d --build

# rodar migrações dentro do container da api
docker compose -f docker-compose.dev.yml exec api npm run migrate:deploy

# logs
docker compose -f docker-compose.dev.yml logs -f api
docker compose -f docker-compose.dev.yml logs -f db

# parar
docker compose -f docker-compose.dev.yml down
```

## Serviços
- API: `http://localhost:4000`
- Postgres: `localhost:5432` (usuário `crm_user`, senha `crm_pass`, DB `crmdesecontro`)

A API consome `DATABASE_URL=postgresql://crm_user:crm_pass@db:5432/crmdesecontro?schema=public` dentro da rede do compose.

## Testar

```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/v1/leads
curl -X POST http://localhost:4000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Lead Docker","email":"docker@test.com","source":"web"}'
```
