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
- Postgres: `localhost:5432` (configure usuário/senha em `.env`)

A API consome a `DATABASE_URL` definida no arquivo de ambiente (ex.: `.env`).
Crie um `.env` a partir de `.env.example` e ajuste os valores de conexão antes de subir o Compose.

## Testar

```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/v1/leads
curl -X POST http://localhost:4000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Lead Docker","email":"docker@test.com","source":"web"}'
```
