'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Timeline,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconArrowLeft, IconCalendarDue, IconEdit, IconHistory, IconUserCircle } from '@tabler/icons-react';
import { Ticket, fetchTicketById, updateTicketStatus } from '@/lib/api';
import PriorityBadge from '@/components/PriorityBadge';
import StatusBadge from '@/components/StatusBadge';

const STATUS_OPTIONS = ['Aberto', 'Em Andamento', 'Concluído'];

const TicketDetailsPage = ({ params }: { params: { id: string } }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    new_status: '',
    note: '',
  });

  const loadTicket = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchTicketById(params.id);
      setTicket(data);
      setUpdateForm((current) => ({
        ...current,
        new_status: data.status,
      }));
    } catch (err) {
      setError('Chamado não encontrado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [params.id]);

  const updateField = (field: keyof typeof updateForm, value: string | null) => {
    setUpdateForm((current) => ({
      ...current,
      [field]: value || '',
    }));
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!updateForm.new_status) {
      setError('Selecione um novo status');
      return;
    }

    setUpdating(true);
    setError('');

    try {
      await updateTicketStatus(params.id, {
        new_status: updateForm.new_status,
        note: updateForm.note || undefined,
      });

      setShowUpdateModal(false);
      setUpdateForm({ new_status: '', note: '' });
      await loadTicket();
    } catch (err) {
      setError('Erro ao atualizar chamado');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (error && !ticket) {
    return (
      <Paper withBorder radius="md" p="xl">
        <Stack align="center">
          <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
            {error}
          </Alert>
          <Button component={Link} href="/" variant="default" leftSection={<IconArrowLeft size={18} />}>
            Voltar para o dashboard
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (!ticket) return null;

  const formattedDate = new Date(ticket.created_at).toLocaleDateString('pt-BR');
  const formattedUpdateDate = new Date(ticket.updated_at).toLocaleDateString('pt-BR');
  const responsible = ticket.responsible_name
    ? `${ticket.responsible_name} (${ticket.responsible_team})`
    : 'Não atribuído';

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Button component={Link} href="/" variant="subtle" leftSection={<IconArrowLeft size={18} />}>
          Dashboard
        </Button>
        <Button leftSection={<IconEdit size={18} />} onClick={() => setShowUpdateModal(true)}>
          Atualizar status
        </Button>
      </Group>

      <Paper withBorder shadow="sm" radius="md" p="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start">
            <Stack gap={6} style={{ minWidth: 0 }}>
              <Group gap="xs">
                <StatusBadge status={ticket.status} />
                <PriorityBadge urgency={ticket.priority} />
              </Group>
              <Title order={1}>{ticket.title}</Title>
              <Text size="sm" c="dimmed">
                ID: {ticket.id}
              </Text>
            </Stack>
          </Group>

          {error && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              {error}
            </Alert>
          )}

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <Card withBorder radius="md" p="md">
              <Text size="xs" c="dimmed" fw={700}>Tipo</Text>
              <Text fw={600}>{ticket.type}</Text>
            </Card>
            <Card withBorder radius="md" p="md">
              <Group gap={6}>
                <IconUserCircle size={18} color="var(--mantine-color-gray-6)" />
                <Text size="xs" c="dimmed" fw={700}>Responsável</Text>
              </Group>
              <Text fw={600}>{responsible}</Text>
            </Card>
            <Card withBorder radius="md" p="md">
              <Group gap={6}>
                <IconCalendarDue size={18} color="var(--mantine-color-gray-6)" />
                <Text size="xs" c="dimmed" fw={700}>Prazo</Text>
              </Group>
              <Text fw={600}>
                {ticket.expected_due_date ? new Date(ticket.expected_due_date).toLocaleDateString('pt-BR') : 'Não informado'}
              </Text>
            </Card>
            <Card withBorder radius="md" p="md">
              <Text size="xs" c="dimmed" fw={700}>Atualização</Text>
              <Text fw={600}>{formattedUpdateDate}</Text>
            </Card>
          </SimpleGrid>

          <Card withBorder radius="md" p="lg">
            <Text size="xs" c="dimmed" fw={700} mb={6}>Descrição</Text>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</Text>
          </Card>

          <Text size="sm" c="dimmed">
            Criado em {formattedDate}
          </Text>
        </Stack>
      </Paper>

      <Paper withBorder shadow="xs" radius="md" p="xl">
        <Group gap="xs" mb="lg">
          <IconHistory size={22} color="var(--mantine-color-blue-6)" />
          <Title order={2} size="h3">Histórico de atualizações</Title>
        </Group>

        {ticket.history && ticket.history.length > 0 ? (
          <Timeline active={ticket.history.length} bulletSize={22} lineWidth={2}>
            {ticket.history.map((item) => (
              <Timeline.Item key={item.id} title={`${item.previous_status} → ${item.new_status}`}>
                <Text size="sm" c="dimmed">
                  {new Date(item.created_at).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(item.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {item.note && (
                  <Text size="sm" mt={4}>
                    {item.note}
                  </Text>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Text c="dimmed">Nenhuma atualização registrada até o momento.</Text>
        )}
      </Paper>

      <Modal opened={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Atualizar status" centered>
        <Stack component="form" onSubmit={handleUpdate} gap="md">
          <Select
            label="Novo status"
            data={STATUS_OPTIONS}
            value={updateForm.new_status || null}
            onChange={(value) => updateField('new_status', value)}
            required
          />
          <Textarea
            label="Observação"
            placeholder="Adicione uma observação sobre esta mudança"
            minRows={4}
            value={updateForm.note}
            onChange={(event) => updateField('note', event.currentTarget.value)}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setShowUpdateModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={updating}>
              Salvar atualização
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default TicketDetailsPage;
