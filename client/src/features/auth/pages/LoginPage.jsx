import {
  Box,
  Container,
  Divider,
  Link,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router';
import { FaSignInAlt } from 'react-icons/fa';

import { AuthWrapper } from '../forms/AuthWrapper';
import { LoginForm } from '../forms/LoginForm';
import { GoogleLogin } from '../../../components/GoogleLogin';
import { fluidType } from '../../../customTheme';

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export const LoginPage = () => {
  const theme = useTheme();

  return (
    <AuthWrapper>
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Isolated outer animation boundary container */}
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Header Section */}
          <MotionDiv variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  pr: '.5rem',
                  display: 'inline-flex',
                }}
              >
                <svg width="0" height="0">
                  <linearGradient
                    id="sign-in-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop stopColor={theme.palette.primary.main} offset="0%" />
                    <stop
                      stopColor={theme.palette.secondary.main}
                      offset="100%"
                    />
                  </linearGradient>
                </svg>
                <FaSignInAlt
                  size={fluidType(30, 40)}
                  style={{ fill: 'url(#sign-in-gradient)' }}
                />
              </Box>

              <Typography
                variant="h1"
                fontWeight={900}
                sx={{
                  fontSize: fluidType(25, 35),
                  lineHeight: 1.2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.04em',
                }}
              >
                Log In
              </Typography>
            </Box>
          </MotionDiv>

          <MotionDiv variants={itemVariants} style={{ width: '100%' }}>
            <Typography
              textAlign="center"
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: fluidType(14, 16),
                mb: { xs: '.4rem', md: '1rem' },
                mt: '.5rem',
              }}
            >
              Welcome back!
              <br />
              Log in to continue managing your invoices
            </Typography>
          </MotionDiv>

          {/* Login Form Wrapper */}
          <MotionDiv variants={itemVariants} style={{ width: '100%' }}>
            <Box sx={{ width: '100%', mb: '.4rem' }}>
              <LoginForm />
            </Box>
          </MotionDiv>

          <Stack spacing={fluidType(1, 2)} sx={{ width: '100%' }}>
            {/* Don't have an account? */}
            <MotionDiv variants={itemVariants}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={fluidType(12, 14)}
                >
                  Don't have an account?&nbsp;
                </Typography>
                <Link
                  component={RouterLink}
                  to="/register"
                  viewTransition
                  sx={{
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: fluidType(14, 16),
                  }}
                >
                  Sign Up
                </Link>
              </Stack>
            </MotionDiv>

            {/* Resend verification email */}
            <MotionDiv variants={itemVariants}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={fluidType(12, 14)}
                >
                  Didn't get the verification email?&nbsp;
                </Typography>
                <Link
                  component={RouterLink}
                  to="/resend"
                  viewTransition
                  sx={{
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: fluidType(14, 16),
                  }}
                >
                  Resend Email
                </Link>
              </Stack>
            </MotionDiv>

            {/* OR CONTINUE WITH Google */}
            <MotionDiv variants={itemVariants} style={{ width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Divider
                  sx={{
                    flexGrow: 1,
                    height: '2px',
                    border: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                />
                <Typography
                  variant="caption"
                  color="primary.main"
                  fontWeight={900}
                  fontSize={fluidType(10, 15)}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  OR CONTINUE WITH
                </Typography>
                <Divider
                  sx={{
                    flexGrow: 1,
                    height: '2px',
                    border: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: '0.5rem',
                }}
              >
                <GoogleLogin />
              </Box>
            </MotionDiv>
          </Stack>
        </MotionDiv>
      </Container>
    </AuthWrapper>
  );
};
