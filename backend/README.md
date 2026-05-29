# Backend - Sistema de Chamados VT Innovation

Servidor Node.js + Express com banco de dados SQLite para gerenciar chamados e integração com Slack.

## 🚀 Início Rápido

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e preencha SLACK_WEBHOOK_URL (opcional)

# Crie o banco de dados com dados de teste
npm run seed

# Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará em **http://localhost:3001**

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor com reload automático
- `npm start` - Inicia servidor em modo produção
- `npm run seed` - Inicializa banco de dados e insere usuários de teste

## 📡 Endpoints Disponíveis

Veja o README raiz para documentação completa dos endpoints.

Resumo:
- `POST /api/chamados` - Criar chamado
- `GET /api/chamados` - Listar chamados (com filtros)
- `GET /api/chamados/:id` - Obter chamado com histórico
- `PATCH /api/chamados/:id` - Atualizar status
- `GET /api/usuarios` - Listar usuários
- `GET /` - Health check

## 🗄️ Banco de Dados

SQLite local com 3 tabelas: `usuarios`, `chamados`, `historico_chamados`

Arquivo: `database.sqlite` (criado automaticamente)

## 🔧 Configuração

Variáveis de ambiente (`.env`):

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/...  # Opcional
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 📁 Estrutura

```
src/
├── app.js                # Entrada do servidor
├── controllers/          # Lógica dos endpoints
├── routes/              # Definição de rotas
├── services/            # Serviços (Slack, etc)
└── database/            # SQLite e seed
```

## ⚠️ Notas

- O arquivo `database.sqlite` é criado automaticamente
- Não commit `database.sqlite` nem `.env`
- Requere Node.js 18+
