import { randomUUID } from 'crypto';
import db from './db.js';

db.exec('DELETE FROM ticket_history; DELETE FROM tickets; DELETE FROM users;');

const users = [
  {
    name: 'Vitor Silva',
    email: 'vitor@vtinnovation.com.br',
    team: 'Tech Lead'
  },
  {
    name: 'Ana Costa',
    email: 'ana@vtinnovation.com.br',
    team: 'Frontend'
  },
  {
    name: 'Bruno Lima',
    email: 'bruno@vtinnovation.com.br',
    team: 'Backend'
  },
  {
    name: 'Carla Souza',
    email: 'carla@vtinnovation.com.br',
    team: 'Design'
  }
];

const insertUser = db.prepare(`
  INSERT INTO users (name, email, team)
  VALUES (?, ?, ?)
`);

for (const user of users) {
  insertUser.run(user.name, user.email, user.team);
}

const vitor = db.prepare('SELECT id FROM users WHERE email = ?').get('vitor@vtinnovation.com.br');
const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

const demoTickets = [
  {
    id: randomUUID(),
    title: 'Teste Final do Sistema',
    type: 'Melhoria',
    description: 'Teste completo de criação do chamado',
    priority: 'Média',
    status: 'Em Andamento',
    expected_due_date: null
  },
  {
    id: randomUUID(),
    title: 'Teste de Chamado',
    type: 'Bug',
    description: 'Este é um chamado de teste para validar a API',
    priority: 'Alta',
    status: 'Em Andamento',
    expected_due_date: '2026-06-04'
  }
];

const insertTicket = db.prepare(`
  INSERT INTO tickets (
    id,
    title,
    type,
    description,
    priority,
    status,
    responsible_id,
    expected_due_date,
    created_at,
    updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const ticket of demoTickets) {
  insertTicket.run(
    ticket.id,
    ticket.title,
    ticket.type,
    ticket.description,
    ticket.priority,
    ticket.status,
    vitor.id,
    ticket.expected_due_date,
    now,
    now
  );
}

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
  randomUUID(),
  demoTickets[1].id,
  'Aberto',
  'Em Andamento',
  'Iniciado o trabalho no chamado',
  now
);

console.log('Database seed completed. 4 users, 2 tickets, and 1 history entry inserted.');
