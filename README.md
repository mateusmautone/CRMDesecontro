# 💼 CRM Desencontro – Sistema de Gestão de Relacionamento

**Autor:** Mateus Moraes Mautone  
**Curso:** Engenharia de Software – Centro Universitário Católica de Santa Catarina – Joinville  
**Projeto:** Request for Comments (RFC) – Sistema CRM Desencontro  
**Ano:** 2025

---

## 📖 Resumo

O **CRM Desencontro** é uma aplicação web desenvolvida para gerenciar clientes, leads, conversas e negociações relacionadas ao evento **“Desencontro”**, promovido em Joinville.  
Seu objetivo é otimizar o relacionamento com patrocinadores e parceiros, oferecendo funcionalidades como **cadastro de clientes**, **registro de interações** e um **dashboard visual** para acompanhamento das negociações.

A aplicação foi construída utilizando **React.js**, **Node.js**, **Express.js**, **PostgreSQL** e **Prisma ORM**, integrando automação, escalabilidade e análise de dados em um único sistema centralizado.

---

## 🧩 Contexto e Justificativa

O evento **Desencontro** enfrentava dificuldades na gestão manual de leads e parceiros.  
O sistema foi desenvolvido para **centralizar informações e automatizar processos**, aumentando a eficiência da equipe e a clareza nas comunicações com patrocinadores.

### 🎯 Objetivos
- **Principal:** Garantir o acompanhamento completo das interações entre organização e parceiros.  
- **Secundários:**
  - Interface intuitiva desenvolvida em React.js.  
  - Armazenamento seguro em PostgreSQL.  
  - Relatórios e dashboards para visualização rápida.  
  - Notificações automáticas sobre eventos e prazos.  
  - Histórico centralizado de comunicações.  

---

## 🧠 Casos de Uso

### 👤 Atores
**Administrador:** possui acesso completo aos módulos de cadastro, interações, negociações e dashboard.

### ⚙️ Funcionalidades Principais
- Cadastrar, editar e excluir clientes e leads.  
- Registrar conversas e interações.  
- Visualizar histórico de comunicações.  
- Gerenciar negociações e parcerias.  
- Consultar métricas no dashboard.  

*(ver diagramas de casos de uso no PDF, pág. 5)*:contentReference[oaicite:1]{index=1}

---

## 🧱 Descrição do Projeto

### Tema
Sistema web para gerenciar clientes, leads, conversas e negociações relacionadas ao evento **Desencontro**.

### Problemas Resolvidos
- Falta de centralização de dados de clientes e leads.  
- Lentidão nos processos de registro e acompanhamento.  
- Dificuldade no controle de negociações e parcerias.

### Limitações
- Não contempla gestão financeira ou logística.  
- Não possui integração com sistemas externos na versão inicial.

---

## ⚙️ Especificação Técnica

### 🧩 Requisitos Funcionais
1. Cadastro, edição e exclusão de clientes, leads e patrocinadores.  
2. Registro de interações (mensagens, reuniões, atualizações).  
3. Dashboard com estatísticas gerais.  
4. Pipeline de negociações com quadro Kanban dinâmico.  
5. Autenticação JWT com níveis de acesso.  
6. Filtros e buscas avançadas.  
7. Registro automático de data e hora das interações.  
8. Geração de relatórios exportáveis.  
9. Notificações automáticas
