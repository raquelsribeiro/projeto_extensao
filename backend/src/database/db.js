// backend/src/database/db.js

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Habilita foreign keys
db.pragma('foreign_keys = ON');

// Cria as tabelas se não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    setor TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS chamados (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    urgencia TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Aberto',
    responsavel_id TEXT,
    prazo_esperado TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS historico_chamados (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    chamado_id TEXT NOT NULL,
    status_anterior TEXT,
    status_novo TEXT,
    observacao TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (chamado_id) REFERENCES chamados(id)
  );
`);

export default db;
