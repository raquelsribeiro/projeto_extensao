import { Badge } from '@mantine/core';

interface PriorityBadgeProps {
  urgency: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Crítica':
      return 'red';
    case 'Alta':
      return 'orange';
    case 'Média':
      return 'yellow';
    case 'Baixa':
      return 'green';
    default:
      return 'gray';
  }
};

const PriorityBadge = ({ urgency }: PriorityBadgeProps) => {
  return (
    <Badge color={getPriorityColor(urgency)} variant="light" radius="sm" leftSection="●">
      {urgency}
    </Badge>
  );
};

export default PriorityBadge;
