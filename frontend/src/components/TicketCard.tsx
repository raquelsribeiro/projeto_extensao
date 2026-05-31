import Link from 'next/link';
import { ActionIcon, Card, Group, Stack, Text, Title, Tooltip } from '@mantine/core';
import { IconArrowRight, IconCalendarDue, IconUserCircle } from '@tabler/icons-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { Ticket } from '@/lib/api';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const formattedDate = new Date(ticket.created_at).toLocaleDateString('pt-BR');
  const responsible = ticket.responsible_name || (ticket.responsible_id ? 'Responsável não carregado' : 'Não atribuído');

  return (
    <Card component={Link} href={`/chamados/${ticket.id}`} withBorder shadow="xs" padding="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4} style={{ minWidth: 0 }}>
            <Title order={3} size="h4" lineClamp={2}>
              {ticket.title}
            </Title>
            <Text size="sm" c="dimmed" lineClamp={2}>
              {ticket.description}
            </Text>
          </Stack>
          <Tooltip label="Ver detalhes">
            <ActionIcon variant="subtle" color="blue" aria-label="Ver detalhes">
              <IconArrowRight size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Group gap="xs">
          <StatusBadge status={ticket.status} />
          <PriorityBadge urgency={ticket.priority} />
        </Group>

        <Group justify="space-between" gap="sm">
          <Group gap={6} style={{ minWidth: 0 }}>
            <IconUserCircle size={17} color="var(--mantine-color-gray-6)" />
            <Text size="sm" c="dimmed" truncate>
              {responsible}
            </Text>
          </Group>
          <Group gap={6}>
            <IconCalendarDue size={17} color="var(--mantine-color-gray-6)" />
            <Text size="sm" c="dimmed">
              {formattedDate}
            </Text>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};

export default TicketCard;
