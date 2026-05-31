import { Container, Group, Text, ThemeIcon, Title } from '@mantine/core';
import { IconTicket } from '@tabler/icons-react';

const Header = () => {
  return (
    <header style={{ background: '#102a43', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Container size="lg" py="md">
        <Group justify="space-between">
          <Group gap="sm">
            <ThemeIcon color="cyan" variant="light" size={42} radius="md">
              <IconTicket size={24} />
            </ThemeIcon>
            <div>
              <Title order={1} size="h3" c="white">
                Sistema de Chamados
              </Title>
              <Text size="sm" c="blue.1">
                VT Innovation
              </Text>
            </div>
          </Group>
        </Group>
      </Container>
    </header>
  );
};

export default Header;
