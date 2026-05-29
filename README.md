# 🎫 Sistema Interno de Chamados - VT Innovation

Sistema centralizado para gerenciar demandas internas da equipe de tecnologia da VT Innovation. Permite criar, acompanhar e resolver tickets de bugs, suportes, melhorias, acessos e incidentes, com integração automática ao Slack.

## 📋 Tabela de Conteúdos

- [Descrição](#descrição)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Configuração do Slack](#configuração-do-slack)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)

## 📝 Descrição

Este é um sistema full-stack desenvolvido para a **VT Innovation** que centraliza todas as demandas internas da equipe de tecnologia. Com ele, é possível:

- ✅ Criar novos chamados com título, tipo, descrição, urgência e responsável
- ✅ Filtrar chamados por status, tipo e urgência
- ✅ Acompanhar o histórico completo de cada chamado
- ✅ Atualizar status com observações
- ✅ Receber notificações automáticas no Slack
- ✅ Visualizar resumos em dashboard intuitivo

## 🛠️ Pré-requisitos

- **Node.js 18+** (verifique com `node --version`)
- **npm** (incluído no Node.js)
- **Conta Slack** com permissão para criar Webhooks (opcional, para notificações)

## 🚀 Instalação e Execução

### 1. Backend

```bash
# Acesse a pasta backend
cd backend

# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Configure o arquivo .env com seus dados (Slack Webhook, porta, etc)
# Abra backend/.env e preencha as variáveis conforme necessário

# Crie e popule o banco de dados com usuários de teste
npm run seed

# Inicie o servidor de desenvolvimento
npm run dev

# Ou para produção:
npm start
```

O servidor estará disponível em **http://localhost:3001** (ou a porta configurada em .env)

### 2. Frontend

```bash
# Em outro terminal, acesse a pasta frontend
cd frontend

# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.local.example .env.local

# Configure o URL da API em .env.local se necessário
# (padrão: http://localhost:3001)

# Inicie o servidor de desenvolvimento
npm run dev

# Ou para build e produção:
npm run build
npm start
```

O frontend estará disponível em **http://localhost:3000**

## 🔧 Configuração do Slack

### Como obter o Webhook URL:

1. Acesse sua workspace no Slack: https://api.slack.com/apps
2. Clique em **"Create New App"** → **"From scratch"**
3. Nomeie a app (ex: "VT Innovation Chamados")
4. Selecione sua workspace
5. Vá para **Incoming Webhooks** no menu esquerdo
6. Ative **Incoming Webhooks**
7. Clique em **"Add New Webhook to Workspace"**
8. Selecione o canal onde quer receber notificações
9. Copie a URL do webhook (começa com `https://hooks.slack.com/...`)
10. Cole a URL em `backend/.env` na variável `SLACK_WEBHOOK_URL`

### Exemplo de .env configurado:

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 📡 Endpoints da API

Todos os endpoints estão prefixados com `/api`

### Criar Chamado

**POST** `/api/chamados`

Cria um novo chamado e envia notificação ao Slack.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Corrigir bug na autenticação",
  "tipo": "Bug",
  "descricao": "Usuários não conseguem fazer login com Google",
  "urgencia": "Alta",
  "responsavel_id": "fb33bc13e38bfc71bb1571a41d7fa077",
  "prazo_esperado": "2026-06-05"
}
```

**Response (201 Created):**
```json
{
  "id": "6f15d169-c25b-4a08-8287-27d48def6fd2",
  "titulo": "Corrigir bug na autenticação",
  "tipo": "Bug",
  "descricao": "Usuários não conseguem fazer login com Google",
  "urgencia": "Alta",
  "status": "Aberto",
  "responsavel_id": "fb33bc13e38bfc71bb1571a41d7fa077",
  "prazo_esperado": "2026-06-05",
  "created_at": "2026-05-29 19:59:37",
  "updated_at": "2026-05-29 19:59:37"
}
```

### Listar Chamados

**GET** `/api/chamados?status=Aberto&tipo=Bug&urgencia=Alta`

Lista todos os chamados com filtros opcionais.

**Query Parameters:**
- `status` (opcional): "Aberto", "Em Andamento" ou "Concluído"
- `tipo` (opcional): "Bug", "Suporte", "Melhoria", "Acesso" ou "Incidente"
- `urgencia` (opcional): "Baixa", "Média", "Alta" ou "Crítica"

**Response (200 OK):**
```json
[
  {
    "id": "6f15d169-c25b-4a08-8287-27d48def6fd2",
    "titulo": "Corrigir bug na autenticação",
    "tipo": "Bug",
    "descricao": "...",
    "urgencia": "Alta",
    "status": "Aberto",
    "responsavel_id": "fb33bc13e38bfc71bb1571a41d7fa077",
    "prazo_esperado": "2026-06-05",
    "created_at": "2026-05-29 19:59:37",
    "updated_at": "2026-05-29 19:59:37"
  }
]
```

### Obter Chamado com Histórico

**GET** `/api/chamados/:id`

Retorna os detalhes completos de um chamado incluindo informações do responsável e histórico.

**Response (200 OK):**
```json
{
  "id": "6f15d169-c25b-4a08-8287-27d48def6fd2",
  "titulo": "Corrigir bug na autenticação",
  "tipo": "Bug",
  "descricao": "...",
  "urgencia": "Alta",
  "status": "Em Andamento",
  "responsavel_id": "fb33bc13e38bfc71bb1571a41d7fa077",
  "responsavel_nome": "Vitor Silva",
  "responsavel_email": "vitor@vtinnovation.com.br",
  "responsavel_setor": "Tech Lead",
  "prazo_esperado": "2026-06-05",
  "created_at": "2026-05-29 19:59:37",
  "updated_at": "2026-05-29 20:00:17",
  "historico": [
    {
      "id": "24861dc7-d0a8-4660-9f09-b20122d39fed",
      "chamado_id": "6f15d169-c25b-4a08-8287-27d48def6fd2",
      "status_anterior": "Aberto",
      "status_novo": "Em Andamento",
      "observacao": "Iniciado o trabalho no chamado",
      "created_at": "2026-05-29 20:00:17"
    }
  ]
}
```

### Atualizar Status do Chamado

**PATCH** `/api/chamados/:id`

Atualiza o status de um chamado e registra o histórico.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "status_novo": "Em Andamento",
  "observacao": "Iniciado o trabalho no chamado"
}
```

