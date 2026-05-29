// backend/src/controllers/chamadosController.js

import { randomUUID } from 'crypto';
import db from '../database/db.js';
import { enviarNotificacaoSlack } from '../services/slackService.js';

// POST /api/chamados - Cria um novo chamado
export const criarChamado = async (req, res) => {
  try {
    const { titulo, tipo, descricao, urgencia, responsavel_id, prazo_esperado } = req.body;

    // Validação básica
    if (!titulo || !tipo || !descricao || !urgencia) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const id = randomUUID();
    const agora = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Insere o chamado no banco
    const insertChamado = db.prepare(`
      INSERT INTO chamados (id, titulo, tipo, descricao, urgencia, responsavel_id, prazo_esperado, created_at, updated_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertChamado.run(
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

    // Busca o responsável para exibir no Slack
    let responsavelNome = 'Não atribuído';
    if (responsavel_id) {
      const responsavel = db.prepare('SELECT nome FROM usuarios WHERE id = ?').get(responsavel_id);
      responsavelNome = responsavel?.nome || 'Desconhecido';
    }

    // Prepara dados para notificação Slack
    const chamado = {
      id,
      titulo,
      tipo,
      descricao,
      urgencia,
      prazo_esperado
    };

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    await enviarNotificacaoSlack(chamado, frontendUrl, responsavelNome);

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

// GET /api/chamados - Lista todos os chamados com filtros
export const listarChamados = (req, res) => {
  try {
    const { status, tipo, urgencia } = req.query;

    let query = 'SELECT * FROM chamados WHERE 1=1';
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

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const chamados = stmt.all(...params);

    res.json(chamados);
  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    res.status(500).json({ erro: 'Erro ao listar chamados' });
  }
};

// GET /api/chamados/:id - Retorna um chamado com seus dados e histórico
export const obterChamado = (req, res) => {
  try {
    const { id } = req.params;

    // Busca o chamado com JOIN do responsável
    const chamado = db.prepare(`
      SELECT
        c.*,
        u.nome as responsavel_nome,
        u.email as responsavel_email,
        u.setor as responsavel_setor
      FROM chamados c
      LEFT JOIN usuarios u ON c.responsavel_id = u.id
      WHERE c.id = ?
    `).get(id);

    if (!chamado) {
      return res.status(404).json({ erro: 'Chamado não encontrado' });
    }

    // Busca o histórico do chamado
    const historico = db.prepare(`
      SELECT * FROM historico_chamados
      WHERE chamado_id = ?
      ORDER BY created_at ASC
    `).all(id);

    res.json({
      ...chamado,
      historico
    });
  } catch (error) {
    console.error('Erro ao obter chamado:', error);
    res.status(500).json({ erro: 'Erro ao obter chamado' });
  }
};

// PATCH /api/chamados/:id - Atualiza o status do chamado e registra no histórico
export const atualizarChamado = (req, res) => {
  try {
    const { id } = req.params;
    const { status_novo, observacao } = req.body;

    if (!status_novo) {
      return res.status(400).json({ erro: 'Status novo é obrigatório' });
    }

    // Busca o chamado atual
    const chamado = db.prepare('SELECT * FROM chamados WHERE id = ?').get(id);

    if (!chamado) {
      return res.status(404).json({ erro: 'Chamado não encontrado' });
    }

    const agora = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Atualiza o chamado
    const updateChamado = db.prepare(`
      UPDATE chamados
      SET status = ?, updated_at = ?
      WHERE id = ?
    `);

    updateChamado.run(status_novo, agora, id);

    // Registra o histórico
    const historicoId = randomUUID();
    const insertHistorico = db.prepare(`
      INSERT INTO historico_chamados (id, chamado_id, status_anterior, status_novo, observacao, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertHistorico.run(
      historicoId,
      id,
      chamado.status,
      status_novo,
      observacao || null,
      agora
    );

    res.json({
      id,
      status: status_novo,
      updated_at: agora,
      historico_registrado: {
        id: historicoId,
        status_anterior: chamado.status,
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

// GET /api/usuarios - Lista todos os usuários
export const listarUsuarios = (req, res) => {
  try {
    const usuarios = db.prepare('SELECT * FROM usuarios ORDER BY nome ASC').all();
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
};
