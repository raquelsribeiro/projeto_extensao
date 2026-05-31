'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Group, Paper, Select, SimpleGrid, Stack, TextInput, Textarea } from '@mantine/core';
import { IconAlertCircle, IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { User, createTicket, fetchUsers } from '@/lib/api';

const TICKET_TYPES = ['Bug', 'Suporte', 'Melhoria', 'Acesso', 'Incidente'];
const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Crítica'];

const TicketForm = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Bug',
    descricao: '',
    urgencia: 'Média',
    responsavel_id: '',
    prazo_esperado: '',
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError('Erro ao carregar usuários');
        console.error(err);
      }
    };

    loadUsers();
  }, []);

  const updateField = (field: keyof typeof formData, value: string | null) => {
    setFormData((current) => ({
      ...current,
      [field]: value || '',
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!formData.titulo.trim() || !formData.descricao.trim()) {
      setError('Título e descrição são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        descricao: formData.descricao,
        urgencia: formData.urgencia,
        ...(formData.responsavel_id && { responsavel_id: formData.responsavel_id }),
        ...(formData.prazo_esperado && { prazo_esperado: formData.prazo_esperado }),
      };

      await createTicket(payload);
      router.push('/');
    } catch (err) {
      setError('Erro ao criar chamado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} withBorder shadow="sm" radius="md" p="xl">
      <Stack gap="lg">
        {error && (
          <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
            {error}
          </Alert>
        )}

        <TextInput
          label="Título"
          description="Resumo curto da demanda"
          placeholder="Ex.: Corrigir falha no acesso interno"
          value={formData.titulo}
          onChange={(event) => updateField('titulo', event.currentTarget.value)}
          required
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Tipo"
            data={TICKET_TYPES}
            value={formData.tipo}
            onChange={(value) => updateField('tipo', value)}
            required
          />

          <Select
            label="Urgência"
            data={PRIORITIES}
            value={formData.urgencia}
            onChange={(value) => updateField('urgencia', value)}
            required
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Responsável"
            placeholder="Selecionar responsável"
            data={users.map((user) => ({
              value: user.id,
              label: `${user.nome} (${user.setor})`,
            }))}
            value={formData.responsavel_id || null}
            onChange={(value) => updateField('responsavel_id', value)}
            clearable
          />

          <TextInput
            label="Prazo esperado"
            type="date"
            value={formData.prazo_esperado}
            onChange={(event) => updateField('prazo_esperado', event.currentTarget.value)}
          />
        </SimpleGrid>

        <Textarea
          label="Descrição"
          description="Inclua contexto, impacto e qualquer informação útil para atendimento"
          placeholder="Descreva o problema ou solicitação com detalhes"
          minRows={6}
          autosize
          value={formData.descricao}
          onChange={(event) => updateField('descricao', event.currentTarget.value)}
          required
        />

        <Group justify="flex-end">
          <Button variant="default" leftSection={<IconArrowLeft size={18} />} onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading} leftSection={<IconDeviceFloppy size={18} />}>
            Criar chamado
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default TicketForm;
