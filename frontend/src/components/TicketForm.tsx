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
    title: '',
    type: 'Bug',
    description: '',
    priority: 'Média',
    responsible_id: '',
    expected_due_date: '',
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

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Título e descrição são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        priority: formData.priority,
        ...(formData.responsible_id && { responsible_id: formData.responsible_id }),
        ...(formData.expected_due_date && { expected_due_date: formData.expected_due_date }),
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
          value={formData.title}
          onChange={(event) => updateField('title', event.currentTarget.value)}
          required
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Tipo"
            data={TICKET_TYPES}
            value={formData.type}
            onChange={(value) => updateField('type', value)}
            required
          />

          <Select
            label="Urgência"
            data={PRIORITIES}
            value={formData.priority}
            onChange={(value) => updateField('priority', value)}
            required
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Responsável"
            placeholder="Selecionar responsável"
            data={users.map((user) => ({
              value: user.id,
              label: `${user.name} (${user.team})`,
            }))}
            value={formData.responsible_id || null}
            onChange={(value) => updateField('responsible_id', value)}
            clearable
          />

          <TextInput
            label="Prazo esperado"
            type="date"
            value={formData.expected_due_date}
            onChange={(event) => updateField('expected_due_date', event.currentTarget.value)}
          />
        </SimpleGrid>

        <Textarea
          label="Descrição"
          description="Inclua contexto, impacto e qualquer informação útil para atendimento"
          placeholder="Descreva o problema ou solicitação com detalhes"
          minRows={6}
          autosize
          value={formData.description}
          onChange={(event) => updateField('description', event.currentTarget.value)}
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
