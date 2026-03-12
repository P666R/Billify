import { Routes, Route } from 'react-router';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';

import { Footer } from './components/Footer';
import { Layout } from './components/Layout';
import { NotFound } from './components/NotFound';

import { HomePage } from './pages/HomePage';

import { useTitle } from './hooks/useTitle';

import { customTheme } from './customTheme';

const App = () => {
  useTitle('Billify - Home');
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Footer />
      </Box>
      <ToastContainer theme="dark" />
    </ThemeProvider>
  );
};

export default App;
