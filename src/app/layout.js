'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Solarized Dark Theme Colors
const solarizedDark = {
  base03: '#002b36',   // Darkest background
  base02: '#073642',   // Dark background
  base01: '#586e75',   // Dark content
  base00: '#657b83',   // Content
  base0: '#839496',    // Light content
  base1: '#93a1a1',    // Light background
  base2: '#eee8d5',    // Lightest background
  base3: '#fdf6e3',    // Lightest content
  
  // Accent colors
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900'
};

// Create a Material UI theme with Solarized Dark
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: solarizedDark.blue,
      light: '#5ba4e5',
      dark: '#1a6ba8',
      contrastText: solarizedDark.base3,
    },
    secondary: {
      main: solarizedDark.cyan,
      light: '#5bc4b8',
      dark: '#1a7a6e',
      contrastText: solarizedDark.base3,
    },
    error: {
      main: solarizedDark.red,
      light: '#e55a5a',
      dark: '#a81a1a',
    },
    warning: {
      main: solarizedDark.orange,
      light: '#e57a5a',
      dark: '#a85a1a',
    },
    info: {
      main: solarizedDark.violet,
      light: '#8a8fd4',
      dark: '#4a4f94',
    },
    success: {
      main: solarizedDark.green,
      light: '#a5b400',
      dark: '#5a6a00',
    },
    background: {
      default: solarizedDark.base03,
      paper: solarizedDark.base02,
    },
    text: {
      primary: solarizedDark.base0,
      secondary: solarizedDark.base1,
    },
    divider: solarizedDark.base01,
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      color: solarizedDark.base2,
    },
    h2: {
      color: solarizedDark.base2,
    },
    h3: {
      color: solarizedDark.base2,
    },
    h4: {
      color: solarizedDark.base2,
    },
    h5: {
      color: solarizedDark.base2,
    },
    h6: {
      color: solarizedDark.base2,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: solarizedDark.base02,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          borderRadius: 12,
          border: `1px solid ${solarizedDark.base01}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: solarizedDark.base02,
          borderBottom: `1px solid ${solarizedDark.base01}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: solarizedDark.base02,
          border: `1px solid ${solarizedDark.base01}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: solarizedDark.base01,
          color: solarizedDark.base0,
        },
      },
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 