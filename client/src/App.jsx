import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import { Zoom, ToastContainer } from 'react-toastify';
import { Box, CssBaseline, CircularProgress } from '@mui/material';

import { useTitle } from './hooks/useTitle';
import { customTheme } from './customTheme';
import { ROLES } from './config/roles';

import { Layout } from './components/Layout';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthRequired } from './components/AuthRequired';

// Core Layout & Structural Pages (Eagerly Loaded)
import { HomePage } from './pages/HomePage';

// Code Splitting: Lazy load authentication and dashboard sub-bundles
const LoginPage = lazy(() =>
  import('./features/auth/pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  }))
);
const RegisterPage = lazy(() =>
  import('./features/auth/pages/RegisterPage').then((module) => ({
    default: module.RegisterPage,
  }))
);
const VerifiedPage = lazy(() =>
  import('./features/auth/pages/VerifiedPage').then((module) => ({
    default: module.VerifiedPage,
  }))
);
const ResendEmailTokenPage = lazy(() =>
  import('./features/auth/pages/ResendEmailTokenPage').then((module) => ({
    default: module.ResendEmailTokenPage,
  }))
);
const PasswordResetRequestPage = lazy(() =>
  import('./features/auth/pages/PasswordResetRequestPage').then((module) => ({
    default: module.PasswordResetRequestPage,
  }))
);
const PasswordResetPage = lazy(() =>
  import('./features/auth/pages/PasswordResetPage').then((module) => ({
    default: module.PasswordResetPage,
  }))
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  }))
);
const UserListPage = lazy(() =>
  import('./features/users/pages/UserListPage').then((module) => ({
    default: module.UserListPage,
  }))
);
const NotFound = lazy(() =>
  import('./components/NotFound').then((module) => ({
    default: module.NotFound,
  }))
);

const App = () => {
  useTitle('Billify - Home');
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const hasActiveSession = !!user?.user;
  const isAdmin = user?.user?.roles?.includes(ROLES.Admin);
  const isUser = user?.user?.roles?.includes(ROLES.User);

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
        {hasActiveSession && <Navbar />}

        {/* Suspense wrapper captures resolving component threads cleanly */}
        <Suspense
          fallback={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="auth/verify" element={<VerifiedPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="resend" element={<ResendEmailTokenPage />} />
              <Route
                path="reset_password_request"
                element={<PasswordResetRequestPage />}
              />
              <Route
                path="auth/reset_password"
                element={<PasswordResetPage />}
              />

              {/* Protected routes - User only */}
              {isUser && (
                <Route element={<AuthRequired allowedRoles={[ROLES.User]} />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                </Route>
              )}

              {/* Protected routes - Admin only */}
              {isAdmin && (
                <Route element={<AuthRequired allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users" element={<UserListPage />} />
                </Route>
              )}

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>

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
