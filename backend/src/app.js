// backend/src/app.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ticketsRoutes from './routes/ticketsRoutes.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', ticketsRoutes);

// Rota raiz para verificar se o servidor está ativo
app.get('/', (req, res) => {
  res.json({ mensagem: 'Sistema de Chamados VT Innovation - Backend ativo' });
});

// Inicializa o servidor
const server = app.listen(PORT, () => {
  console.log(`\nServidor rodando em http://localhost:${PORT}`);
  console.log(`Slack: ${process.env.SLACK_ENABLED === 'true' ? 'Habilitado' : 'Aguardando autorização'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\nA porta ${PORT} já está em uso.`);
    console.error('Encerre o processo que está usando essa porta ou altere PORT no arquivo .env.');
    console.error(`Exemplo: PORT=3002 npm run dev\n`);
    process.exit(1);
  }

  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
});

export default app;
