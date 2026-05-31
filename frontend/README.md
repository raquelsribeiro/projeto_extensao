# Frontend - Sistema de Chamados VT Innovation

Interface Next.js 14 com TypeScript, Mantine UI e Tabler Icons para gerenciar chamados.

## 🚀 Início Rápido

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local se necessário (padrão funciona localmente)

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em **http://localhost:3000**

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Lint do código

## 🎨 Páginas

- `/` - Dashboard com resumo e lista de chamados
- `/novo` - Formulário para criar novo chamado
- `/chamados/[id]` - Detalhes do chamado com histórico

## 📁 Estrutura

```
src/
├── app/
│   ├── layout.tsx           # Layout raiz
│   ├── globals.css          # Estilos globais
│   ├── page.tsx             # Dashboard
│   ├── novo/
│   │   └── page.tsx         # Novo chamado
│   └── chamados/
│       └── [id]/
│           └── page.tsx     # Detalhe do chamado
├── components/              # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── StatusBadge.tsx
│   ├── PriorityBadge.tsx
│   ├── TicketCard.tsx
│   └── TicketForm.tsx
└── lib/
    └── api.ts              # Funções de requisição
```

## 🔧 Configuração

Variáveis de ambiente (`.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎨 Design

- **Biblioteca UI**: Mantine UI
- **Ícones**: Tabler Icons
- **Cores primárias**: Azul escuro (#1e3a5f)
- **Responsivo**: Mobile-first design
- **Componentes**: Cards, formulários, modais, badges e timeline com Mantine

## 📦 Dependências Principais

- `next` 14 - Framework React/SSR
- `react` 18 - Biblioteca UI
- `@mantine/core` - Componentes de interface
- `@mantine/hooks` - Hooks utilitários
- `@tabler/icons-react` - Ícones
- `typescript` - Type safety

## ⚠️ Notas

- Requere Node.js 18+
- Depende do backend rodando em http://localhost:3001
- Não commit `.env.local`
