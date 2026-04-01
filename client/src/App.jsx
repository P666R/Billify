import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Zoom, ToastContainer } from 'react-toastify';

import { Footer } from './components/Footer';
import { Layout } from './components/Layout';
import { NotFound } from './components/NotFound';

import { HomePage } from './pages/HomePage';
import { Navbar } from './components/Navbar';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { VerifiedPage } from './features/auth/pages/VerifiedPage';

import { useTitle } from './hooks/useTitle';

import { customTheme } from './customTheme';

const App = () => {
  useTitle('Billify - Home');
  const { user } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
        }}
      >
        {user && <Navbar />}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="auth/verify" element={<VerifiedPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Footer />
      </Box>
      <ToastContainer
        position="top-right"
        theme="colored"
        transition={Zoom}
        stacked
        autoClose={5000}
        closeOnClick
        pauseOnHover
      />
    </ThemeProvider>
  );
};

export default App;
