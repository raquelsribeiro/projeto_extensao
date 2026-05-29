// frontend/src/components/PriorityBadge.tsx

interface PriorityBadgeProps {
  urgency: string;
}

export default function PriorityBadge({ urgency }: PriorityBadgeProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica':
        return 'bg-red-100 text-red-800';
      case 'Alta':
        return 'bg-orange-100 text-orange-800';
      case 'Média':
        return 'bg-yellow-100 text-yellow-800';
      case 'Baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'Crítica':
        return '🔴';
      case 'Alta':
        return '🟠';
      case 'Média':
        return '🟡';
      case 'Baixa':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(urgency)}`}>
      {getPriorityEmoji(urgency)} {urgency}
    </span>
  );
}
