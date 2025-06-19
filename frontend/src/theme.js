import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5865F2', // Discord blue
      light: '#7983F5',
      dark: '#3F46C7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF9800', // Orange
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#000000',
    },
    error: {
      main: '#F04747', // Discord red
      light: '#F47C7C',
      dark: '#C53636',
    },
    success: {
      main: '#43B581', // Discord green
      light: '#7FD4AE',
      dark: '#2E8057',
    },
    background: {
      default: '#F8F9FC',
      paper: '#FFFFFF',
      card: '#FFFFFF',
      darkCard: '#F0F2F5',
    },
    text: {
      primary: '#323339',
      secondary: '#5c5f66',
      disabled: '#9e9e9e',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 8px 16px rgba(0, 0, 0, 0.05)',
    '0px 10px 20px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.08)',
    '0px 14px 28px rgba(0, 0, 0, 0.10)',
    '0px 16px 32px rgba(0, 0, 0, 0.10)',
    '0px 18px 36px rgba(0, 0, 0, 0.12)',
    '0px 20px 40px rgba(0, 0, 0, 0.12)',
    '0px 22px 44px rgba(0, 0, 0, 0.14)',
    '0px 24px 48px rgba(0, 0, 0, 0.14)',
    '0px 26px 52px rgba(0, 0, 0, 0.16)',
    '0px 28px 56px rgba(0, 0, 0, 0.16)',
    '0px 30px 60px rgba(0, 0, 0, 0.18)',
    '0px 32px 64px rgba(0, 0, 0, 0.18)',
    '0px 34px 68px rgba(0, 0, 0, 0.20)',
    '0px 36px 72px rgba(0, 0, 0, 0.20)',
    '0px 38px 76px rgba(0, 0, 0, 0.22)',
    '0px 40px 80px rgba(0, 0, 0, 0.22)',
    '0px 42px 84px rgba(0, 0, 0, 0.24)',
    '0px 44px 88px rgba(0, 0, 0, 0.24)',
    '0px 46px 92px rgba(0, 0, 0, 0.26)',
    '0px 48px 96px rgba(0, 0, 0, 0.26)',
    '0px 50px 100px rgba(0, 0, 0, 0.28)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#3F46C7',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#F57C00',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#F8F9FC',
        },
      },
    },
  },
});

export default theme;