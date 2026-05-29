// frontend/src/components/TicketCard.tsx

import Link from 'next/link';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { Ticket } from '@/lib/api';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const formattedDate = new Date(ticket.created_at).toLocaleDateString('pt-BR');

  return (
    <Link href={`/chamados/${ticket.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-dark-blue flex-1">{ticket.titulo}</h3>
          <StatusBadge status={ticket.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase">Tipo</p>
            <p className="text-sm font-semibold text-gray-700">{ticket.tipo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Urgência</p>
            <PriorityBadge urgency={ticket.urgencia} />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-500 uppercase">Responsável</p>
          <p className="text-sm font-semibold text-gray-700">
            {ticket.responsavel_id ? ticket.responsavel_nome || 'Desconhecido' : 'Não atribuído'}
          </p>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
          <span>{formattedDate}</span>
          <span className="text-dark-blue font-semibold">Ver detalhes →</span>
        </div>
      </div>
    </Link>
  );
}
