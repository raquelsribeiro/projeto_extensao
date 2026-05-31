import { Stack, Text, Title } from '@mantine/core';
import TicketForm from '@/components/TicketForm';

const NewTicketPage = () => {
  return (
    <Stack gap="lg">
      <div>
        <Title order={1}>Criar novo chamado</Title>
        <Text c="dimmed" mt={4}>
          Registre uma demanda técnica com as informações necessárias para triagem e acompanhamento.
        </Text>
      </div>
      <TicketForm />
    </Stack>
  );
};

export default NewTicketPage;
