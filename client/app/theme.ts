import { createTheme, type MantineTheme } from '@mantine/core';

export const theme = createTheme({
  black: 'hsl(20 14.3% 4.1%)',
  white: 'hsl(60 9.1% 97.8%)',
  primaryColor: 'yellow',
  components: {
    Notification: {
      styles: {
        root: {
          backgroundColor: 'hsl(var(--background))',
          borderColor: 'hsl(var(--border))',
          '&::before': { backgroundColor: 'hsl(var(--primary))' },
        },
        title: {
          color: 'hsl(var(--foreground))',
        },
        description: {
          color: 'hsl(var(--muted-foreground))',
        },
        closeButton: {
          color: 'hsl(var(--muted-foreground))',
          '&:hover': {
            backgroundColor: 'hsl(var(--accent))',
          },
        },
      },
    },
  },
  colors: {
    dark: [
      'hsl(60 9.1% 97.8%)',    // Text color [0]
      'hsl(24 5.4% 63.9%)',    // Muted text [1]
      'hsl(20 14.3% 12%)',     // Subtle background [2]
      'hsl(20 14.3% 8%)',      // Main background [3]
      'hsl(24 5.7% 14%)',      // Lighter background [4]
      'hsl(20 14.3% 16%)',     // Even lighter background [5]
      'hsl(20 9.1% 91.8%)',    // Text [6]
      'hsl(24 5.7% 14%)',      // Border color [7]
      'hsl(20 14.3% 10%)',     // Input background [8]
      'hsl(15 20% 18%)',  
    ],
  },
}); 