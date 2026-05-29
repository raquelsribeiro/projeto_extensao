// backend/src/database/seed.js

import db from './db.js';

// Limpa as tabelas (opcional, para facilitar testes)
db.exec('DELETE FROM historico_chamados; DELETE FROM chamados; DELETE FROM usuarios;');

// Insere 4 usuários fictícios
const usuarios = [
  {
    nome: 'Vitor Silva',
    email: 'vitor@vtinnovation.com.br',
    setor: 'Tech Lead'
  },
  {
    nome: 'Ana Costa',
    email: 'ana@vtinnovation.com.br',
    setor: 'Frontend'
  },
  {
    nome: 'Bruno Lima',
    email: 'bruno@vtinnovation.com.br',
    setor: 'Backend'
  },
  {
    nome: 'Carla Souza',
    email: 'carla@vtinnovation.com.br',
    setor: 'Design'
  }
];

const insertUsuario = db.prepare(`
  INSERT INTO usuarios (nome, email, setor)
  VALUES (?, ?, ?)
`);

for (const usuario of usuarios) {
  insertUsuario.run(usuario.nome, usuario.email, usuario.setor);
}

console.log('✅ Banco de dados seed completo! 4 usuários inseridos.');
