// frontend/src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import ChamadoCard from '@/components/ChamadoCard';
import { buscarChamados, Chamado } from '@/lib/api';
import Link from 'next/link';

const TIPOS_CHAMADO = ['Bug', 'Suporte', 'Melhoria', 'Acesso', 'Incidente'];
const URGENCIAS = ['Baixa', 'Média', 'Alta', 'Crítica'];
const STATUS_OPCOES = ['Aberto', 'Em Andamento', 'Concluído'];

export default function Dashboard() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [filtros, setFiltros] = useState({
    status: '',
    tipo: '',
    urgencia: '',
  });

  useEffect(() => {
    carregarChamados();
  }, [filtros]);

  const carregarChamados = async () => {
    try {
      setLoading(true);
      setErro('');
      const dados = await buscarChamados({
        status: filtros.status || undefined,
        tipo: filtros.tipo || undefined,
        urgencia: filtros.urgencia || undefined,
      });
      setChamados(dados);
    } catch (err) {
      setErro('Erro ao carregar chamados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resumo = {
    aberto: chamados.filter((c) => c.status === 'Aberto').length,
    emAndamento: chamados.filter((c) => c.status === 'Em Andamento').length,
    concluido: chamados.filter((c) => c.status === 'Concluído').length,
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-dark-blue">Dashboard</h1>
          <Link
            href="/novo"
            className="bg-dark-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            + Novo Chamado
          </Link>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-600 uppercase">Abertos</p>
            <p className="text-3xl font-bold text-dark-blue">{resumo.aberto}</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-gray-600 uppercase">Em Andamento</p>
            <p className="text-3xl font-bold text-yellow-600">{resumo.emAndamento}</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-gray-600 uppercase">Concluídos</p>
            <p className="text-3xl font-bold text-green-600">{resumo.concluido}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-dark-blue mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filtros.status}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
            >
              <option value="">Todos</option>
              {STATUS_OPCOES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
            >
              <option value="">Todos</option>
              {TIPOS_CHAMADO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="urgencia" className="block text-sm font-semibold text-gray-700 mb-1">
              Urgência
            </label>
            <select
              id="urgencia"
              name="urgencia"
              value={filtros.urgencia}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
            >
              <option value="">Todos</option>
              {URGENCIAS.map((urgencia) => (
                <option key={urgencia} value={urgencia}>
                  {urgencia}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de chamados */}
      {erro && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {erro}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando chamados...</p>
        </div>
      ) : chamados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum chamado encontrado</p>
          <Link href="/novo" className="text-dark-blue font-semibold hover:underline mt-2 inline-block">
            Criar primeiro chamado →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chamados.map((chamado) => (
            <ChamadoCard key={chamado.id} chamado={chamado} />
          ))}
        </div>
      )}
    </div>
  );
}
