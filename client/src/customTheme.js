import { createTheme } from '@mui/material';

// Fluid Utility (Calculates a smooth slope between screen widths)
export const fluidType = (minPx, maxPx, minWidth = 320, maxWidth = 1200) => {
  const rootSize = 16;
  const minRem = minPx / rootSize;
  const maxRem = maxPx / rootSize;
  const slope = (maxRem - minRem) / ((maxWidth - minWidth) / rootSize);
  const intersection = (-minWidth / rootSize) * slope + minRem;
  return `clamp(${minRem}rem, ${intersection.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${maxRem}rem)`;
};

export const customTheme = createTheme({
  palette: {
    background: { default: '#f8f9fa' },
    indigo: { main: '#6610f2' },
    orange: { main: '#f4511e' },
    green: { main: '#07f011' },
    blue: { main: '#34aadc' },
    yellow: { main: '#f57c00' },
    darkRed: { main: '#7f0000' },
  },

  // 2. Full Fluid Typography Scale
  typography: {
    h1: { fontSize: fluidType(32, 80), fontWeight: 800 },
    h2: { fontSize: fluidType(28, 60), fontWeight: 700 },
    h3: { fontSize: fluidType(24, 48), fontWeight: 700 },
    h4: { fontSize: fluidType(20, 34), fontWeight: 600 },
    h5: { fontSize: fluidType(18, 24), fontWeight: 600 },
    h6: { fontSize: fluidType(16, 20), fontWeight: 600 },

    subtitle1: { fontSize: fluidType(16, 20) },
    subtitle2: { fontSize: fluidType(14, 18), fontWeight: 500 },

    body1: { fontSize: fluidType(16, 18) },
    body2: { fontSize: fluidType(14, 16) },

    button: {
      fontSize: '0.875rem',
      textTransform: 'none',
    },

    caption: { fontSize: fluidType(12, 14) },
    overline: { fontSize: fluidType(10, 12), letterSpacing: '1px' },
  },

  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          color: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#ffffff',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: fluidType(16, 20),
        },
      },
    },
  },
});
