# Backend - Sistema de Chamados VT Innovation

Servidor Node.js + Express com banco de dados SQLite para gerenciar chamados. As estruturas para Slack e Jira estão preparadas, mas dependem de autorização e credenciais da empresa.

## 🚀 Início Rápido

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Mantenha SLACK_WEBHOOK_URL vazio até autorização da empresa

# Crie o banco de dados com dados de teste
npm run seed

# Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará em **http://localhost:3001**

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor com reload automático
- `npm start` - Inicia servidor em modo produção
- `npm run seed` - Inicializa banco de dados e insere usuários, chamados e histórico de demonstração

## 📡 Endpoints Disponíveis

Veja o README raiz para documentação completa dos endpoints.

Resumo:
- `POST /api/tickets` - Criar chamado
- `GET /api/tickets` - Listar chamados com filtros
- `GET /api/tickets/:id` - Obter chamado com histórico
- `PATCH /api/tickets/:id` - Atualizar status
- `GET /api/users` - Listar usuários
- `GET /` - Health check

## 🗄️ Banco de Dados

SQLite local com 3 tabelas: `users`, `tickets`, `ticket_history`

Arquivo: `database.sqlite` (criado automaticamente)

## 🔧 Configuração

Variáveis de ambiente (`.env`):

```
SLACK_WEBHOOK_URL=
SLACK_ENABLED=false
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 📁 Estrutura

```
src/
├── app.js                # Entrada do servidor
├── controllers/ticketsController.js
├── routes/ticketsRoutes.js
├── services/slackService.js
├── services/jiraService.js
└── database/            # SQLite e seed
```

## ⚠️ Notas

- O arquivo `database.sqlite` é criado automaticamente
- Não commit `database.sqlite` nem `.env`
- Requere Node.js 18+
