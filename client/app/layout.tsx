import '@/styles/globals.css';

import { appConfig } from '@/config/app';
import { MantineProvider, createTheme } from '@mantine/core';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const font = Work_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
};

const theme = createTheme({
  colors: {
    primary: [
      appConfig.colors.primary[200],
      appConfig.colors.primary[200],
      appConfig.colors.primary[300],
      appConfig.colors.primary[400],
      appConfig.colors.primary[500],
      appConfig.colors.primary[600],
      appConfig.colors.primary[700],
      appConfig.colors.primary[800],
      appConfig.colors.primary[900],
      appConfig.colors.primary[950],
    ],
  },
  fontFamily: 'inherit',
  primaryColor: 'primary',
  primaryShade: 4,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-mantine-color-scheme="light" lang="en">
      <body className={font.className}>
        <MantineProvider theme={theme}>
          <Notifications 
            position='top-right'
            withBorder />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}