const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  name: string;
  email: string;
  team: string;
  created_at: string;
}

export interface TicketHistory {
  id: string;
  ticket_id: string;
  previous_status: string | null;
  new_status: string;
  note: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  title: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  responsible_id: string | null;
  responsible_name?: string;
  responsible_email?: string;
  responsible_team?: string;
  expected_due_date: string | null;
  created_at: string;
  updated_at: string;
  history?: TicketHistory[];
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/api/users`);
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    return response.json();
  } catch (error) {
    console.error('Erro na requisição de usuários:', error);
    throw error;
  }
};

export const fetchTickets = async (filters?: {
  status?: string;
  type?: string;
  priority?: string;
}): Promise<Ticket[]> => {
  try {
    let url = `${API_URL}/api/tickets`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.priority) params.append('priority', filters.priority);

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

export const fetchTicketById = async (id: string): Promise<Ticket> => {
  try {
    const response = await fetch(`${API_URL}/api/tickets/${id}`);
    if (!response.ok) throw new Error('Chamado não encontrado');
    return response.json();
  } catch (error) {
    console.error('Erro na requisição de chamado:', error);
    throw error;
  }
};

export const createTicket = async (data: {
  title: string;
  type: string;
  description: string;
  priority: string;
  responsible_id?: string;
  expected_due_date?: string;
}): Promise<Ticket> => {
  try {
    const response = await fetch(`${API_URL}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Erro ao criar chamado');
    return response.json();
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    throw error;
  }
};

export const updateTicketStatus = async (
  id: string,
  data: {
    new_status: string;
    note?: string;
  }
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/tickets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Erro ao atualizar chamado');
    return response.json();
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    throw error;
  }
};
