# Próximos Passos – CRM Desencontro (Web App / TCC)

Este documento descreve o plano de evolução do projeto para atender aos requisitos mínimos da linha **Web Apps** do Portfólio/TCC, mantendo a stack atual baseada em **Next.js**.

---

## 1. Arquitetura Alvo (mantendo Next.js)

- **Frontend**: Next.js 15 (App Router) com React, TypeScript, TailwindCSS, Radix UI.
- **Backend**: Route Handlers/API Routes do Next (`src/app/api/.../route.ts`), expondo APIs REST internas.
- **Banco de Dados**: PostgreSQL (instância em cloud – ex.: Render, Railway, Supabase, RDS, etc.).
- **ORM**: Prisma ORM para schema, migrations e acesso ao PostgreSQL.
- **Autenticação**: a definir (ex.: NextAuth.js ou JWT simples via API interna).
- **Observabilidade/Monitoramento**: integração com ferramenta externa (ex.: Datadog, New Relic ou stack Prometheus + Grafana).
- **Análise Estática**: SonarCloud (ou SonarQube) integrado ao GitHub Actions.

Objetivo: manter arquitetura **client-server** clara, com camadas de **UI**, **API** e **persistência** bem definidas, alinhada ao RFC e aos requisitos de Web Apps.

---

## 2. Backend + Banco de Dados Real

### 2.1. Configurar Postgres e Prisma

1. **Adicionar dependências**:
   - `prisma`, `@prisma/client`, `pg`.
2. **Criar schema do Prisma** (`prisma/schema.prisma`):
   - Modelo `Client` (dados básicos, status, tipo: cliente/lead, etc.).
   - Modelo `Lead` (etapa, origem, relacionamento com `Client`).
   - Modelo `Negotiation` (valor, status, cliente/lead associado, datas).
   - Modelo `Interaction` (tipo, data, descrição, vínculos com cliente/lead/negociação).
3. **Configurar banco PostgreSQL**:
   - Criar instância em cloud.
   - Definir `DATABASE_URL` para **desenvolvimento** e **produção**.
4. **Executar migrations** e criar um script de `seed` com dados iniciais.

### 2.2. Criar APIs REST com Route Handlers

Criar endpoints em `src/app/api` para operações de CRUD:

- `/api/clients`: listar, criar, atualizar, remover clientes.
- `/api/leads`: listar, criar, atualizar status (incluindo movimentação no Kanban), remover.
- `/api/negotiations`: listar, criar, atualizar status (ativa, ganha, perdida), remover.
- `/api/interactions`: registrar e listar interações associadas a clientes/leads/negociações.

Esses endpoints devem substituir gradualmente os dados mockados de `src/lib/data.ts`.

---

## 3. Três Fluxos de Negócio Completos

Proposta de três fluxos de negócio "fim a fim", com persistência real:

### Fluxo 1 – Gestão de Clientes

- Cadastrar novo cliente.
- Editar dados de cliente existente.
- Inativar/remover cliente.
- Refletir alterações no dashboard (contagem de clientes, clientes ganhos, etc.).

### Fluxo 2 – Gestão de Leads (Kanban)

- Criar novo lead (associar a um cliente ou prospect).
- Mover lead entre colunas de status no Kanban, salvando o novo status no banco.
- Converter lead em cliente e/ou iniciar uma negociação a partir do lead.

### Fluxo 3 – Gestão de Negociações

- Criar negociação vinculada a um cliente ou lead.
- Atualizar status (ativa, ganha, perdida) e campos principais (valor, prazo, etc.).
- Registrar interações (reuniões, ligações, e-mails) ligadas à negociação.
- Exibir negociações recentes e negociações ativas no dashboard.

Cada fluxo deve incluir:

- Interface de cadastro/edição/visualização.
- Validações de entrada.
- Persistência real no PostgreSQL via Prisma.

---

## 4. Aderência ao RFC

### 4.1. Atualizar `docs/tccmau.md`

- Descrever a stack real usada:
  - Next.js + Route Handlers como camada de backend.
  - PostgreSQL + Prisma como camada de dados.
- Deixar clara a arquitetura cliente-servidor e as camadas da aplicação.
- Atualizar a seção de **Modelos C4**:
  - **Contexto**: administrador do evento usando o CRM, interação com serviços de e-mail/monitoramento (se houver).
  - **Contêineres**: frontend Next.js, API interna (Route Handlers), PostgreSQL, ferramenta de monitoramento.
  - **Componentes**: módulos de clientes, leads, negociações, interações e dashboard.

### 4.2. Diagrama C4 atualizado

- Incluir ao menos:
  - Diagrama de **Contexto** e **Contêineres** no TCC.
  - Descrição em texto ou imagem em `docs/arquitetura.md`.

---

## 5. Qualidade: Testes, TDD, CI/CD, Análise Estática

