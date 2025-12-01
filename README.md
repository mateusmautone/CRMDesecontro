# CRM Desencontro – Sistema de Gestão de Relacionamento

**Autor:** Mateus Moraes Mautone  
**Curso:** Engenharia de Software  
**Instituição:** Centro Universitário Católica de Santa Catarina – Joinville  
**Ano:** 2025

---

## 🎯 Resumo

O **CRM Desencontro** é uma aplicação web desenvolvida para gerenciar **clientes, leads, conversas e negociações** relacionadas ao evento “**Desencontro**”, promovido em Joinville.

O sistema foi criado com o objetivo de **centralizar e organizar informações de parceiros e patrocinadores**, reduzindo processos manuais e aumentando a eficiência da equipe de produção e comunicação do evento.

A aplicação foi construída utilizando **React.js**, **Node.js**, **Express**, **PostgreSQL** e **Prisma ORM**, integrando automação, escalabilidade e relatórios em tempo real.

---

## 📌 Contexto e Justificativa

O evento **Desencontro** reúne empreendedores, brechós e marcas independentes da região de Joinville e necessita de uma ferramenta que facilite o relacionamento com patrocinadores, expositores e leads comerciais.

O sistema surge da necessidade de substituir **planilhas dispersas e registros manuais** por uma solução centralizada e eficiente, garantindo maior controle sobre o pipeline de parcerias e a comunicação com o público.

### 🎯 Objetivos

- **Principal:** Desenvolver um sistema CRM que organize e automatize a gestão de relacionamentos entre o evento e seus parceiros.
- **Secundários:**
  - Oferecer uma interface intuitiva e responsiva;
  - Armazenar informações com segurança e consistência;
  - Gerar relatórios e métricas sobre leads e negociações;
  - Acompanhar o histórico de interações de cada cliente ou parceiro;
  - Enviar notificações sobre datas e prazos importantes do evento.

---

## 👥 Casos de Uso

### Atores

- **Administrador:** possui acesso total a cadastros, interações, negociações e dashboards.

### Funcionalidades Principais

- Cadastrar, editar e excluir **clientes e leads**;
- Registrar **interações** (mensagens, reuniões, atualizações);
- Visualizar **histórico completo** de comunicações;
- Gerenciar **negociações** com status de andamento;
- Exibir **dashboard com métricas e indicadores**.

---

## 🧠 Problemas Resolvidos

- Falta de centralização dos dados de leads e patrocinadores;
- Dificuldade de acompanhamento das comunicações e status de negociações;
- Ausência de relatórios consolidados de desempenho e engajamento;
- Perda de oportunidades por falta de acompanhamento automatizado.

---

## ⚙️ Requisitos de Software

### Funcionais

1. **Cadastro e gerenciamento de clientes e leads** com status de negociação.  
2. **Registro de conversas e interações** entre equipe e parceiros.  
3. **Visualização do histórico completo** de comunicações por cliente.  
4. **Gerenciamento de negociações e parcerias** (pipeline).  
5. **Dashboard** com indicadores gerais do sistema.  
6. **Busca e filtros avançados** de leads por status, tipo e data.  
7. **Criação de etiquetas personalizadas** por cliente.  
8. **Geração de relatórios por período**.  
9. **Autenticação de usuários** com diferentes níveis de permissão.  
10. **Notificações** sobre prazos e atualizações de negociações.

### Não-Funcionais

1. O sistema deve carregar cada página em até **2 segundos**.  
2. A interface deve ser **compatível com navegadores modernos**.  
3. Deve suportar **até 100 usuários simultâneos**.  
4. O design deve ser **responsivo** para dispositivos móveis.  
5. O sistema deve realizar **backup automático diário**.  
6. As **senhas devem ser criptografadas** com bcrypt.  
7. O sistema deve garantir **segurança contra injeções SQL e XSS**.  
8. Toda comunicação deve ocorrer sobre **HTTPS** em produção.  
9. O código deve seguir arquitetura **MVC** e boas práticas de versionamento.  
10. O banco de dados deve armazenar logs de **auditoria e falhas**.

---

## 🧩 Stack Tecnológica

**Frontend**
- React.js (Vite)
- TailwindCSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

**Infraestrutura**
- Cloud SQL (PostgreSQL)
- Deploy via Google Cloud Run
- Versionamento com GitHub

---

## 🗂 Estrutura do Projeto

