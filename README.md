# 🎯 CRM Desencontro – Sistema de Gestão de Relacionamento com Clientes e Parceiros  

Sistema web desenvolvido por **Mateus Moraes Mautone** para gerenciar **clientes, leads, conversas e negociações** relacionadas ao evento **Desencontro**, centralizando dados e otimizando o relacionamento com **patrocinadores, expositores e parceiros**.  

---

## 🚀 Status do Projeto
✅ Backend: 100% implementado (Node.js + Express + Prisma ORM + PostgreSQL)  
✅ Frontend: 100% implementado (React + Vite + TailwindCSS)  
✅ Banco de Dados: Estrutura completa com entidades relacionadas (clientes, leads, interações, parcerias)  
✅ API REST: CRUD completo via Express  
✅ Interface: Dashboard e telas responsivas  
✅ Autenticação: Em desenvolvimento (baseada em tokens de sessão ou JWT)  
✅ Deploy: Versão hospedada no Google Cloud Run  

🔗 **Acesse o Sistema:** [crm-frontend-7rhknnd52q-uc.a.run.app](https://crm-frontend-7rhknnd52q-uc.a.run.app)  

---

## 🎯 Funcionalidades Implementadas

### 👥 Gestão de Clientes e Leads
- Cadastro, edição e exclusão de clientes  
- Visualização detalhada de cada lead  
- Filtros por status e tipo de parceiro  

### 💬 Registro de Conversas e Interações
- Histórico de conversas com cada cliente  
- Registro de reuniões, ligações e e-mails  
- Visualização cronológica das interações  

### 🤝 Controle de Negociações e Parcerias
- Cadastro de novas negociações  
- Controle de status (em andamento, fechado, cancelado)  
- Histórico de movimentações de cada lead  

### 📊 Dashboard Analítico
- Visualização geral dos leads e interações  
- Gráficos interativos e estatísticas rápidas  
- Painel consolidado com métricas do evento  

---

## 🧠 Arquitetura do Sistema
O sistema segue o padrão **cliente-servidor**, com arquitetura **MVC no backend** e **componentização no frontend**.

~~~mermaid
graph LR
A[Usuário (Administrador do Evento)] --> B[Frontend React/Vite]
B --> C[API REST - Node.js/Express]
C --> D[(PostgreSQL via Prisma ORM)]
~~~

**Modelos C4**  
- **Contexto:** CRM voltado ao evento Desencontro, atendendo administradores e parceiros.  
- **Contêineres:** Frontend (React/Vite), Backend (Node.js/Express), Banco (PostgreSQL).  
- **Componentes:** Módulos de cadastro, interações, negociações e dashboard.  

---

## 🛠️ Stack Tecnológica

### Backend
- **Linguagem:** JavaScript (Node.js)  
- **Framework:** Express.js  
- **ORM:** Prisma ORM  
- **Banco de Dados:** PostgreSQL  
- **Arquitetura:** MVC  
- **Segurança:** Validação contra SQL Injection, criptografia de dados sensíveis  

### Frontend
- **Framework:** React.js (Vite)  
- **Estilização:** TailwindCSS  
- **Roteamento:** React Router DOM  
- **Requisições:** Axios  
- **Gráficos:** Recharts  
- **Gerenciamento de Estado:** React Hooks / Context API  

### Infraestrutura
- **Deploy:** Google Cloud Run (Frontend e Backend)  
- **Banco:** Cloud SQL (PostgreSQL)  
- **Controle de versão:** Git + GitHub  

---

## ⚙️ Requisitos de Software

**Funcionais (RF):**
- RF01: Cadastro e gerenciamento de clientes/leads  
- RF02: Registro de conversas/interações  
- RF03: Controle de negociações/parcerias  
- RF04: Exibição de dashboard com informações rápidas  

**Não Funcionais (RNF):**
- RNF01: Carregamento de páginas < 2 segundos  
- RNF02: Compatibilidade com navegadores modernos  
- RNF03: Suporte para até 100 usuários simultâneos  

---

## 🎨 Interface do Usuário

**Páginas Principais**
- Login (em desenvolvimento)  
- Dashboard com métricas gerais  
- Tabela de Clientes e Leads  
- Histórico de Interações  
- Módulo de Negociações  

**Componentes**
- Cards dinâmicos para leads  
- Modal de edição e exclusão  
- Gráficos analíticos  
- Layout responsivo e intuitivo  

---

## 🔐 Segurança
- Autenticação via token (JWT em desenvolvimento)  
- Criptografia de dados sensíveis no PostgreSQL  
- Proteção contra SQL Injection com Prisma  
- Validação de inputs no backend  

---

## ▶️ Como Executar Localmente

### 1. Pré-requisitos
- Node.js 18+  
- PostgreSQL 15+  
- npm ou yarn  
- Git  

### 2. Clone o Repositório
~~~bash
git clone https://github.com/mateusmautone/CRMDesecontro.git
cd CRMDesecontro
~~~

### 3. Backend
~~~bash
cd backend
npm install
npx prisma migrate dev
npm run dev
~~~
> Backend disponível em: [http://localhost:3001](http://localhost:3001)

### 4. Frontend
~~~bash
cd ../frontend
npm install
npm run dev
~~~
> Frontend disponível em: [http://localhost:5173](http://localhost:5173)

---

## 🗓️ Cronograma de Desenvolvimento

| Fase          | Entrega       | Descrição                                   |
|---------------|---------------|---------------------------------------------|
| Junho/2025    | 15/06/2025    | Protótipo com cadastro e dashboard          |
| Julho/2025    | 31/07/2025    | Implementação de negociações e interações   |
| Setembro/2025 | 15/09/2025    | Entrega do Portfólio I                      |
| Novembro/2025 | 30/11/2025    | Ajustes finais e Portfólio II               |

---

## 📚 Referências
- [React.js Documentation](https://react.dev)  
- [Express.js Documentation](https://expressjs.com)  
- [Prisma ORM Docs](https://www.prisma.io/docs)  
- [PostgreSQL Docs](https://www.postgresql.org/docs/)  

---

## 🧾 Sobre o Projeto
**CRM Desencontro** é um projeto desenvolvido como **Trabalho de Conclusão de Curso (TCC)** no curso de **Engenharia de Software** do **Centro Universitário Católica de Santa Catarina – Joinville**.  

**Autor:** Mateus Moraes Mautone  
**Orientador:** Diogo Winck 
**Ano:** 2025  

📍 *O sistema evolui junto com o evento Desencontro, podendo futuramente incluir áreas contábeis, relatórios financeiros e integrações externas.*
