# Capa

- **Título do Projeto**: Sistema CRM Desencontro para Gestão de Relacionamento
- **Nome do Estudante**: Mateus Moraes Mautone
- **Curso**: Engenharia de Software
- **Data de Entrega**: 10 de Junho de 2025

# Resumo

Este documento apresenta o Request for Comments (RFC) para o desenvolvimento do sistema CRM Desencontro, uma aplicação web projetada por Mateus Moraes Mautone para gerenciar clientes, leads, conversas e negociações relacionadas ao evento "Desencontro". O sistema otimiza o relacionamento com parceiros e patrocinadores, oferecendo funcionalidades como cadastro de clientes, registro de interações e um dashboard de visualização. Utilizando React.js, Node.js, Express.js, PostgreSQL e Prisma ORM, o projeto detalha requisitos, design, stack tecnológica, segurança e cronograma neste RFC.

## 1. Introdução

- **Contexto**: O evento "Desencontro" necessita de uma solução para organizar interações com clientes, leads e patrocinadores, enfrentando desafios com processos manuais. O CRM Desencontro foi desenvolvido para centralizar essas informações e melhorar a eficiência.
- **Justificativa**: A implementação de um CRM é relevante para a Engenharia de Software, pois promove automação, escalabilidade e análise de dados, atendendo às demandas de gestão de eventos.
- **Objetivos**:
  - **Principal**: Desenvolver um sistema CRM para gerenciar relacionamentos no evento Desencontro.
  - **Secundários**:
    - Garantir uma interface intuitiva com React.js.
    - Assegurar armazenamento seguro com PostgreSQL.
    - Facilitar relatórios via dashboard.

## 2. Descrição do Projeto

- **Tema do Projeto**: O CRM Desencontro é um sistema web para gerenciar clientes, leads, conversas e negociações, focado no evento "Desencontro", com um dashboard para visualização.
- **Problemas a Resolver**:
  - Falta de centralização de dados de clientes e leads.
  - Processos manuais demorados para registro de interações.
  - Dificuldade em acompanhar negociações e parcerias.
- **Limitações**:
  - O sistema não gerenciará aspectos financeiros ou logísticos do evento.
  - Não incluirá integração com sistemas externos na fase inicial.

## 3. Especificação Técnica

### 3.1. Requisitos de Software

- **Lista de Requisitos**:
  - **Funcionais (RF)**:
    - RF01: O sistema deve permitir cadastro e gerenciamento de clientes e leads.
    - RF02: O sistema deve registrar conversas e interações com detalhes.
    - RF03: O sistema deve controlar negociações e parcerias.
    - RF04: O sistema deve exibir um dashboard com informações rápidas.
  - **Não-Funcionais (RNF)**:
    - RNF01: O sistema deve carregar páginas em menos de 2 segundos.
    - RNF02: O sistema deve ser compatível com navegadores modernos.
    - RNF03: O sistema deve suportar até 100 usuários simultâneos.
- **Representação dos Requisitos**: Um Diagrama de Casos de Uso UML será incluído no apêndice, com atores (ex.: Administrador) e casos (ex.: Cadastrar Cliente, Visualizar Dashboard).

### 3.2. Considerações de Design

- **Visão Inicial da Arquitetura**: O sistema adota uma arquitetura cliente-servidor, com frontend em React.js (Vite) e backend em Node.js com Express.js. O PostgreSQL, gerenciado por Prisma ORM, armazena os dados.
- **Padrões de Arquitetura**: Uso do padrão MVC no backend e componentes reutilizáveis no frontend com React.
- **Modelos C4**:
  - **Contexto**: O sistema atende administradores do evento, interagindo com clientes e patrocinadores.
  - **Contêineres**: Frontend (React/Vite), Backend (Node.js/Express), Banco de Dados (PostgreSQL).
  - **Componentes**: Módulos de cadastro, registro de interações, controle de negociações, dashboard.
  - **Código**: APIs RESTful para CRUD, componentes React para interface.

### 3.3. Stack Tecnológica

- **Linguagens de Programação**: JavaScript (ES6+) para frontend e backend.
- **Frameworks e Bibliotecas**: React.js (Vite), TailwindCSS, Express.js, Prisma ORM.
- **Ferramentas de Desenvolvimento e Gestão de Projeto**: Git, GitHub, VS Code (presumido).

### 3.4. Considerações de Segurança

- **Autenticação**: Uso de sessões ou tokens (a definir) para controle de acesso.
- **Proteção de Dados**: Criptografia de dados sensíveis no PostgreSQL.
- **Prevenção de Ataques**: Validações contra SQL Injection via Prisma.

## 4. Próximos Passos

- **Junho 2025**: Finalização do protótipo com cadastro e dashboard (15/06/2025).
- **Julho 2025**: Implementação de negociações e interações (31/07/2025).
- **Setembro 2025**: Entrega do Portfólio I (15/09/2025).
- **Novembro 2025**: Ajustes finais e Portfólio II (30/11/2025).

## 5. Referências

- Documentação do React.js
- Documentação do Express.js
- Documentação do Prisma ORM
- Documentação do PostgreSQL

## 6. Apêndices (Opcionais)

- Com o crescimento do evento, novos fluxos deverão ser construídos, bem como áreas contábeis entre outras.

## 7. Avaliações de Professores

- Considerações Professor/a:
- Considerações Professor/a:
- Considerações Professor/a:
