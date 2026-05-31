// backend/src/controllers/ticketsController.js

import { randomUUID } from 'crypto';
import db from '../database/db.js';
import { notifySlackTicketCreated } from '../services/slackService.js';

const getCurrentTimestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

export const createTicket = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      priority,
      responsible_id,
      expected_due_date
    } = req.body;

    if (!title || !type || !description || !priority) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const id = randomUUID();
    const now = getCurrentTimestamp();

    const insertTicket = db.prepare(`
      INSERT INTO tickets (
        id,
        title,
        type,
        description,
        priority,
        responsible_id,
        expected_due_date,
        created_at,
        updated_at,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTicket.run(
      id,
      title,
      type,
      description,
      priority,
      responsible_id || null,
      expected_due_date || null,
      now,
      now,
      'Aberto'
    );

    let responsibleName = 'Não atribuído';
    if (responsible_id) {
      const responsible = db.prepare('SELECT name FROM users WHERE id = ?').get(responsible_id);
      responsibleName = responsible?.name || 'Desconhecido';
    }

    const ticket = {
      id,
      title,
      type,
      description,
      priority,
      expected_due_date
    };

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    await notifySlackTicketCreated(ticket, frontendUrl, responsibleName);

    res.status(201).json({
      id,
      title,
      type,
      description,
      priority,
      responsible_id: responsible_id || null,
      expected_due_date: expected_due_date || null,
      status: 'Aberto',
      created_at: now,
      updated_at: now
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Error creating ticket' });
  }
};

export const listTickets = (req, res) => {
  try {
    const { status, type, priority } = req.query;

    let query = `
      SELECT
        t.*,
        u.name as responsible_name,
        u.email as responsible_email,
        u.team as responsible_team
      FROM tickets t
      LEFT JOIN users u ON t.responsible_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY t.created_at DESC';

    const tickets = db.prepare(query).all(...params);

    res.json(tickets);
  } catch (error) {
    console.error('Error listing tickets:', error);
    res.status(500).json({ error: 'Error listing tickets' });
  }
};

export const getTicketById = (req, res) => {
  try {
    const { id } = req.params;

    const ticket = db.prepare(`
      SELECT
        t.*,
        u.name as responsible_name,
        u.email as responsible_email,
        u.team as responsible_team
      FROM tickets t
      LEFT JOIN users u ON t.responsible_id = u.id
      WHERE t.id = ?
    `).get(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const history = db.prepare(`
      SELECT * FROM ticket_history
      WHERE ticket_id = ?
      ORDER BY created_at ASC
    `).all(id);

    res.json({
      ...ticket,
      history
    });
  } catch (error) {
    console.error('Error getting ticket:', error);
    res.status(500).json({ error: 'Error getting ticket' });
  }
};

export const updateTicketStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { new_status, note } = req.body;

    if (!new_status) {
      return res.status(400).json({ error: 'New status is required' });
    }

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const now = getCurrentTimestamp();

    db.prepare(`
      UPDATE tickets
      SET status = ?, updated_at = ?
      WHERE id = ?
    `).run(new_status, now, id);

    const historyId = randomUUID();
    db.prepare(`
      INSERT INTO ticket_history (
        id,
        ticket_id,
        previous_status,
        new_status,
        note,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      historyId,
      id,
      ticket.status,
      new_status,
      note || null,
      now
    );

    res.json({
      id,
      status: new_status,
      updated_at: now,
      history_entry: {
        id: historyId,
        previous_status: ticket.status,
        new_status,
        note: note || null,
        created_at: now
      }
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Error updating ticket' });
  }
};

export const listUsers = (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY name ASC').all();
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Error listing users' });
  }
};
