// backend/src/routes/ticketsRoutes.js

import express from 'express';
import {
  createTicket,
  getTicketById,
  listTickets,
  listUsers,
  updateTicketStatus
} from '../controllers/ticketsController.js';

const router = express.Router();

router.post('/tickets', createTicket);
router.get('/tickets', listTickets);
router.get('/tickets/:id', getTicketById);
router.patch('/tickets/:id', updateTicketStatus);

router.get('/users', listUsers);

export default router;
