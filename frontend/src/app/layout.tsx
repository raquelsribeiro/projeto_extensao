// frontend/src/app/layout.tsx

import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import Header from '@/components/Header';
import '@mantine/core/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema de Chamados - VT Innovation',
  description: 'Sistema Interno de Chamados para a VT Innovation',
};

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
});

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="pt-BR">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Header />
          <main className="app-shell">
            {children}
          </main>
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;
