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
  res.json({ message: 'VT Innovation ticket system backend is running' });
});

// Inicializa o servidor
const server = app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`);
  console.log(`Slack: ${process.env.SLACK_ENABLED === 'true' ? 'Enabled' : 'Waiting for authorization'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.`);
    console.error('Stop the process using this port or change PORT in the .env file.');
    console.error(`Example: PORT=3002 npm run dev\n`);
    process.exit(1);
  }

  console.error('Error starting server:', error);
  process.exit(1);
});

export default app;
