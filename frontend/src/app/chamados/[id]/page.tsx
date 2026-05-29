// frontend/src/app/chamados/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { buscarChamadoPorId, atualizarChamado, Chamado, HistoricoChamado } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import UrgenciaBadge from '@/components/UrgenciaBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_OPCOES = ['Aberto', 'Em Andamento', 'Concluído'];

export default function DetalhesChamado({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [showModalAtualizar, setShowModalAtualizar] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const [formAtualizacao, setFormAtualizacao] = useState({
    status_novo: '',
    observacao: '',
  });

  useEffect(() => {
    carregarChamado();
  }, [params.id]);

  const carregarChamado = async () => {
    try {
      setLoading(true);
      setErro('');
      const dados = await buscarChamadoPorId(params.id);
      setChamado(dados);
      setFormAtualizacao((prev) => ({
        ...prev,
        status_novo: dados.status,
      }));
    } catch (err) {
      setErro('Chamado não encontrado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formAtualizacao.status_novo) {
      setErro('Selecione um novo status');
      return;
    }

    setAtualizando(true);
    setErro('');

    try {
      await atualizarChamado(params.id, {
        status_novo: formAtualizacao.status_novo,
        observacao: formAtualizacao.observacao || undefined,
      });

      setShowModalAtualizar(false);
      await carregarChamado();
      setFormAtualizacao({
        status_novo: '',
        observacao: '',
      });
    } catch (err) {
      setErro('Erro ao atualizar chamado');
      console.error(err);
    } finally {
      setAtualizando(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Carregando chamado...</p>
      </div>
    );
  }

  if (erro && !chamado) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-4">{erro}</p>
        <Link href="/" className="text-dark-blue font-semibold hover:underline">
          ← Voltar para Dashboard
        </Link>
      </div>
    );
  }

  if (!chamado) return null;

  const dataFormatada = new Date(chamado.created_at).toLocaleDateString('pt-BR');
  const dataAtualizacaoFormatada = new Date(chamado.updated_at).toLocaleDateString('pt-BR');

  return (
    <div>
      <Link href="/" className="text-dark-blue font-semibold hover:underline mb-6 inline-block">
        ← Voltar para Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-dark-blue mb-2">{chamado.titulo}</h1>
            <p className="text-gray-500 text-sm">ID: {chamado.id}</p>
          </div>
          <StatusBadge status={chamado.status} />
        </div>

        {erro && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Tipo</p>
            <p className="text-lg font-semibold text-gray-700">{chamado.tipo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Urgência</p>
            <UrgenciaBadge urgencia={chamado.urgencia} />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Responsável</p>
            <p className="text-lg font-semibold text-gray-700">
              {chamado.responsavel_nome ? `${chamado.responsavel_nome} (${chamado.responsavel_setor})` : 'Não atribuído'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Prazo Esperado</p>
            <p className="text-lg font-semibold text-gray-700">
              {chamado.prazo_esperado ? new Date(chamado.prazo_esperado).toLocaleDateString('pt-BR') : 'Não informado'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase mb-2">Descrição</p>
          <p className="text-gray-700 whitespace-pre-wrap">{chamado.descricao}</p>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
          <span>Criado em: {dataFormatada}</span>
          <span>Atualizado em: {dataAtualizacaoFormatada}</span>
        </div>

        {/* Botão para atualizar status */}
        <button
          onClick={() => setShowModalAtualizar(true)}
          className="bg-dark-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-900 transition"
        >
          Atualizar Status
        </button>
      </div>

      {/* Modal de atualização */}
      {showModalAtualizar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-dark-blue mb-4">Atualizar Status</h2>

            <form onSubmit={handleAtualizar}>
              <div className="mb-4">
                <label htmlFor="status_novo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Novo Status
                </label>
                <select
                  id="status_novo"
                  value={formAtualizacao.status_novo}
                  onChange={(e) =>
                    setFormAtualizacao((prev) => ({
                      ...prev,
                      status_novo: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
                >
                  <option value="">Selecione um status</option>
                  {STATUS_OPCOES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="observacao" className="block text-sm font-semibold text-gray-700 mb-2">
                  Observação
                </label>
                <textarea
                  id="observacao"
                  value={formAtualizacao.observacao}
                  onChange={(e) =>
                    setFormAtualizacao((prev) => ({
                      ...prev,
                      observacao: e.target.value,
                    }))
                  }
                  placeholder="Adicione uma observação sobre esta mudança"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={atualizando}
                  className="flex-1 bg-dark-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-50"
                >
                  {atualizando ? 'Atualizando...' : 'Atualizar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModalAtualizar(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Histórico de atualizações */}
      {chamado.historico && chamado.historico.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-dark-blue mb-6">Histórico de Atualizações</h2>

          <div className="relative">
            {chamado.historico.map((item, index) => (
              <div key={item.id} className="mb-6 flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-dark-blue rounded-full"></div>
                  {index < chamado.historico!.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                  )}
                </div>

                <div className="pb-6 border-b border-gray-200 flex-1">
                  <p className="font-semibold text-gray-800">
                    {item.status_anterior} → {item.status_novo}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(item.created_at).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(item.created_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {item.observacao && (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{item.observacao}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
