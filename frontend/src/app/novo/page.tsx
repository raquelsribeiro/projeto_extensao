// frontend/src/app/novo/page.tsx

import ChamadoForm from '@/components/ChamadoForm';

export default function NovoChamado() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-blue mb-6">Criar Novo Chamado</h1>
      <ChamadoForm />
    </div>
  );
}
