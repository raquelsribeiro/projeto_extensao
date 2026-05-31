'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconCircleCheck, IconClock, IconPlus, IconTicket } from '@tabler/icons-react';
import TicketCard from '@/components/TicketCard';
import { Ticket, fetchTickets } from '@/lib/api';

const TICKET_TYPES = ['Bug', 'Suporte', 'Melhoria', 'Acesso', 'Incidente'];
const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Crítica'];
const STATUS_OPTIONS = ['Aberto', 'Em Andamento', 'Concluído'];

const Dashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    tipo: '',
    urgencia: '',
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchTickets({
        status: filters.status || undefined,
        tipo: filters.tipo || undefined,
        urgencia: filters.urgencia || undefined,
      });
      setTickets(data);
    } catch (err) {
      setError('Erro ao carregar chamados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filters]);

  const summary = useMemo(() => ({
    open: tickets.filter((ticket) => ticket.status === 'Aberto').length,
    inProgress: tickets.filter((ticket) => ticket.status === 'Em Andamento').length,
    done: tickets.filter((ticket) => ticket.status === 'Concluído').length,
  }), [tickets]);

  const updateFilter = (field: keyof typeof filters, value: string | null) => {
    setFilters((current) => ({
      ...current,
      [field]: value || '',
    }));
  };

  return (
    <Stack gap="xl">
      <Paper withBorder shadow="sm" radius="md" p="xl">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text size="sm" fw={700} c="blue">
              VT Innovation
            </Text>
            <Title order={1}>Dashboard de chamados</Title>
            <Text c="dimmed" maw={680}>
              Visão consolidada das demandas técnicas internas, com filtros para consulta rápida e evidências claras para o Projeto de Extensão V.
            </Text>
          </Stack>
          <Button component={Link} href="/novo" leftSection={<IconPlus size={18} />}>
            Novo chamado
          </Button>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card withBorder shadow="xs" radius="md" p="lg">
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="sm" c="dimmed" fw={700}>Abertos</Text>
              <Title order={2}>{summary.open}</Title>
            </Stack>
            <IconTicket size={34} color="var(--mantine-color-blue-6)" />
          </Group>
        </Card>
        <Card withBorder shadow="xs" radius="md" p="lg">
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="sm" c="dimmed" fw={700}>Em andamento</Text>
              <Title order={2}>{summary.inProgress}</Title>
            </Stack>
            <IconClock size={34} color="var(--mantine-color-yellow-7)" />
          </Group>
        </Card>
        <Card withBorder shadow="xs" radius="md" p="lg">
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="sm" c="dimmed" fw={700}>Concluídos</Text>
              <Title order={2}>{summary.done}</Title>
            </Stack>
            <IconCircleCheck size={34} color="var(--mantine-color-green-6)" />
          </Group>
        </Card>
      </SimpleGrid>

      <Paper withBorder shadow="xs" radius="md" p="lg">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Select
            label="Status"
            placeholder="Todos"
            data={STATUS_OPTIONS}
            value={filters.status || null}
            onChange={(value) => updateFilter('status', value)}
            clearable
          />
          <Select
            label="Tipo"
            placeholder="Todos"
            data={TICKET_TYPES}
            value={filters.tipo || null}
            onChange={(value) => updateFilter('tipo', value)}
            clearable
          />
          <Select
            label="Urgência"
            placeholder="Todas"
            data={PRIORITIES}
            value={filters.urgencia || null}
            onChange={(value) => updateFilter('urgencia', value)}
            clearable
          />
        </SimpleGrid>
      </Paper>

      {error && (
        <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : tickets.length === 0 ? (
        <Paper withBorder radius="md" p="xl">
          <Center>
            <Stack align="center" gap="sm">
              <IconTicket size={42} color="var(--mantine-color-gray-5)" />
              <Title order={3}>Nenhum chamado encontrado</Title>
              <Text c="dimmed">Crie um chamado ou ajuste os filtros para visualizar registros.</Text>
              <Button component={Link} href="/novo" leftSection={<IconPlus size={18} />}>
                Criar primeiro chamado
              </Button>
            </Stack>
          </Center>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default Dashboard;
