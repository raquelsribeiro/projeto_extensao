// frontend/src/components/StatusBadge.tsx

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto':
        return 'bg-blue-100 text-blue-800';
      case 'Em Andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
