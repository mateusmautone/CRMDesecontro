# Banco de Dados (Postgres)

Ambiente local via Docker Compose para o CRMDesecontro.

## Pré-requisitos
- Docker e Docker Compose

## Uso

```bash
cd database
cp .env.example .env
# sobe o Postgres
docker compose up -d

# checar status
docker compose ps

# logs
docker compose logs -f
```

O Postgres ficará disponível em `localhost:${POSTGRES_PORT}` (padrão 5432).

## Conexão

String de conexão compatível com Prisma/ORM:
```
# Exemplo (não comite credenciais):
# postgresql://crm_user:replace_with_secure_password@localhost:5432/crmdesecontro?schema=public
```