### 5.1. Testes e TDD

Objetivo: atingir no mínimo **75% de cobertura no backend** e **25% no frontend**, com prática de TDD documentada.

Sugestão de stack:

- **Backend**: Vitest ou Jest + `supertest` (para testar Route Handlers).
- **Frontend**: React Testing Library para componentes.

Tarefas:

1. Definir estrutura de testes (`tests/` ou `src/__tests__/`).
2. Criar testes unitários para:
   - Serviços de domínio (regras de negócio de leads, negociações, status, etc.).
   - Endpoints da API (sucesso, erro, validação).
3. Criar testes de componentes principais:
   - `ClientList`, `KanbanBoard`, `NegotiationList`, dashboard.
4. Escolher um fluxo (ex.: criação de lead) para **demonstrar TDD**:
   - Escrever o teste primeiro.
   - Implementar a funcionalidade.
   - Documentar no TCC a sequência.

### 5.2. CI/CD (GitHub Actions)

1. Criar workflow em `.github/workflows/ci.yml` com etapas de:
   - Instalação de dependências.
   - `npm run lint`.
   - `npm run test`.
   - `npm run build`.
2. Configurar variáveis de ambiente necessárias para rodar testes (banco de testes, etc.).
3. (Opcional) Criar workflow de **deploy automático** para o ambiente de produção (dependente da plataforma escolhida).

### 5.3. Análise Estática de Código (SonarCloud)

1. Criar conta no **SonarCloud** e conectar o repositório GitHub.
2. Adicionar arquivo `sonar-project.properties` com as configurações do projeto.
3. Ajustar o workflow do GitHub Actions para rodar análise do SonarCloud em cada push/PR.
4. Monitorar métricas de:
   - Bugs.
   - Vulnerabilities.
   - Code Smells.
   - Duplicações.
   - Cobertura de testes.
5. Incluir no TCC prints ou referências dos relatórios do SonarCloud.

---

## 6. Monitoramento e Observabilidade

Atender ao requisito de **uso de ferramenta de monitoramento/observabilidade** para acompanhar a aplicação em produção.

### 6.1. Escolha da Ferramenta

Opções sugeridas:

- **Datadog** (APM + logs + métricas).
- **New Relic** (APM completo para Node.js).
- **Stack Prometheus + Grafana** (mais infra, com endpoint `/metrics`).

### 6.2. Integração (exemplo com Datadog ou New Relic)

1. Criar conta na ferramenta escolhida (plano free).
2. Instalar e configurar o agente/SDK Node.js na aplicação Next:
   - Arquivo de inicialização (ex.: `instrumentation.ts` ou equivalente) para habilitar o tracer/APM.
   - Variáveis de ambiente (`DD_API_KEY`, `DD_ENV`, `DD_SERVICE`, ou equivalentes na ferramenta escolhida).
3. Definir quais métricas acompanhar:
   - Latência média e percentis das rotas de API.
   - Taxa de erro (status 5xx/4xx).
   - Throughput (requisições/minuto).
   - Logs de eventos de negócio importantes (lead criado, negociação ganha/perdida, etc.).
4. Criar ao menos um **dashboard** na ferramenta escolhida exibindo essas métricas.

### 6.3. Documentação de Monitoramento

- Descrever no TCC:
  - Qual ferramenta foi escolhida e por quê.
  - Como a instrumentação foi feita no código.
  - Quais métricas e painéis foram criados.
  - Exemplos de situações em que o monitoramento ajuda (ex.: detectar lentidão em determinada rota).

---

## 7. Documentação de Deploy

Criar `docs/deploy.md` com:

- Plataforma de hospedagem utilizada (cloud provider, tipo de serviço).
- Como provisionar o banco PostgreSQL (passos ou referência para IaC, se houver).
- Variáveis de ambiente necessárias (`DATABASE_URL`, chaves de autenticação, chaves do monitoramento, etc.).
- Comandos para build e start em produção (`npm run build`, `npm run start`).
- Passos do pipeline de deploy (se integrado ao GitHub Actions ou outro CI/CD).

---

## 8. Checklist Rápido para Portfólio Web Apps

- [ ] Sistema hospedado publicamente (frontend + backend) em ambiente sob seu controle.
- [ ] Funcionalidades completas e reais conforme RFC (clientes, leads, negociações, interações, dashboard).
- [ ] Arquitetura cliente-servidor documentada (C4, camadas e responsabilidades).
- [ ] Repositório com histórico de commits e pipeline CI/CD configurado.
- [ ] Testes unitários com TDD (75% backend, 25% frontend) e cobertura medida.
- [ ] Ferramenta de análise estática de código e segurança (SonarCloud/SonarQube) em uso.
- [ ] Ferramenta de monitoramento/observabilidade configurada e ativa.
- [ ] Pelo menos três fluxos de negócio completos implementados e descritos no TCC.
