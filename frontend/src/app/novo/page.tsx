// frontend/src/app/novo/page.tsx

import TicketForm from '@/components/TicketForm';

export default function NewTicketPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-blue mb-6">Criar Novo Chamado</h1>
      <TicketForm />
    </div>
  );
}
