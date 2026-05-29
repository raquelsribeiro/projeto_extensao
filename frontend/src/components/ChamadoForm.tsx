// frontend/src/components/ChamadoForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { Usuario, criarChamado, buscarUsuarios } from '@/lib/api';
import { useRouter } from 'next/navigation';

const TIPOS_CHAMADO = ['Bug', 'Suporte', 'Melhoria', 'Acesso', 'Incidente'];
const URGENCIAS = ['Baixa', 'Média', 'Alta', 'Crítica'];

export default function ChamadoForm() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Bug',
    descricao: '',
    urgencia: 'Média',
    responsavel_id: '',
    prazo_esperado: '',
  });

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const dados = await buscarUsuarios();
        setUsuarios(dados);
      } catch (err) {
        setErro('Erro ao carregar usuários');
        console.error(err);
      }
    };
    carregarUsuarios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    // Validação básica
    if (!formData.titulo.trim() || !formData.descricao.trim()) {
      setErro('Título e descrição são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const dadosParaEnviar = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        descricao: formData.descricao,
        urgencia: formData.urgencia,
        ...(formData.responsavel_id && { responsavel_id: formData.responsavel_id }),
        ...(formData.prazo_esperado && { prazo_esperado: formData.prazo_esperado }),
      };

      await criarChamado(dadosParaEnviar);
      router.push('/');
    } catch (err) {
      setErro('Erro ao criar chamado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {erro && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {erro}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-1">
          Título *
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Resumo do chamado"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-1">
            Tipo *
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
          >
            {TIPOS_CHAMADO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="urgencia" className="block text-sm font-semibold text-gray-700 mb-1">
            Urgência *
          </label>
          <select
            id="urgencia"
            name="urgencia"
            value={formData.urgencia}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
          >
            {URGENCIAS.map((urgencia) => (
              <option key={urgencia} value={urgencia}>
                {urgencia}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="responsavel_id" className="block text-sm font-semibold text-gray-700 mb-1">
          Responsável
        </label>
        <select
          id="responsavel_id"
          name="responsavel_id"
          value={formData.responsavel_id}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
        >
          <option value="">Nenhum</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome} ({usuario.setor})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="prazo_esperado" className="block text-sm font-semibold text-gray-700 mb-1">
          Prazo Esperado
        </label>
        <input
          type="date"
          id="prazo_esperado"
          name="prazo_esperado"
          value={formData.prazo_esperado}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Descreva em detalhes o problema ou solicitação"
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-blue"
          required
        ></textarea>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-dark-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Chamado'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
