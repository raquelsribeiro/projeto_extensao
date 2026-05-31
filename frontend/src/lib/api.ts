// frontend/src/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  nome: string;
  email: string;
  setor: string;
  created_at: string;
}

export interface TicketHistory {
  id: string;
  chamado_id: string;
  status_anterior: string | null;
  status_novo: string;
  observacao: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  titulo: string;
  tipo: string;
  descricao: string;
  urgencia: string;
  status: string;
  responsavel_id: string | null;
  responsavel_nome?: string;
  responsavel_email?: string;
  responsavel_setor?: string;
  prazo_esperado: string | null;
  created_at: string;
  updated_at: string;
  historico?: TicketHistory[];
}

// GET /api/usuarios
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios`);
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    return response.json();
  } catch (error) {
    console.error('Erro na requisição de usuários:', error);
    throw error;
  }
};

// GET /api/chamados
export const fetchTickets = async (filtros?: {
  status?: string;
  tipo?: string;
  urgencia?: string;
}): Promise<Ticket[]> => {
  try {
    let url = `${API_URL}/api/chamados`;

    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.status) params.append('status', filtros.status);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.urgencia) params.append('urgencia', filtros.urgencia);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar chamados');
    return response.json();
  } catch (error) {
    console.error('Erro na requisição de chamados:', error);
    throw error;
  }
};

// GET /api/chamados/:id
export const fetchTicketById = async (id: string): Promise<Ticket> => {
  try {
    const response = await fetch(`${API_URL}/api/chamados/${id}`);
    if (!response.ok) throw new Error('Chamado não encontrado');
    return response.json();
  } catch (error) {
    console.error('Erro na requisição de chamado:', error);
    throw error;
  }
};

// POST /api/chamados
export const createTicket = async (dados: {
  titulo: string;
  tipo: string;
  descricao: string;
  urgencia: string;
  responsavel_id?: string;
  prazo_esperado?: string;
}): Promise<Ticket> => {
  try {
    const response = await fetch(`${API_URL}/api/chamados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) throw new Error('Erro ao criar chamado');
    return response.json();
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    throw error;
  }
};

// PATCH /api/chamados/:id
export const updateTicketStatus = async (
  id: string,
  dados: {
    status_novo: string;
    observacao?: string;
  }
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/chamados/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) throw new Error('Erro ao atualizar chamado');
    return response.json();
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    throw error;
  }
};
