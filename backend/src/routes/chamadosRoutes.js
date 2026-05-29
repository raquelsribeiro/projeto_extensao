// backend/src/routes/chamadosRoutes.js

import express from 'express';
import {
  criarChamado,
  listarChamados,
  obterChamado,
  atualizarChamado,
  listarUsuarios
} from '../controllers/chamadosController.js';

const router = express.Router();

// Rotas de chamados
router.post('/chamados', criarChamado);
router.get('/chamados', listarChamados);
router.get('/chamados/:id', obterChamado);
router.patch('/chamados/:id', atualizarChamado);

// Rotas de usuários
router.get('/usuarios', listarUsuarios);

export default router;
