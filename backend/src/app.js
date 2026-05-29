// backend/src/app.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chamadosRoutes from './routes/chamadosRoutes.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', chamadosRoutes);

// Rota raiz para verificar se o servidor está ativo
app.get('/', (req, res) => {
  res.json({ mensagem: 'Sistema de Chamados VT Innovation - Backend ativo' });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📧 Slack Webhook: ${process.env.SLACK_WEBHOOK_URL ? 'Configurado' : 'Não configurado'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

export default app;
