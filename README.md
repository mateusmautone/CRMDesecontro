🎯 CRM Desencontro – Sistema de Gestão de Relacionamento para o evento Desencontro

Projeto de TCC para gestão de leads, clientes, parceiros e interações referentes ao evento “Desencontro”.

✅ Status do Projeto

Backend: implementado com Node.js + Express + ORM (Prisma) + PostgreSQL

Frontend: implementado com React + Vite + TailwindCSS

Banco de Dados: estrutura com entidades relacionadas (clientes, leads, interações, negociações)

Deploy: versão da aplicação hospedada — frontend público no Cloud Run / link: https://crm-frontend-7rhknnd52q-uc.a.run.app/

Funcionalidades principais disponíveis: CRUD de clientes/leads, registro de interações, controle de negociações, dashboard analítico, interface responsiva.

🧰 Tecnologias Utilizadas

Backend

Node.js

Express.js

Prisma ORM

PostgreSQL

Frontend

React (via Vite)

TailwindCSS

React Router (para roteamento)

Axios (requisições HTTP)

Bibliotecas adicionais conforme necessidade (se houver)

Infraestrutura / Deploy

Hospedagem no Cloud Run (ou serviço de nuvem compatível)

Banco de dados PostgreSQL (local ou via serviço gerenciado)

Git + GitHub (controle de versão)

🎯 Funcionalidades Principais

Gestão de Clientes/Leads — cadastro, edição, visualização e remoção; listagem de leads/clientes.

Registro de Interações — histórico de conversas, reuniões, e-mails, visitas etc; registro de data, tipo e observações.

Negociações / Parcerias — controle de status de negociações ou parcerias com clientes/leads; visualização de histórico.

Dashboard e Visão Analítica — visão consolidada de leads, interações e negociações; métricas gerais (ex: número de leads, status, interações etc).

Interface Responsiva — layout que se adapta a diferentes tamanhos de tela, facilitando uso em desktops, tablets e mobile.

📂 Estrutura do Projeto
/backend      → Código do servidor (Express + Prisma + rotas de API)  
/frontend     → Código da interface (React + Vite + TailwindCSS)  
/database    → Scripts / migrations (se houver) para configurar PostgreSQL  
README.md     → Documentação do projeto  
.env.example  → Exemplo de variáveis de ambiente (backend e frontend)  


Nota: dependências listadas no package.json / package-lock.json (frontend e backend), garantindo fácil setup.

🚀 Como Executar Localmente
Pré-requisitos

Node.js (versão 18+ recomendada)

PostgreSQL (versão 12+ ou usar container via Docker)

Git

Passos
# Clone o repositório
git clone https://github.com/mateusmautone/CRMDesecontro.git  
cd CRMDesecontro  

# Backend
cd backend  
npm install  
# configurar variáveis de ambiente (.env) com dados do banco  
npx prisma migrate dev   # para criar banco + tabelas  
npm run dev              # inicia servidor backend (ex: localhost:3001)  

# Frontend
cd ../frontend  
npm install  
npm run dev              # inicia servidor frontend (ex: localhost:5173)  


Depois, abra no navegador a URL onde o frontend está rodando. A interface deve se comunicar com a API do backend automaticamente.

📄 Modelo de Dados (Entidades Principais)

User — representando administradores ou usuários do sistema (se existir login/autenticação)

Client / Lead — clientes, expositores ou prospects relacionados ao evento Desencontro

Interaction — registro de interações com leads/clients (reuniões, ligações, e-mails, visitas etc)

Negotiation / Partnership — negociações ou parcerias em andamento, com status configurável e histórico de mudanças

A estrutura exata de tabelas e campos pode ser vista no schema do Prisma

💡 Motivo / Objetivo do Projeto

O CRM Desencontro surge da necessidade de organizar de forma centralizada e estruturada os contatos, negociações e histórico de conversas com expositores, patrocinadores e parceiros do evento Desencontro.
Com isso, o sistema ajuda a manter o controle do pipeline de parcerias, histórico de interações e dados relevantes para execução e planejamento dos próximos eventos.

📝 Sobre este Repositório

Autor: Mateus Moraes Mautone

Contexto: Trabalho de Conclusão de Curso — Engenharia de Software

Repositório público: https://github.com/mateusmautone/CRMDesecontro
