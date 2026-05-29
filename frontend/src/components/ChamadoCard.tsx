// frontend/src/components/ChamadoCard.tsx

import Link from 'next/link';
import StatusBadge from './StatusBadge';
import UrgenciaBadge from './UrgenciaBadge';
import { Chamado } from '@/lib/api';

interface ChamadoCardProps {
  chamado: Chamado;
}

export default function ChamadoCard({ chamado }: ChamadoCardProps) {
  const dataFormatada = new Date(chamado.created_at).toLocaleDateString('pt-BR');

  return (
    <Link href={`/chamados/${chamado.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-dark-blue flex-1">{chamado.titulo}</h3>
          <StatusBadge status={chamado.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase">Tipo</p>
            <p className="text-sm font-semibold text-gray-700">{chamado.tipo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Urgência</p>
            <UrgenciaBadge urgencia={chamado.urgencia} />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-500 uppercase">Responsável</p>
          <p className="text-sm font-semibold text-gray-700">
            {chamado.responsavel_id ? chamado.responsavel_nome || 'Desconhecido' : 'Não atribuído'}
          </p>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
          <span>{dataFormatada}</span>
          <span className="text-dark-blue font-semibold">Ver detalhes →</span>
        </div>
      </div>
    </Link>
  );
}