**Response (200 OK):**
```json
{
  "id": "6f15d169-c25b-4a08-8287-27d48def6fd2",
  "status": "Em Andamento",
  "updated_at": "2026-05-29 20:00:17",
  "historico_registrado": {
    "id": "24861dc7-d0a8-4660-9f09-b20122d39fed",
    "status_anterior": "Aberto",
    "status_novo": "Em Andamento",
    "observacao": "Iniciado o trabalho no chamado",
    "created_at": "2026-05-29 20:00:17"
  }
}
```

### Listar Usuários

**GET** `/api/usuarios`

Lista todos os usuários disponíveis para atribuição de chamados.

**Response (200 OK):**
```json
[
  {
    "id": "fb33bc13e38bfc71bb1571a41d7fa077",
    "nome": "Vitor Silva",
    "email": "vitor@vtinnovation.com.br",
    "setor": "Tech Lead",
    "created_at": "2026-05-29 18:41:25"
  },
  {
    "id": "0add1dcdc03c3af5e8a6e0dd872a0b93",
    "nome": "Ana Costa",
    "email": "ana@vtinnovation.com.br",
    "setor": "Frontend",
    "created_at": "2026-05-29 18:41:25"
  },
  {
    "id": "f5c738e9e447bdeed83d09efd30269bc",
    "nome": "Bruno Lima",
    "email": "bruno@vtinnovation.com.br",
    "setor": "Backend",
    "created_at": "2026-05-29 18:41:25"
  },
  {
    "id": "d85a2222bcfd570e05a5b942d32a29e1",
    "nome": "Carla Souza",
    "email": "carla@vtinnovation.com.br",
    "setor": "Design",
    "created_at": "2026-05-29 18:41:25"
  }
]
```

