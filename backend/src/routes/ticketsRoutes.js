// backend/src/routes/ticketsRoutes.js

import express from 'express';
import {
  createTicket,
  listTickets,
  getTicketById,
  updateTicketStatus,
  listUsers
} from '../controllers/ticketsController.js';

const router = express.Router();

// Rotas de chamados
router.post('/chamados', createTicket);
router.get('/chamados', listTickets);
router.get('/chamados/:id', getTicketById);
router.patch('/chamados/:id', updateTicketStatus);

// Rotas de usuários
router.get('/usuarios', listUsers);

export default router;
