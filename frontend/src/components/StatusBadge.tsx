// frontend/src/components/StatusBadge.tsx

import { Badge } from '@mantine/core';

interface StatusBadgeProps {
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aberto':
      return 'blue';
    case 'Em Andamento':
      return 'yellow';
    case 'Concluído':
      return 'green';
    default:
      return 'gray';
  }
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge color={getStatusColor(status)} variant="light" radius="sm">
      {status}
    </Badge>
  );
};

export default StatusBadge;