## 📁 Estrutura do Projeto

```
vt-innovation-sistema-chamados/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Configuração do Express
│   │   ├── controllers/
│   │   │   └── chamadosController.js  # Lógica dos endpoints
│   │   ├── database/
│   │   │   ├── db.js              # Inicialização SQLite
│   │   │   └── seed.js            # Dados de teste
│   │   ├── routes/
│   │   │   └── chamadosRoutes.js  # Definição das rotas
│   │   └── services/
│   │       └── slackService.js    # Integração com Slack
│   ├── package.json
│   ├── .env.example
│   ├── .env (não commitar)
│   ├── .gitignore
│   └── database.sqlite (criado automaticamente)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Layout raiz
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── novo/
│   │   │   │   └── page.tsx       # Formulário novo chamado
│   │   │   ├── chamados/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Detalhes do chamado
│   │   │   └── globals.css        # Estilos globais Tailwind
│   │   ├── components/
│   │   │   ├── Header.tsx         # Cabeçalho
│   │   │   ├── StatusBadge.tsx    # Badge de status
│   │   │   ├── UrgenciaBadge.tsx  # Badge de urgência
│   │   │   ├── ChamadoCard.tsx    # Card do chamado
│   │   │   └── ChamadoForm.tsx    # Formulário
│   │   └── lib/
│   │       └── api.ts            # Funções de API
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .env.local.example
│   ├── .env.local (não commitar)
│   └── .gitignore
│
└── README.md (este arquivo)
```

## 🗄️ Banco de Dados

O sistema utiliza **SQLite com better-sqlite3** para armazenamento. O arquivo `database.sqlite` é criado automaticamente na raiz do backend ao rodar o seed.

**Tabelas:**

- **usuarios**: Usuários da equipe
- **chamados**: Registros de chamados
- **historico_chamados**: Histórico de atualizações de status

**IMPORTANTE:** O arquivo `database.sqlite` não deve ser commitado no Git. Está configurado em `.gitignore`.

## 🎨 Design e UX

- **Paleta de cores**: Azul escuro (#1e3a5f) como cor primária, neutros em cinza
- **Responsivo**: Interface adaptada para desktop e mobile
- **Sem bibliotecas externas**: Componentes construídos com Tailwind CSS puro
- **Badges intuitivas**:
  - Status: Azul (Aberto), Amarelo (Em Andamento), Verde (Concluído)
  - Urgência: Vermelha (Crítica), Laranja (Alta), Amarela (Média), Verde (Baixa)

## 🔐 Segurança

- Validação de campos obrigatórios no backend e frontend
- Prepared statements em todas as queries SQL (prevenção de SQL injection)
- CORS habilitado para requisições entre frontend e backend
- Variáveis sensíveis em `.env` (não commitadas)

## 📦 Dependências

### Backend
- `express` - Framework web
- `better-sqlite3` - Banco de dados SQLite
- `cors` - Cross-origin resource sharing
- `dotenv` - Gerenciamento de variáveis de ambiente
- `axios` - HTTP client para Slack

### Frontend
- `next` - Framework React
- `react` - Biblioteca UI
- `tailwindcss` - Utilitários CSS
- `typescript` - Type safety

## 🤝 Contribuição

Para adicionar novos recursos:

1. Crie uma branch para sua feature
2. Desenvolva seguindo a estrutura existente
3. Teste no backend e frontend
4. Faça um commit com mensagem descritiva

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique se Node.js 18+ está instalado
- Confirme que as portas 3000 (frontend) e 3001 (backend) estão livres
- Verifique o arquivo `.env` está preenchido corretamente
- Check the logs for error messages

---

**Desenvolvido para VT Innovation** ✨
