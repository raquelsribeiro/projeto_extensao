// backend/src/controllers/ticketsController.js

import { randomUUID } from 'crypto';
import db from '../database/db.js';
import { notifySlackTicketCreated } from '../services/slackService.js';

// POST /api/chamados - Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { titulo, tipo, descricao, urgencia, responsavel_id, prazo_esperado } = req.body;

    if (!titulo || !tipo || !descricao || !urgencia) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const id = randomUUID();
    const agora = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const insertTicket = db.prepare(`
      INSERT INTO chamados (id, titulo, tipo, descricao, urgencia, responsavel_id, prazo_esperado, created_at, updated_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTicket.run(
      id,
      titulo,
      tipo,
      descricao,
      urgencia,
      responsavel_id || null,
      prazo_esperado || null,
      agora,
      agora,
      'Aberto'
    );

    let responsibleName = 'Não atribuído';
    if (responsavel_id) {
      const responsavel = db.prepare('SELECT nome FROM usuarios WHERE id = ?').get(responsavel_id);
      responsibleName = responsavel?.nome || 'Desconhecido';
    }

    const ticket = {
      id,
      titulo,
      tipo,
      descricao,
      urgencia,
      prazo_esperado
    };

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    await notifySlackTicketCreated(ticket, frontendUrl, responsibleName);

    res.status(201).json({
      id,
      titulo,
      tipo,
      descricao,
      urgencia,
      responsavel_id,
      prazo_esperado,
      status: 'Aberto',
      created_at: agora,
      updated_at: agora
    });
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    res.status(500).json({ erro: 'Erro ao criar chamado' });
  }
};

// GET /api/chamados - List tickets with optional filters
export const listTickets = (req, res) => {
  try {
    const { status, tipo, urgencia } = req.query;

    let query = `
      SELECT
        c.*,
        u.nome as responsavel_nome,
        u.email as responsavel_email,
        u.setor as responsavel_setor
      FROM chamados c
      LEFT JOIN usuarios u ON c.responsavel_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    if (urgencia) {
      query += ' AND urgencia = ?';
      params.push(urgencia);
    }

    query += ' ORDER BY c.created_at DESC';

    const stmt = db.prepare(query);
    const tickets = stmt.all(...params);

    res.json(tickets);
  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    res.status(500).json({ erro: 'Erro ao listar chamados' });
  }
};

// GET /api/chamados/:id - Return a ticket with responsible user and history
export const getTicketById = (req, res) => {
  try {
    const { id } = req.params;

    const ticket = db.prepare(`
      SELECT
        c.*,
        u.nome as responsavel_nome,
        u.email as responsavel_email,
        u.setor as responsavel_setor
      FROM chamados c
      LEFT JOIN usuarios u ON c.responsavel_id = u.id
      WHERE c.id = ?
    `).get(id);

    if (!ticket) {
      return res.status(404).json({ erro: 'Chamado não encontrado' });
    }

    const history = db.prepare(`
      SELECT * FROM historico_chamados
      WHERE chamado_id = ?
      ORDER BY created_at ASC
    `).all(id);

    res.json({
      ...ticket,
      historico: history
    });
  } catch (error) {
    console.error('Erro ao obter chamado:', error);
    res.status(500).json({ erro: 'Erro ao obter chamado' });
  }
};

// PATCH /api/chamados/:id - Update ticket status and register history
export const updateTicketStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status_novo, observacao } = req.body;

    if (!status_novo) {
      return res.status(400).json({ erro: 'Status novo é obrigatório' });
    }

    const ticket = db.prepare('SELECT * FROM chamados WHERE id = ?').get(id);

    if (!ticket) {
      return res.status(404).json({ erro: 'Chamado não encontrado' });
    }

    const agora = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const updateTicket = db.prepare(`
      UPDATE chamados
      SET status = ?, updated_at = ?
      WHERE id = ?
    `);

    updateTicket.run(status_novo, agora, id);

    const historyId = randomUUID();
    const insertHistory = db.prepare(`
      INSERT INTO historico_chamados (id, chamado_id, status_anterior, status_novo, observacao, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertHistory.run(
      historyId,
      id,
      ticket.status,
      status_novo,
      observacao || null,
      agora
    );

    res.json({
      id,
      status: status_novo,
      updated_at: agora,
      historico_registrado: {
        id: historyId,
        status_anterior: ticket.status,
        status_novo,
        observacao,
        created_at: agora
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ erro: 'Erro ao atualizar chamado' });
  }
};

// GET /api/usuarios - List available users
export const listUsers = (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM usuarios ORDER BY nome ASC').all();
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
};
